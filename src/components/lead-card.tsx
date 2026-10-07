import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, spacing } from '@/constants/brand';
import { Lead } from '@/types/lead';

const getField = (lead: Lead, name: string) =>
    lead.field_data?.find((f) => f.name === name)?.values[0];

const getInitials = (name: string) =>
    name
        .replace(/[^a-zA-Z ]/g, '')
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

export function LeadCard({ lead }: { lead: Lead }) {
    const name = getField(lead, 'full_name') ?? 'Unknown';
    const email = getField(lead, 'email') ?? 'No email';
    const time = lead.created_time
        ? new Date(lead.created_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'Just now';

    const enter = useRef(new Animated.Value(0)).current;
    const [isNew, setIsNew] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsNew(false), 8000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        Animated.timing(enter, { toValue: 1, duration: 550, useNativeDriver: true }).start();
    }, [enter]);

    return (
        <Animated.View
            style={[
                styles.card,
                {
                    opacity: enter,
                    transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
                },
            ]}>
            <View style={styles.avatar}>
                <Text style={styles.initials}>{getInitials(name)}</Text>
            </View>

            <View style={styles.info}>
                <View style={styles.nameRow}>
                    <Text style={styles.name}>{name}</Text>
                    {isNew && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>NEW</Text>
                        </View>
                    )}
                </View>
            </View>

            <Text style={styles.time}>{time}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.lg,
        padding: spacing.xl,
        marginBottom: spacing.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        shadowColor: colors.primary,
        shadowOpacity: 0.1,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: radius.full,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    initials: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.primaryText },
    info: { flex: 1 },
    name: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.textPrimary },
    email: { fontFamily: fonts.body, fontSize: 14, color: colors.textSecondary, marginTop: spacing.xs },
    time: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    badge: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: radius.full,
    },
    badgeText: { fontFamily: fonts.bodyBold, fontSize: 11, color: colors.primaryText },
});