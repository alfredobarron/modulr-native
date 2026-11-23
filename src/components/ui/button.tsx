import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { PressableScale } from '@/src/components/ui/pressable-scale';
import { Text } from '@/src/components/ui/text';
import { useTheme, useThemeColors } from '@/src/hooks/use-theme';
import type { Palette, Size } from '@/src/theme/tokens';

// Módulo NATIVO opcional: si la app no trae `expo-haptics`, el botón
// simplemente no vibra. El tipo va escrito a mano para no depender de él.
type HapticsModule = {
  ImpactFeedbackStyle: { Light: unknown };
  impactAsync: (style: never) => Promise<void>;
};
let Haptics: HapticsModule | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Haptics = require('expo-haptics');
} catch {
  Haptics = null;
}

type IconName = React.ComponentProps<typeof Ionicons>['name'];

// Cuatro variantes. Una nueva entra cuando una pantalla real la pida, no antes.
//
//   primary    La acción de la pantalla. Una sola.
//   secondary  La alternativa: contorno marcado sobre la superficie.
//   ghost      Solo texto, sin caja. Para la acción que no debe pesar pero
//              tampoco esconderse: «Olvidé mi contraseña», «Cerrar sesión»,
//              «Ver todo».
//   danger     Lo destructivo («Eliminar», «Cancelar suscripción»). Su aspecto lo
//              decide el tema: rojo tenue en Modulr, contorno sobrio en una
//              marca que ya es roja.
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = {
  // El texto del botón y su nombre para lector de pantalla. En `iconOnly` no
  // se pinta, pero sigue siendo obligatorio: un ícono solo no se lee.
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: Size;
  icon?: IconName;
  iconRight?: IconName;
  // Cuadrado, con solo el ícono.
  iconOnly?: boolean;
  // Ocupa el ancho de su contenedor. Sin él, mide lo que su contenido.
  fullWidth?: boolean;
  // Mientras carga no se puede tocar y el ancho NO cambia: el contenido se
  // oculta y el indicador va encima.
  loading?: boolean;
  disabled?: boolean;
  // Cuando la etiqueta sola no alcanza («Eliminar» → «Eliminar la dirección
  // Mi casa»).
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

type Skin = { background: string; foreground: string; border?: string };

function resolveSkin(variant: ButtonVariant, colors: Palette): Skin {
  switch (variant) {
    case 'primary':
      return { background: colors.buttonBackground, foreground: colors.buttonText };
    case 'secondary':
      return { background: colors.surface, foreground: colors.text, border: colors.buttonOutline };
    case 'ghost':
      // El acento en su versión legible como texto: se lee tocable sin caja.
      return { background: 'transparent', foreground: colors.link };
    case 'danger':
      return {
        background: colors.buttonDangerBackground,
        foreground: colors.buttonDangerText,
        border: colors.buttonDangerOutline,
      };
  }
}

const MIN_TOUCH = 44;

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  iconOnly = false,
  fullWidth = false,
  loading = false,
  disabled = false,
  accessibilityLabel,
  style,
}: ButtonProps) {
  const theme = useTheme();
  const colors = useThemeColors();
  const skin = resolveSkin(variant, colors);
  const isDisabled = disabled || loading;
  const height = theme.size.control[size];

  // El relleno lateral acompaña al alto.
  const step = size === 'lg' ? 0 : size === 'md' ? 4 : 8;
  const iconSize = iconOnly ? Math.round(height * 0.46) : size === 'sm' ? theme.size.icon - 2 : theme.size.icon;
  // El área de toque completa los 44 aunque el botón se vea más chico.
  const hitSlop = Math.max(Math.ceil((MIN_TOUCH - height) / 2), 0);

  return (
    <PressableScale
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ busy: loading, disabled: isDisabled }}
      disabled={isDisabled}
      hitSlop={hitSlop}
      onPress={() => {
        // Solo la acción principal vibra.
        if (variant === 'primary') {
          void Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Light as never).catch(() => {});
        }
        onPress?.();
      }}
      style={[
        styles.base,
        {
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          backgroundColor: skin.background,
          borderColor: skin.border ?? 'transparent',
          borderRadius: theme.radius.button,
          borderWidth: variant === 'secondary' || variant === 'danger' ? theme.border.emphasis : theme.border.width,
          minHeight: height,
          // Cargando conserva su color (sigue siendo la acción en curso);
          // deshabilitado se apaga.
          opacity: disabled ? theme.motion.disabledOpacity : 1,
        },
        iconOnly ? { width: height } : { paddingHorizontal: theme.spacing.controlHorizontal - step },
        style,
      ]}>
      <View style={[styles.content, loading ? styles.hidden : null]}>
        {icon ? <Ionicons color={skin.foreground} name={icon} size={iconSize} /> : null}
        {iconOnly ? null : (
          <Text numberOfLines={1} style={{ color: skin.foreground }} variant={size === 'sm' ? 'buttonSmall' : 'button'}>
            {label}
          </Text>
        )}
        {iconRight && !iconOnly ? <Ionicons color={skin.foreground} name={iconRight} size={iconSize} /> : null}
      </View>
      {loading ? (
        <View pointerEvents="none" style={styles.spinner}>
          <ActivityIndicator color={skin.foreground} size="small" />
        </View>
      ) : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  hidden: {
    opacity: 0,
  },
  spinner: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
