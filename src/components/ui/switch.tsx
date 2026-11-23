import { Ionicons } from '@expo/vector-icons';
import { Platform, Switch as RNSwitch, StyleSheet, View } from 'react-native';

import { PressableScale } from '@/src/components/ui/pressable-scale';
import { Text } from '@/src/components/ui/text';
import { useTheme, useThemeColors } from '@/src/hooks/use-theme';

type SwitchProps = {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  // Nombre para lector de pantalla cuando va suelto (sin `SwitchRow`).
  accessibilityLabel?: string;
  // `danger`: el riel APAGADO va en rojo. Solo para interruptores donde
  // apagar es lo grave (bloquear un acceso).
  offTone?: 'neutral' | 'danger';
};

// El interruptor: el nativo de cada sistema, con los colores del tema. Ninguna
// pantalla lo colorea por su cuenta. Casi siempre va dentro de un `SwitchRow`.
export function Switch({ value, onValueChange, disabled = false, accessibilityLabel, offTone = 'neutral' }: SwitchProps) {
  const colors = useThemeColors();
  const offTrack = offTone === 'danger' ? colors.red : colors.off;

  return (
    <RNSwitch
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      ios_backgroundColor={offTrack}
      onValueChange={onValueChange}
      thumbColor={colors.switchThumb}
      trackColor={{ false: offTrack, true: colors.switchOn }}
      value={value}
      // En web el botón encendido se pinta con `activeThumbColor`; sin él sale
      // el verde azulado de serie.
      {...(Platform.OS === 'web' ? { activeThumbColor: colors.switchThumb } : {})}
    />
  );
}

type SwitchRowProps = {
  label: string;
  // Qué IMPLICA el estado actual, en lenguaje llano: «Puede entrar a tu casa»
  // contra «No puede entrar a tu casa».
  description?: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  offTone?: 'neutral' | 'danger';
};

// La forma habitual de un interruptor: etiqueta, lo que implica y el control.
// La fila ENTERA es el interruptor (y así lo anuncia el lector de pantalla):
// no hay que atinarle al control.
export function SwitchRow({ label, description, icon, value, onValueChange, disabled = false, offTone }: SwitchRowProps) {
  const theme = useTheme();
  const colors = useThemeColors();

  return (
    <PressableScale
      accessibilityLabel={description ? `${label}. ${description}` : label}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={[styles.row, { minHeight: theme.size.control.lg, opacity: disabled ? theme.motion.disabledOpacity : 1 }]}>
      {icon ? <Ionicons color={colors.text} name={icon} size={20} /> : null}
      <View style={styles.copy}>
        <Text variant="title">{label}</Text>
        {description ? (
          <Text colorToken="textMuted" numberOfLines={2} variant="caption">
            {description}
          </Text>
        ) : null}
      </View>
      {/* Solo la fila recibe el toque; el control es visual. El View es
          necesario: `pointerEvents` directo sobre el Switch nativo se ignora. */}
      <View pointerEvents="none">
        <Switch offTone={offTone} value={value} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  copy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
});
