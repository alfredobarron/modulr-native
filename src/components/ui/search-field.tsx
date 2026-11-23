import { Ionicons } from '@expo/vector-icons';

import { PressableScale } from '@/src/components/ui/pressable-scale';
import { TextField } from '@/src/components/ui/text-field';
import { useThemeColors } from '@/src/hooks/use-theme';

type SearchFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  // Nombre para lector de pantalla («Buscar tareas»).
  label?: string;
};

// El buscador de una lista: un `TextField` sin etiqueta a la vista, con la
// lupa y, cuando hay texto, la «x» que lo limpia de un toque.
export function SearchField({ value, onChangeText, placeholder = 'Buscar', label = 'Buscar' }: SearchFieldProps) {
  const colors = useThemeColors();

  return (
    <TextField
      autoCapitalize="none"
      autoCorrect={false}
      hideLabel
      label={label}
      onChangeText={onChangeText}
      placeholder={placeholder}
      prefix={<Ionicons color={colors.textMuted} name="search" size={18} />}
      returnKeyType="search"
      suffix={
        value.length > 0 ? (
          <PressableScale accessibilityLabel="Borrar búsqueda" hitSlop={12} onPress={() => onChangeText('')}>
            <Ionicons color={colors.textMuted} name="close-circle" size={20} />
          </PressableScale>
        ) : undefined
      }
      value={value}
    />
  );
}
