import { FlatList, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { LeadCard } from '@/components/lead-card';
import { StatusPill } from '@/components/status-pill';
import { colors, fonts, spacing } from '@/constants/brand';
import { useLeads } from '@/hooks/use-leads';

export default function HomeScreen() {
  const { leads, status } = useLeads();

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={leads}
      keyExtractor={(lead) => lead.id}
      renderItem={({ item }) => <LeadCard lead={item} />}
      ListEmptyComponent={<EmptyState />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Meta Leads</Text>
          <View style={styles.row}>
            <StatusPill status={status} />
            <Text style={styles.count}>
              {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
            </Text>
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xxl, paddingTop: 70 },
  header: { marginBottom: spacing.xxl },
  title: {
    fontFamily: fonts.display,
    fontSize: 40,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  count: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.accent },
});