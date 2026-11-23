import { PropsWithChildren, ReactNode, RefObject, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type ScrollViewInstance,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenFrame } from '@/src/components/ui/screen-frame';
import { useBottomInset, useHeaderEstimate } from '@/src/components/ui/screen-layout';
import { FooterOverlay, HeaderOverlay } from '@/src/components/ui/screen-overlays';
import { useKeyboardInset } from '@/src/hooks/use-keyboard-inset';
import { useResponsiveContentStyle } from '@/src/hooks/use-responsive-style';
import { useTheme } from '@/src/hooks/use-theme';

type FormScreenProps = PropsWithChildren<{
  // El <Header /> de la pantalla: queda fijo y el formulario pasa por debajo.
  header?: ReactNode;
  // La acción del formulario («Guardar», «Enviar»), fija al fondo: en uno
  // largo no se pierde al final del scroll, y sube con el teclado.
  footer?: ReactNode;
  // Para llevar el scroll a un bloque concreto (el primer campo con error).
  scrollRef?: RefObject<ScrollViewInstance | null>;
  contentStyle?: StyleProp<ViewStyle>;
}>;

// Aire entre el último campo y el teclado o el pie.
const KEYBOARD_AIR = 16;

// Andamio de una pantalla donde se capturan datos. Resuelve el teclado en iOS
// y en Android: el campo enfocado nunca queda tapado y la acción lo acompaña.
export function FormScreen({ children, header, footer, scrollRef, contentStyle }: FormScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const bottomInset = useBottomInset();
  const responsiveStyle = useResponsiveContentStyle();
  const [headerHeight, setHeaderHeight] = useState(useHeaderEstimate());
  const [footerHeight, setFooterHeight] = useState(0);
  const keyboard = useKeyboardInset();

  return (
    <ScreenFrame edges={header ? ['left', 'right'] : undefined}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <View onLayout={keyboard.onLayout} style={styles.flex}>
          <ScrollView
            contentContainerStyle={[
              styles.grow,
              {
                // Con pie, el alto MEDIDO del pie ya trae lo que el teclado
                // tapa (es su margen de abajo): no se suma otra vez.
                paddingBottom: footer
                  ? footerHeight + KEYBOARD_AIR
                  : keyboard.visible
                    ? keyboard.inset + KEYBOARD_AIR
                    : theme.spacing.scrollBottom + bottomInset,
              },
            ]}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            style={styles.flex}>
            <View
              style={[
                styles.grow,
                {
                  gap: theme.spacing.gap,
                  paddingHorizontal: theme.spacing.screenHorizontal,
                  paddingTop: header ? insets.top + headerHeight + theme.spacing.headerGap : theme.spacing.screenTop,
                },
                responsiveStyle,
                contentStyle,
              ]}>
              {children}
            </View>
          </ScrollView>

          {footer ? (
            // Con el teclado abierto el pie sube lo que el teclado tapa y deja
            // sobre él el mismo aire que deja sobre la orilla de la pantalla;
            // cerrado, libra el margen seguro o el menú.
            <FooterOverlay
              bottomInset={keyboard.visible ? keyboard.inset + theme.spacing.screenBottom : bottomInset}
              onContentHeight={setFooterHeight}>
              {footer}
            </FooterOverlay>
          ) : null}
        </View>
      </KeyboardAvoidingView>

      {header ? <HeaderOverlay onContentHeight={setHeaderHeight}>{header}</HeaderOverlay> : null}
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
