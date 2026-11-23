import { Ionicons } from '@expo/vector-icons';
import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { PressableScale } from '@/src/components/ui/pressable-scale';
import { Text } from '@/src/components/ui/text';
import { useTheme, useThemeColors } from '@/src/hooks/use-theme';

// Lo que comparten TODOS los campos de un formulario (texto, selector, fecha):
// la etiqueta arriba, la caja con borde y el renglón de ayuda o de error. Así
// se leen como la misma pieza y se alinean entre sí.

type FieldFrameProps = PropsWithChildren<{
  label: string;
  hideLabel?: boolean;
  // Ayuda bajo el campo. El error la reemplaza.
  hint?: string;
  errorText?: string | null;
  disabled?: boolean;
}>;

export function FieldFrame({ label, hideLabel = false, hint, errorText, disabled = false, children }: FieldFrameProps) {
  const theme = useTheme();

  return (
    <View style={[styles.frame, { opacity: disabled ? theme.motion.disabledOpacity : 1 }]}>
      {hideLabel ? null : <Text variant="fieldLabel">{label}</Text>}
      {children}
      {errorText ? (
        <Text accessibilityLiveRegion="polite" colorToken="redInk" variant="caption">
          {errorText}
        </Text>
      ) : hint ? (
        <Text colorToken="textMuted" variant="caption">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

// La caja de un campo. El borde dice el estado: error, enfocado (el acento en
// su versión legible) o en reposo. El grosor no cambia, para que nada brinque.
export function useFieldBoxStyle(state: { focused?: boolean; error?: boolean; disabled?: boolean; multiline?: boolean }): ViewStyle {
  const theme = useTheme();
  const colors = useThemeColors();

  return {
    backgroundColor: state.disabled ? colors.surfaceMuted : colors.input,
    borderColor: state.error ? colors.redInk : state.focused ? colors.link : colors.borderStrong,
    borderRadius: theme.radius.control,
    borderWidth: theme.border.width,
    minHeight: state.multiline ? theme.size.control.lg * 2 : theme.size.control.lg,
  };
}

// Relleno lateral del contenido de la caja.
export function useFieldSidePadding() {
  return useTheme().spacing.controlHorizontal - 6;
}

type FieldButtonProps = {
  // Nombre para lector de pantalla: la etiqueta y lo elegido.
  accessibilityLabel: string;
  value: string | null;
  placeholder: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  error?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

// La caja de un campo que no se escribe sino que ABRE algo (un selector, un
// calendario): se ve igual que un campo de texto, con la flecha a la derecha.
export function FieldButton({ accessibilityLabel, value, placeholder, icon, error, disabled = false, onPress }: FieldButtonProps) {
  const colors = useThemeColors();
  const boxStyle = useFieldBoxStyle({ disabled, error });
  const side = useFieldSidePadding();

  return (
    <PressableScale
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, boxStyle, { paddingHorizontal: side }]}>
      {icon ? <Ionicons color={value ? colors.text : colors.textMuted} name={icon} size={18} /> : null}
      <Text colorToken={value ? 'text' : 'textMuted'} numberOfLines={1} style={styles.value}>
        {value ?? placeholder}
      </Text>
      {disabled ? null : <Ionicons color={colors.textMuted} name="chevron-down" size={18} />}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  frame: {
    gap: 6,
  },
  value: {
    flex: 1,
    minWidth: 0,
  },
});
