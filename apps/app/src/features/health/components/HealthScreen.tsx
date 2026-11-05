import { Platform, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

import { useDatabaseHealth } from '../hooks/use-database-health';
import { useEdgeHello } from '../hooks/use-edge-hello';
import { type Status, StatusRow } from './StatusRow';

function toStatus(query: { isPending: boolean; isError: boolean }): Status {
  if (query.isPending) return 'loading';
  return query.isError ? 'error' : 'ok';
}

const SafeAreaView = withUniwind(RNSafeAreaView);

const platformKeys = { web: 'web', ios: 'ios', android: 'android' } as const;

export function HealthScreen() {
  const { t } = useTranslation();
  const edge = useEdgeHello();
  const database = useDatabaseHealth();
  const platformKey =
    Platform.OS in platformKeys ? platformKeys[Platform.OS as keyof typeof platformKeys] : 'other';

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="w-full max-w-[560px] grow gap-6 self-center p-6">
        <View className="gap-1">
          <Text className="text-[34px] font-bold text-ink" accessibilityRole="header">
            {t('home.title')}
          </Text>
          <Text className="text-base text-muted">{t('home.subtitle')}</Text>
        </View>
        <View className="gap-3">
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
