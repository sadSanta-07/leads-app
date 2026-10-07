import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, spacing } from '@/constants/brand';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

const config = {
  connected: { label: 'Live', color: colors.successLight },
  connecting: { label: 'Connecting', color: colors.warning },
  disconnected: { label: 'Offline', color: colors.danger },
};

export function StatusPill({ status }: { status: ConnectionStatus }) {
  const pulse = useRef(new Animated.Value(1)).current;
  const { label, color } = config[status];

  useEffect(() => {
    if (status !== 'connected') {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.3, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [status, pulse]);

  return (
    <View style={styles.pill}>
      <Animated.View style={[styles.dot, { backgroundColor: color, opacity: pulse }]} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
  },
  dot: { width: 8, height: 8, borderRadius: radius.full },
  label: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.textSecondary },
});