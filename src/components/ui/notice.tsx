import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { PressableScale } from '@/src/components/ui/pressable-scale';
import { Text } from '@/src/components/ui/text';
import { toneColors, useTheme, useThemeColors } from '@/src/hooks/use-theme';
import type { Tone } from '@/src/theme/tokens';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type NoticeProps = {
  text: string;
  // Encabezado opcional, cuando el aviso necesita nombre («Cuenta sin verificar»).
  title?: string;
  // `primary` (por defecto) es el aviso normal del sistema; `warning` pide
  // atención; `danger` avisa de algo que salió mal; `success`, de algo logrado.
  tone?: Exclude<Tone, 'neutral'>;
  icon?: IconName;
  // Acción bajo el texto («Reenviar acceso», «Subir documentos»).
  action?: { label: string; onPress: () => void; loading?: boolean };
};

const ICONS: Record<Exclude<Tone, 'neutral'>, IconName> = {
  danger: 'alert-circle-outline',
  info: 'information-circle-outline',
  primary: 'information-circle-outline',
  success: 'checkmark-circle-outline',
  warning: 'warning-outline',
};

// Un aviso DENTRO de la pantalla: una o dos oraciones que explican algo o
// piden algo («Tu reservación quedará pendiente de aprobación»). Para avisar
// del resultado de una acción va el `Toast`; para una lista sin datos,
// `EmptyState`.
export function Notice({ text, title, tone = 'primary', icon, action }: NoticeProps) {
  const theme = useTheme();
  const colors = useThemeColors();
  const palette = toneColors(colors, tone);

  return (
    <View
      accessibilityRole={tone === 'danger' || tone === 'warning' ? 'alert' : undefined}
      style={[styles.banner, { backgroundColor: palette.tint, borderRadius: theme.radius.control }]}>
      <Ionicons color={palette.ink} name={icon ?? ICONS[tone]} size={18} />
      <View style={styles.copy}>
        {title ? <Text variant="labelStrong">{title}</Text> : null}
        {/* El texto en tinta, no del color del tono: se lee mejor y el color ya
            lo dan el fondo y el ícono. */}
        <Text variant="caption">{text}</Text>
        {action ? (
          <PressableScale
            accessibilityLabel={action.label}
            accessibilityState={{ busy: action.loading, disabled: action.loading }}
            disabled={action.loading}
            hitSlop={10}
            onPress={action.onPress}
            style={{ opacity: action.loading ? theme.motion.disabledOpacity : 1 }}>
            <Text style={{ color: palette.ink }} variant="buttonSmall">
              {action.label}
            </Text>
          </PressableScale>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  copy: {
    alignItems: 'flex-start',
    flex: 1,
    gap: 4,
  },
});
