import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/src/components/ui/text';
import { useTheme, useThemeColors } from '@/src/hooks/use-theme';

export type FilterPillOption<T extends string | number> = {
  key: T;
  label: string;
  // Cuántos hay en ese filtro.
  count?: number;
};

type FilterPillsProps<T extends string | number> = {
  options: readonly FilterPillOption<T>[];
  active: T;
  onChange: (key: T) => void;
};

// Los filtros de un listado: píldoras en una fila que se desliza. El elegido
// va en tinta; los demás, en superficie. No se animan al tocar: se usan
// decenas de veces al día.
//
// El aire bajo ellos lo pone el `gap` de la lista; nunca un margen propio, que
// lo duplicaría.
export function FilterPills<T extends string | number>({ options, active, onChange }: FilterPillsProps<T>) {
  const theme = useTheme();
  const colors = useThemeColors();

  return (
    <ScrollView
      accessibilityRole="radiogroup"
      contentContainerStyle={styles.row}
      horizontal
      keyboardShouldPersistTaps="handled"
      showsHorizontalScrollIndicator={false}>
      {options.map((option) => {
        const selected = option.key === active;
        const foreground = selected ? colors.surface : colors.text;

        return (
          <Pressable
            accessibilityLabel={option.count !== undefined ? `${option.label}, ${option.count}` : option.label}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            hitSlop={{ bottom: 6, top: 6 }}
            key={String(option.key)}
            onPress={() => onChange(option.key)}
            style={[
              styles.pill,
              {
                backgroundColor: selected ? colors.text : colors.surface,
                borderColor: selected ? colors.text : colors.border,
                borderRadius: theme.radius.pill,
                borderWidth: theme.border.width,
                minHeight: theme.size.control.sm,
              },
            ]}>
            <Text style={{ color: foreground }} variant="label">
              {option.label}
            </Text>
            {option.count !== undefined ? (
              // El contador en su cápsula: en el elegido, un velo de su propia
              // letra; en los demás, la superficie tenue.
              <View
                style={[
                  styles.count,
                  { backgroundColor: selected ? `${colors.surface}2E` : colors.surfaceMuted, borderRadius: theme.radius.pill },
                ]}>
                <Text style={{ color: foreground }} variant="label">
                  {option.count}
                </Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  count: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 22,
    paddingHorizontal: 6,
  },
  pill: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 1,
  },
});
