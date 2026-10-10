import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, spacing } from '@/constants/brand';
import { Lead } from '@/types/lead';

const getField = (lead: Lead, name: string): string | undefined =>
    lead.field_data?.find((field) => field.name === name)?.values?.[0];

const getInitials = (name: string): string => {
    const cleanedName = name
        .replace(/[^a-zA-Z0-9 ]/g, ' ')
        .trim();

    if (!cleanedName) return 'L';

    return cleanedName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
};

const formatLeadTime = (createdTime?: string): string => {
    if (!createdTime) return 'Just now';

    const date = new Date(createdTime);

    if (Number.isNaN(date.getTime())) return 'Just now';

    return date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
    });
};

export function LeadCard({ lead }: { lead: Lead }) {
    const name = getField(lead, 'full_name')?.trim() || 'Unknown lead';
    const email = getField(lead, 'email')?.trim();
    const time = formatLeadTime(lead.created_time);

    const initials = getInitials(name);
    const enter = useRef(new Animated.Value(0)).current;
    const [isNew, setIsNew] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsNew(false), 8000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const animation = Animated.timing(enter, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        });

        animation.start();

        return () => animation.stop();
    }, [enter]);

    return (
        <Animated.View
            style={[
                styles.card,
                {
                    opacity: enter,
                    transform: [
                        {
                            translateY: enter.interpolate({
                                inputRange: [0, 1],
                                outputRange: [8, 0],
                            }),
                        },
                    ],
                },
            ]}
        >
            <View style={styles.avatar}>
                <Text style={styles.initials}>{initials}</Text>
            </View>

            <View style={styles.info}>
                <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={1}>
                        {name}
                    </Text>

                    {isNew && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>NEW</Text>
                        </View>
                    )}
                </View>

                <Text
                    style={[styles.email, !email && styles.missingEmail]}
                    numberOfLines={1}
                >
                    {email || 'Email not provided'}
                </Text>

                <View style={styles.metaRow}>
                    <View style={styles.metaDot} />
                    <Text style={styles.time}>{time}</Text>
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.lg,
        marginBottom: spacing.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        shadowColor: '#000000',
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },

    avatar: {
        width: 46,
        height: 46,
        borderRadius: radius.full,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },

    initials: {
        fontFamily: fonts.bodyBold,
        fontSize: 14,
        color: colors.primaryText,
        letterSpacing: 0.4,
    },

    info: {
        flex: 1,
        minWidth: 0,
        gap: spacing.xs,
    },

    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        minWidth: 0,
    },

    name: {
        flexShrink: 1,
        fontFamily: fonts.bodyBold,
        fontSize: 15,
        lineHeight: 21,
        color: colors.textPrimary,
    },

    email: {
        fontFamily: fonts.body,
        fontSize: 13,
        lineHeight: 18,
        color: colors.textSecondary,
    },

    missingEmail: {
        color: colors.textMuted,
        fontStyle: 'italic',
    },

    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginTop: 2,
    },

    metaDot: {
        width: 5,
        height: 5,
        borderRadius: radius.full,
        backgroundColor: colors.textMuted,
    },

    time: {
        fontFamily: fonts.body,
        fontSize: 11,
        color: colors.textMuted,
    },

    badge: {
        flexShrink: 0,
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.sm,
        paddingVertical: 3,
        borderRadius: radius.full,
    },

    badgeText: {
        fontFamily: fonts.bodyBold,
        fontSize: 9,
        letterSpacing: 0.6,
        color: colors.primaryText,
    },
});