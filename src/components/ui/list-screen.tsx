import { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenFrame } from '@/src/components/ui/screen-frame';
import {
  useBottomInset,
  useFooterEstimate,
  useHeaderEstimate,
  useScreenKey,
  useScreenMeasure,
  useSetScreenMeasure,
} from '@/src/components/ui/screen-layout';
import { FooterOverlay, HeaderOverlay } from '@/src/components/ui/screen-overlays';
import { useResponsiveContentStyle } from '@/src/hooks/use-responsive-style';
import { useTheme } from '@/src/hooks/use-theme';

type ListScreenProps = PropsWithChildren<{
  // El <Header /> de la pantalla: queda fijo y la lista pasa por debajo.
  header?: ReactNode;
  // Acción fija al fondo, visible también con la lista vacía, cargando o con
  // error.
  footer?: ReactNode;
}>;

// Andamio de una pantalla cuya pieza principal es una lista (FlatList). La
// lista va como hijo y toma su `contentContainerStyle` de `useListContentStyle`,
// que ya descuenta el header, el pie y el menú:
//
//   const contentStyle = useListContentStyle();
//   <ListScreen header={<Header title="Tareas" />}>
//     <FlatList contentContainerStyle={contentStyle} … />
//   </ListScreen>
export function ListScreen({ header, footer, children }: ListScreenProps) {
  const key = useScreenKey();
  const bottomInset = useBottomInset();
  const setMeasure = useSetScreenMeasure();

  return (
    <ScreenFrame edges={header ? ['left', 'right'] : undefined}>
      <View style={styles.flex}>{children}</View>

      {header ? <HeaderOverlay onContentHeight={(height) => setMeasure(key, 'header', height)}>{header}</HeaderOverlay> : null}
      {footer ? (
        <FooterOverlay bottomInset={bottomInset} onContentHeight={(height) => setMeasure(key, 'footer', height)}>
          {footer}
        </FooterOverlay>
      ) : null}
    </ScreenFrame>
  );
}

// El `contentContainerStyle` de la lista de un ListScreen. Mide el header y el
// pie REALES de esa pantalla, así que no hay que avisarle si existen.
export function useListContentStyle(options?: { gap?: number }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const bottomInset = useBottomInset();
  const responsiveStyle = useResponsiveContentStyle();
  const key = useScreenKey();
  const headerEstimate = useHeaderEstimate();
  const footerEstimate = useFooterEstimate();
  const headerHeight = useScreenMeasure(key, 'header');
  const footerHeight = useScreenMeasure(key, 'footer');
  // Con pie, la lista libra SU altura (que ya trae el margen de abajo); sin
  // él, el margen de la pantalla. `footerHeight` solo existe si hay pie.
  const hasFooter = footerHeight !== undefined;

  return {
    flexGrow: 1,
    gap: options?.gap ?? theme.spacing.gap,
    paddingBottom: hasFooter
      ? (footerHeight ?? footerEstimate) + theme.spacing.gap
      : theme.spacing.scrollBottom + bottomInset,
    paddingHorizontal: theme.spacing.screenHorizontal,
    paddingTop: insets.top + (headerHeight ?? headerEstimate) + theme.spacing.headerGap,
    ...responsiveStyle,
  } as const;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
