import { useEffect, useState } from 'react';

import { ConnectionStatus } from '@/components/status-pill';
import { WS_URL } from '@/constants/server';
import { Lead } from '@/types/lead';

const RETRY_MS = 2000;

export function useLeads() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [status, setStatus] = useState<ConnectionStatus>('connecting');

    useEffect(() => {
        let ws: WebSocket;
        let retry: ReturnType<typeof setTimeout>;
        let stopped = false;

        const connect = () => {
            setStatus('connecting');
            ws = new WebSocket(WS_URL);

            ws.onopen = () => setStatus('connected');

            ws.onmessage = (event) => {
                const lead: Lead = JSON.parse(event.data);
                if (!lead.id) return;
                setLeads((current) =>
                    current.some((l) => l.id === lead.id) ? current : [lead, ...current]
                );
            };

            ws.onclose = () => {
                setStatus('disconnected');
                if (!stopped) retry = setTimeout(connect, RETRY_MS);
            };
        };

        connect();

        return () => {
            stopped = true;
            clearTimeout(retry);
            ws.close();
        };
    }, []);

    return { leads, status };
}