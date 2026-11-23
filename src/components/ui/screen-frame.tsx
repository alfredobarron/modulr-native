import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import { useThemeColors } from '@/src/hooks/use-theme';

type ScreenFrameProps = PropsWithChildren<{
  edges?: readonly Edge[];
  style?: StyleProp<ViewStyle>;
}>;

// El marco de toda pantalla: fondo del tema y márgenes seguros. Los andamios
// lo usan por dentro; una pantalla solo lo usa directo cuando no es ni scroll,
// ni lista, ni formulario (un mapa a pantalla completa, una cámara).
export function ScreenFrame({ children, edges = ['top', 'left', 'right'], style }: ScreenFrameProps) {
  const colors = useThemeColors();

  return (
    <SafeAreaView edges={edges} style={[styles.flex, { backgroundColor: colors.background }, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
