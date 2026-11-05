import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export type Status = 'loading' | 'ok' | 'error';

const dotClass: Record<Status, string> = {
  loading: 'bg-pending',
  ok: 'bg-success',
  error: 'bg-danger',
};

const stateClass: Record<Status, string> = {
  loading: 'text-pending',
  ok: 'text-success',
  error: 'text-danger',
};

type Props = {
  name: string;
  status: Status;
  detail?: string;
  testID?: string;
};

export function StatusRow({ name, status, detail, testID }: Props) {
  const { t } = useTranslation();
  const state = t(`status.${status}`);
  return (
    <View
      testID={testID}
      className="flex-row items-center gap-3 rounded-xl border border-line bg-surface p-4"
      accessible
      accessibilityLabel={t('status.rowLabel', { name, state, detail: detail ?? '' })}
    >
      <View className={`size-3 rounded-full ${dotClass[status]}`} />
      <View className="flex-1 gap-1">
        <Text className="text-base font-semibold text-foreground">{name}</Text>
        {detail ? <Text className="text-[13px] text-muted">{detail}</Text> : null}
      </View>
      <Text className={`text-[13px] font-semibold ${stateClass[status]}`}>{state}</Text>
    </View>
  );
}
