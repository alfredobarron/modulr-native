import { PropsWithChildren, ReactNode, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenFrame } from '@/src/components/ui/screen-frame';
import { useBottomInset, useFooterEstimate, useHeaderEstimate } from '@/src/components/ui/screen-layout';
import { FooterOverlay, HeaderOverlay } from '@/src/components/ui/screen-overlays';
import { useResponsiveContentStyle } from '@/src/hooks/use-responsive-style';
import { useTheme, useThemeColors } from '@/src/hooks/use-theme';

type ScreenProps = PropsWithChildren<{
  // El <Header /> de la pantalla: queda fijo y el contenido pasa por debajo.
  header?: ReactNode;
  // La acción de la pantalla, fija al fondo y siempre a la vista. En una
  // pantalla de pestañas se para encima del menú.
  footer?: ReactNode;
  // Jalar para refrescar.
  refreshing?: boolean;
  onRefresh?: () => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  contentStyle?: StyleProp<ViewStyle>;
}>;

// Andamio de una pantalla que scrollea: un detalle, un inicio, un perfil. Para
// una lista larga va ListScreen; para capturar datos, FormScreen.
export function Screen({ children, header, footer, refreshing = false, onRefresh, onScroll, contentStyle }: ScreenProps) {
  const theme = useTheme();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const bottomInset = useBottomInset();
  const responsiveStyle = useResponsiveContentStyle();
  const [headerHeight, setHeaderHeight] = useState(useHeaderEstimate());
  const [footerHeight, setFooterHeight] = useState(useFooterEstimate() + bottomInset);

  return (
    // Con header la pantalla va de orilla a orilla: el contenido scrollea
    // también bajo la barra de estado y su margen superior absorbe el inset.
    <ScreenFrame edges={header ? ['left', 'right'] : undefined}>
      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={styles.grow}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        onScroll={onScroll}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              onRefresh={onRefresh}
              progressViewOffset={header ? insets.top + headerHeight : undefined}
              refreshing={refreshing}
              tintColor={colors.primary}
            />
          ) : undefined
        }
        scrollEventThrottle={onScroll ? 16 : undefined}
        showsVerticalScrollIndicator={false}
        style={styles.flex}>
        <View
          style={[
            styles.grow,
            {
              gap: theme.spacing.gap,
              paddingBottom: footer ? footerHeight + theme.spacing.gap : theme.spacing.scrollBottom + bottomInset,
              paddingHorizontal: theme.spacing.screenHorizontal,
              paddingTop: header ? insets.top + headerHeight + theme.spacing.headerGap : theme.spacing.screenTop,
            },
            responsiveStyle,
            contentStyle,
          ]}>
          {children}
        </View>
      </ScrollView>

      {header ? <HeaderOverlay onContentHeight={setHeaderHeight}>{header}</HeaderOverlay> : null}
      {footer ? (
        <FooterOverlay bottomInset={bottomInset} onContentHeight={setFooterHeight}>
          {footer}
        </FooterOverlay>
      ) : null}
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  grow: {
    flexGrow: 1,
  },
});
