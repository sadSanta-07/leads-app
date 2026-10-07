import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, spacing } from '@/constants/brand';

export function EmptyState() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pulse, { toValue: 1, duration: 1800, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const ringStyle = {
    opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] }),
    transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 3] }) }],
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.radar}>
        <Animated.View style={[styles.ring, ringStyle]} />
        <View style={styles.dot} />
      </View>

      <Text style={styles.title}>Waiting for leads</Text>
      <Text style={styles.body}>
        Submit a test lead from Meta's Lead Ads Testing Tool and it will appear here instantly.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingTop: spacing.xxxl * 2 },
  radar: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xxxl },
  ring: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dot: { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.primary },
  title: { fontFamily: fonts.display, fontSize: 30, color: colors.textPrimary, marginBottom: spacing.sm },
  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 21,
  },
});