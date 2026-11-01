import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, typeScale } from '@/ui/tokens';

import { useDatabaseHealth } from '../hooks/use-database-health';
import { useEdgeHello } from '../hooks/use-edge-hello';
import { type Status, StatusRow } from './StatusRow';

function toStatus(query: { isPending: boolean; isError: boolean }): Status {
  if (query.isPending) return 'loading';
  return query.isError ? 'error' : 'ok';
}

const platformKeys = { web: 'web', ios: 'ios', android: 'android' } as const;

export function HealthScreen() {
  const { t } = useTranslation();
  const edge = useEdgeHello();
  const database = useDatabaseHealth();
  const platformKey =
    Platform.OS in platformKeys ? platformKeys[Platform.OS as keyof typeof platformKeys] : 'other';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            {t('home.title')}
          </Text>
          <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
        </View>
        <View style={styles.rows}>
          <StatusRow
            testID="status-frontend"
            name={t('status.frontend')}
            status="ok"
            detail={t(`status.platform.${platformKey}`)}
          />
          <StatusRow
            testID="status-backend"
            name={t('status.backend')}
            status={toStatus(edge)}
            detail={edge.data?.message}
          />
          <StatusRow
            testID="status-database"
            name={t('status.database')}
            status={toStatus(database)}
            detail={database.data?.message}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    padding: spacing.xl,
    gap: spacing.xl,
  },
  header: { gap: spacing.xs },
  title: { ...typeScale.display, color: colors.accent },
  subtitle: { ...typeScale.body, color: colors.textMuted },
  rows: { gap: spacing.md },
});
