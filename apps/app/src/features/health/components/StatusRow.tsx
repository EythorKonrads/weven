import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors, radii, spacing, typeScale } from '@/ui/tokens';

export type Status = 'loading' | 'ok' | 'error';

const stateColor: Record<Status, string> = {
  loading: colors.pending,
  ok: colors.success,
  error: colors.danger,
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
      style={styles.row}
      accessible
      accessibilityLabel={t('status.rowLabel', { name, state, detail: detail ?? '' })}
    >
      <View style={[styles.dot, { backgroundColor: stateColor[status] }]} />
      <View style={styles.text}>
        <Text style={styles.name}>{name}</Text>
        {detail ? <Text style={styles.detail}>{detail}</Text> : null}
      </View>
      <Text style={[styles.state, { color: stateColor[status] }]}>{state}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.md,
  },
  dot: { width: 12, height: 12, borderRadius: radii.pill },
  text: { flex: 1, gap: spacing.xs },
  name: { ...typeScale.body, fontWeight: '600', color: colors.text },
  detail: { ...typeScale.caption, color: colors.textMuted },
  state: { ...typeScale.caption, fontWeight: '600' },
});
