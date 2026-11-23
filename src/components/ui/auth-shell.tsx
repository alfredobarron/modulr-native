import { Ionicons } from '@expo/vector-icons';
import { PropsWithChildren, ReactNode, useEffect, useRef } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, type ScrollViewInstance, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PressableScale } from '@/src/components/ui/pressable-scale';
import { ScreenFrame } from '@/src/components/ui/screen-frame';
import { Text } from '@/src/components/ui/text';
import { useKeyboardInset } from '@/src/hooks/use-keyboard-inset';
import { useResponsiveContentStyle } from '@/src/hooks/use-responsive-style';
import { useTheme, useThemeColors } from '@/src/hooks/use-theme';

type AuthShellProps = PropsWithChildren<{
  // El logo de la marca, arriba. Lo pasa cada app.
  logo?: ReactNode;
  // Lo que se va a hacer («Qué gusto verte», «Crea tu cuenta»).
  title?: string;
  description?: string;
  // Con `onBack` sale la flecha de regreso arriba a la izquierda.
  onBack?: () => void;
}>;

const KEYBOARD_AIR = 24;

// El andamio de las pantallas de acceso: entrar, crear cuenta, recuperar
// contraseña. Logo, título, una línea de contexto y el formulario como hijos,
// con el botón de enviar siempre alcanzable con el teclado abierto.
export function AuthShell({ logo, title, description, onBack, children }: AuthShellProps) {
  const theme = useTheme();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const responsiveStyle = useResponsiveContentStyle();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const keyboard = useKeyboardInset();

  // Al abrir el teclado se baja hasta el final, para que el botón de enviar
  // quede a la vista en las dos plataformas.
  useEffect(() => {
    const subscription = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    });

    return () => subscription.remove();
  }, []);

  return (
    <ScreenFrame>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        {onBack ? (
          <View style={[styles.bar, { paddingHorizontal: theme.spacing.screenHorizontal }]}>
            <PressableScale accessibilityLabel="Regresar" hitSlop={12} onPress={onBack} style={styles.back}>
              <Ionicons color={colors.text} name="arrow-back" size={22} />
            </PressableScale>
          </View>
        ) : null}

        <ScrollView
          contentContainerStyle={[
            styles.grow,
            {
              paddingBottom: keyboard.visible ? keyboard.inset + KEYBOARD_AIR : Math.max(insets.bottom + 28, 28),
              // Un poco más de margen que una pantalla normal: aquí el
              // contenido es poco y va al centro de la atención.
              paddingHorizontal: theme.spacing.screenHorizontal + 8,
            },
          ]}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          onLayout={keyboard.onLayout}
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          style={styles.flex}>
          <View style={[styles.grow, responsiveStyle]}>
            {logo ? <View style={[styles.logo, onBack ? styles.logoWithBar : null]}>{logo}</View> : null}

            {title || description ? (
              <View style={[styles.heading, logo ? null : styles.headingAlone]}>
                {title ? (
                  <Text accessibilityRole="header" variant="headline">
                    {title}
                  </Text>
                ) : null}
                {description ? <Text colorToken="textMuted">{description}</Text> : null}
              </View>
            ) : null}

            <View style={{ gap: theme.spacing.gap + 4 }}>{children}</View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  back: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  bar: {
    paddingVertical: 8,
  },
  flex: {
    flex: 1,
  },
  grow: {
    flexGrow: 1,
  },
  heading: {
    gap: 6,
    marginBottom: 28,
  },
  headingAlone: {
    marginTop: 24,
  },
  logo: {
    alignItems: 'flex-start',
    marginBottom: 40,
    marginTop: 72,
  },
  logoWithBar: {
    marginTop: 24,
  },
});
