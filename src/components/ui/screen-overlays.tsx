import { PropsWithChildren } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FOOTER_PADDING_TOP } from '@/src/components/ui/screen-layout';
import { useResponsiveContentStyle } from '@/src/hooks/use-responsive-style';
import { useTheme, useThemeColors, useThemeIsDark } from '@/src/hooks/use-theme';

// Módulo NATIVO opcional: sin `expo-blur` el material es solo el velo.
let BlurView: typeof import('expo-blur').BlurView | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  BlurView = require('expo-blur').BlurView;
} catch {
  BlurView = null;
}

// El material de lo que flota sobre el contenido (header y menú): desenfoque
// donde rinde (iOS) más un velo del color pedido; en Android y web, solo el
// velo, más denso para compensar.
export function FloatingMaterial({ color }: { color: string }) {
  const isDark = useThemeIsDark();
  const hasBlur = Platform.OS === 'ios' && BlurView !== null;

  return (
    <>
      {hasBlur && BlurView ? (
        <BlurView intensity={40} pointerEvents="none" style={StyleSheet.absoluteFill} tint={isDark ? 'dark' : 'light'} />
      ) : null}
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: `${color}${hasBlur ? 'B3' : 'E6'}` }]} />
    </>
  );
}

type OverlayProps = PropsWithChildren<{
  // Altura del CONTENIDO (sin el margen seguro) medida al pintar.
  onContentHeight?: (height: number) => void;
}>;

// Header FIJO de las pantallas. En reposo es indistinguible del fondo —se ve
// como un header normal— y el material solo se nota cuando el contenido pasa
// por debajo.
export function HeaderOverlay({ children, onContentHeight }: OverlayProps) {
  const theme = useTheme();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  // En tablet el contenido del header se acota al MISMO ancho que el de las
  // pantallas (el material sí cubre todo el ancho).
  const responsiveStyle = useResponsiveContentStyle();

  return (
    <View pointerEvents="box-none" style={styles.header}>
      <FloatingMaterial color={colors.background} />
      <View
        onLayout={(event) => onContentHeight?.(Math.round(event.nativeEvent.layout.height))}
        style={[
          {
            marginTop: insets.top,
            paddingHorizontal: theme.spacing.screenHorizontal,
            paddingVertical: theme.spacing.screenTop,
          },
          responsiveStyle,
        ]}>
        {children}
      </View>
    </View>
  );
}

// Pie FIJO con la acción de la pantalla. SIN fondo: solo flotan los botones y
// el contenido pasa por detrás. Por eso los botones son opacos (los tintes del
// tema no llevan transparencia).
export function FooterOverlay({
  children,
  onContentHeight,
  bottomInset,
}: OverlayProps & {
  // Lo que hay que librar abajo: el margen seguro, el menú o el teclado.
  bottomInset: number;
}) {
  const theme = useTheme();
  const responsiveStyle = useResponsiveContentStyle();

  return (
    <View pointerEvents="box-none" style={styles.footer}>
      <View
        onLayout={(event) => onContentHeight?.(Math.round(event.nativeEvent.layout.height))}
        pointerEvents="box-none"
        style={[
          {
            gap: theme.spacing.gap - 2,
            paddingBottom: Math.max(bottomInset, theme.spacing.screenBottom),
            paddingHorizontal: theme.spacing.screenHorizontal,
            paddingTop: FOOTER_PADDING_TOP,
          },
          responsiveStyle,
        ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 10,
  },
  header: {
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
  },
});
