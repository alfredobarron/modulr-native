import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Text } from '@/src/components/ui/text';
import { toneColors, useTheme, useThemeColors } from '@/src/hooks/use-theme';
import type { Tone } from '@/src/theme/tokens';

type StatusProps = {
  // La palabra del estado. Siempre va: el color solo no dice nada (ni a quien
  // no distingue colores, ni a un lector de pantalla).
  label: string;
  // Qué significa: `success` bien, `warning` pendiente, `danger` mal,
  // `primary` nuevo o activo, `info` informativo, `neutral` inactivo.
  tone?: Tone;
  //   dot    Punto + palabra en tinta. Para renglones de una lista.
  //   badge  Lo mismo dentro de una píldora neutra. Para encabezados y tarjetas.
  //   tint   Píldora del color del tono, sin punto. Cuando el estado debe
  //          saltar a la vista entre varios (un tablero).
  variant?: 'dot' | 'badge' | 'tint';
  style?: StyleProp<ViewStyle>;
};

const DOT = 7;

// El estado de algo, en una sola pieza: una tarea, un pago, una cuenta.
export function Status({ label, tone = 'neutral', variant = 'dot', style }: StatusProps) {
  const theme = useTheme();
  const colors = useThemeColors();
  const palette = toneColors(colors, tone);

  if (variant === 'tint') {
    return (
      <View style={[styles.pill, { backgroundColor: palette.tint, borderRadius: theme.radius.pill }, style]}>
        <Text style={{ color: palette.ink }} variant="label">
          {label}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.row,
        variant === 'badge' ? [styles.pill, { backgroundColor: colors.surfaceNeutral, borderRadius: theme.radius.pill }] : null,
        style,
      ]}>
      <View style={[styles.dot, { backgroundColor: palette.solid }]} />
      <Text variant={variant === 'badge' ? 'label' : 'caption'}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    borderRadius: DOT / 2,
    flexShrink: 0,
    height: DOT,
    width: DOT,
  },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  row: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 6,
  },
});
