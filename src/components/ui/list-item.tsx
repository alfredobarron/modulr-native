import { Ionicons } from '@expo/vector-icons';
import { Children, Fragment, PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { PressableScale } from '@/src/components/ui/pressable-scale';
import { Skeleton } from '@/src/components/ui/skeleton';
import { Text } from '@/src/components/ui/text';
import { toneColors, useTheme, useThemeColors } from '@/src/hooks/use-theme';
import type { Tone } from '@/src/theme/tokens';

type ListItemProps = {
  title: string;
  // Sin `onPress` el renglón es de solo lectura: no responde al toque.
  onPress?: () => void;
  accessibilityLabel?: string;
  // Lo que identifica al renglón, a la izquierda: un ícono en su recuadro…
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  // …o cualquier otra cosa (un `Avatar`, un ícono de otra familia).
  leading?: ReactNode;
  // El estado abre el segundo renglón: punto del tono y la palabra en tinta.
  status?: { label: string; tone: Tone };
  // Lo que sigue en ese mismo renglón (el tipo, la fecha, la tienda).
  meta?: string;
  // Tercer renglón, para lo que no cabe en el segundo: la vista previa de un
  // mensaje.
  detail?: string;
  // Bloque a la derecha: un monto, un `Status`, un punto de «sin leer».
  trailing?: ReactNode;
  //   card   Cada renglón es su propia tarjeta. Para listados (tareas, pagos).
  //   plain  Sin caja: dentro de una `Card`, una hoja o un `ListGroup`.
  variant?: 'card' | 'plain';
  // Registro apagado (un acceso inactivo, algo cerrado): el recuadro del ícono
  // y el título se van a gris.
  dimmed?: boolean;
  // Renglón destructivo de un menú («Eliminar cuenta»): título e ícono en rojo.
  danger?: boolean;
};

const CHIP = 40;

// El renglón de toda lista: lo que identifica, el título, una línea de estado
// y datos, y algo a la derecha. Sin flecha: el renglón entero ya se lee
// tocable.
export function ListItem({
  title,
  onPress,
  accessibilityLabel,
  icon,
  leading,
  status,
  meta,
  detail,
  trailing,
  variant = 'card',
  dimmed = false,
  danger = false,
}: ListItemProps) {
  const theme = useTheme();
  const colors = useThemeColors();
  const ink = danger ? colors.redInk : dimmed ? colors.textMuted : colors.text;

  const boxStyle =
    variant === 'card'
      ? {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: theme.radius.card,
          borderWidth: theme.border.width,
          padding: theme.spacing.cardPadding,
        }
      : { minHeight: theme.size.control.lg, paddingVertical: 10 };

  const content = (
    <>
      {leading ??
        (icon ? (
          <View style={[styles.chip, { backgroundColor: colors.surfaceMuted, borderRadius: theme.radius.control }]}>
            <Ionicons color={ink} name={icon} size={20} />
          </View>
        ) : null)}
      <View style={styles.copy}>
        {/* UN renglón: filas de alto parejo, sin que una trunque y otra envuelva. */}
        <Text numberOfLines={1} style={{ color: ink }} variant="title">
          {title}
        </Text>
        {status || meta ? (
          <View style={styles.metaRow}>
            {status ? <View style={[styles.dot, { backgroundColor: toneColors(colors, status.tone).solid }]} /> : null}
            <Text colorToken="textMuted" numberOfLines={1} style={styles.metaText} variant="caption">
              {status ? (
                <Text colorToken="text" variant="caption">
                  {status.label}
                </Text>
              ) : null}
              {status && meta ? `, ${meta}` : meta}
            </Text>
          </View>
        ) : null}
        {detail ? (
          <Text colorToken="textMuted" numberOfLines={1} variant="caption">
            {detail}
          </Text>
        ) : null}
      </View>
      {trailing}
    </>
  );

  if (!onPress) {
    return <View style={[styles.row, boxStyle]}>{content}</View>;
  }

  return (
    <PressableScale accessibilityLabel={accessibilityLabel ?? title} onPress={onPress} style={[styles.row, boxStyle]}>
      {content}
    </PressableScale>
  );
}

// La silueta de un `ListItem` mientras carga: mismas medidas, para que la
// lista no brinque al llegar los datos.
export function ListItemSkeleton({ variant = 'card', detail = false }: { variant?: 'card' | 'plain'; detail?: boolean }) {
  const theme = useTheme();
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.row,
        variant === 'card'
          ? {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: theme.radius.card,
              borderWidth: theme.border.width,
              padding: theme.spacing.cardPadding,
            }
          : { minHeight: theme.size.control.lg, paddingVertical: 10 },
      ]}>
      <Skeleton borderRadius={theme.radius.control} height={CHIP} width={CHIP} />
      <View style={[styles.copy, styles.skeletonCopy]}>
        <Skeleton height={14} width="60%" />
        <Skeleton height={12} width="40%" />
        {detail ? <Skeleton height={12} width="78%" /> : null}
      </View>
    </View>
  );
}

// Varios `ListItem` en `plain` como un solo bloque, separados por una línea
// fina: un menú de cuenta, las opciones de un perfil. Va dentro de una `Card`
// o directo sobre el fondo.
export function ListGroup({ children }: PropsWithChildren) {
  const colors = useThemeColors();
  const items = Children.toArray(children);

  return (
    <View>
      {items.map((child, index) => (
        <Fragment key={index}>
          {index > 0 ? <View style={[styles.separator, { backgroundColor: colors.border }]} /> : null}
          {child}
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    height: CHIP,
    justifyContent: 'center',
    width: CHIP,
  },
  copy: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  dot: {
    borderRadius: 4,
    flexShrink: 0,
    height: 7,
    width: 7,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    minWidth: 0,
  },
  metaText: {
    flexShrink: 1,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
  skeletonCopy: {
    gap: 8,
  },
});
