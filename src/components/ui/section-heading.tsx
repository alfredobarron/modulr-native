import { StyleSheet, View } from 'react-native';

import { PressableScale } from '@/src/components/ui/pressable-scale';
import { Text } from '@/src/components/ui/text';
import { useTheme } from '@/src/hooks/use-theme';

// Aire TOTAL alrededor del encabezado, igual en toda la app. Más arriba que
// abajo a propósito: el título pertenece al bloque que abre, no al que cierra.
const SPACING = { bottom: 14, top: 28 };

type SectionHeadingProps = {
  title: string;
  // Cuántos hay, junto al título.
  count?: number;
  // Acción a la derecha del mismo renglón («Ver todo»). Con ella el renglón
  // COMPLETO es el botón, no solo la etiqueta.
  action?: { label: string; onPress: () => void };
  // Primer encabezado de la pantalla: sin el aire de arriba, que ahí ya lo
  // pone el margen del contenido.
  first?: boolean;
};

// El encabezado que parte una pantalla o una lista en bloques: los días de un
// historial, las secciones de un perfil.
export function SectionHeading({ title, count, action, first = false }: SectionHeadingProps) {
  const theme = useTheme();
  // El `gap` del contenedor SE SUMA a estos márgenes, así que se resta: lo que
  // se ve es SPACING, no SPACING + gap.
  const spacing = {
    marginBottom: SPACING.bottom - theme.spacing.gap,
    marginTop: first ? 0 : SPACING.top - theme.spacing.gap,
  };

  const inner = (
    <>
      <View style={styles.left}>
        <Text accessibilityRole="header" numberOfLines={1} variant="cardTitle">
          {title}
        </Text>
        {count !== undefined ? (
          <Text colorToken="link" variant="data">
            {count}
          </Text>
        ) : null}
      </View>
      {action ? (
        <Text colorToken="link" variant="labelStrong">
          {action.label}
        </Text>
      ) : null}
    </>
  );

  if (!action) {
    return <View style={[styles.row, spacing]}>{inner}</View>;
  }

  return (
    <PressableScale
      accessibilityLabel={`${title}, ${action.label}`}
      onPress={action.onPress}
      style={[styles.row, styles.actionable, spacing]}>
      {inner}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  // Con acción el renglón entero es el botón: alto cómodo para el pulgar.
  actionable: {
    minHeight: 32,
  },
  left: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    minWidth: 0,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
});
