import { Ionicons } from '@expo/vector-icons';
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { Keyboard, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ImageGalleryHost } from '@/src/components/ui/image-gallery';
import { PressableScale } from '@/src/components/ui/pressable-scale';
import { Text } from '@/src/components/ui/text';
import { useTheme, useThemeColors } from '@/src/hooks/use-theme';

const OFFSCREEN = 1000;
const DISMISS_DISTANCE = 110;
const DISMISS_VELOCITY = 700;
// Curva de cajón: entra en 300 ms sin rebote; al cerrar, más rápido.
const DRAWER = Easing.bezier(0.32, 0.72, 0, 1);
const ENTER_TIMING = { duration: 300, easing: DRAWER } as const;
const EXIT_TIMING = { duration: 200, easing: DRAWER } as const;

type BottomSheetProps = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
  title?: string;
  // Pie FIJO de la hoja: la acción queda siempre a la vista, bajo lo que se
  // desplaza, y sube con el teclado. El contenido largo va en un ScrollView
  // para que sea él quien se encoja.
  footer?: ReactNode;
  // Con `false` la hoja solo se cierra desde su contenido: no se arrastra, el
  // fondo no responde y el botón atrás de Android tampoco. Para decisiones que
  // no se pueden posponer, donde cerrar sin responder dejaría a la persona
  // creyendo que hizo algo que no hizo.
  dismissible?: boolean;
}>;

// La hoja inferior: todo lo que se elige o se confirma sin salir de la
// pantalla (opciones de un selector, un formulario corto, una confirmación).
// Dentro de una hoja el contenido va PLANO, sin tarjetas: la hoja ya es la
// superficie.
export function BottomSheet({ visible, onClose, title, footer, dismissible = true, children }: BottomSheetProps) {
  const theme = useTheme();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const backdropOpacity = useSharedValue(0);
  const translateY = useSharedValue(OFFSCREEN);
  const sheetHeight = useSharedValue(OFFSCREEN);
  // Un Modal nativo no se redimensiona con el teclado: se compensa con
  // margen inferior para que el contenido y el pie queden sobre él.
  const [keyboardInset, setKeyboardInset] = useState(0);

  useEffect(() => {
    const ios = Platform.OS === 'ios';
    const showSubscription = Keyboard.addListener(ios ? 'keyboardWillShow' : 'keyboardDidShow', (event) => {
      setKeyboardInset(event.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener(ios ? 'keyboardWillHide' : 'keyboardDidHide', () => {
      setKeyboardInset(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // Al abrir se monta en el MISMO render (estado derivado), no en un efecto:
  // así no hay un render extra en cascada.
  if (visible && !mounted) {
    setMounted(true);
  }

  useEffect(() => {
    if (visible) {
      backdropOpacity.set(withTiming(1, { duration: 120 }));

      // Reaperturas: la altura ya se conoce (los valores persisten entre
      // aperturas), hay que relanzar la entrada desde abajo.
      if (sheetHeight.get() !== OFFSCREEN) {
        translateY.set(sheetHeight.get());
        translateY.set(withTiming(0, ENTER_TIMING));
      }
    } else if (mounted) {
      backdropOpacity.set(withTiming(0, { duration: 120 }));
      translateY.set(
        withTiming(sheetHeight.get(), EXIT_TIMING, (finished) => {
          if (finished) runOnJS(setMounted)(false);
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const dragGesture = Gesture.Pan()
    .enabled(dismissible)
    .onUpdate((event) => {
      translateY.set(Math.max(0, event.translationY));
    })
    .onEnd((event) => {
      // Un tirón rápido basta, aunque no recorra la distancia.
      if (event.translationY > DISMISS_DISTANCE || event.velocityY > DISMISS_VELOCITY) {
        runOnJS(onClose)();
      } else {
        translateY.set(withTiming(0, ENTER_TIMING));
      }
    });

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }));
  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  if (!mounted) {
    return null;
  }

  return (
    <Modal onRequestClose={dismissible ? onClose : () => {}} statusBarTranslucent transparent visible>
      {/* gesture-handler no funciona dentro de un Modal nativo sin su propio
          root view: sin esto el asa de arrastre no responde. */}
      <GestureHandlerRootView style={styles.container}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }, backdropStyle]}>
          <Pressable
            accessibilityLabel="Cerrar"
            accessibilityRole="button"
            accessible={dismissible}
            disabled={!dismissible}
            onPress={onClose}
            style={styles.flex}
          />
        </Animated.View>

        <Animated.View
          accessibilityViewIsModal
          onLayout={(event) => {
            const height = event.nativeEvent.layout.height;
            sheetHeight.set(height);

            // Primer layout: entrar desde abajo.
            if (translateY.get() === OFFSCREEN) {
              translateY.set(height);
              translateY.set(withTiming(0, ENTER_TIMING));
            }
          }}
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderTopLeftRadius: theme.radius.sheet,
              borderTopRightRadius: theme.radius.sheet,
              borderWidth: theme.border.width,
              paddingBottom: Math.max(insets.bottom, 20) + keyboardInset,
              paddingHorizontal: theme.spacing.screenHorizontal + 4,
            },
            sheetStyle,
          ]}>
          {/* El arrastre vive SOLO en el asa y el título: si envuelve toda la
              hoja se roba el scroll de las listas de adentro. */}
          <GestureDetector gesture={dragGesture}>
            <View>
              {dismissible ? <View style={[styles.handle, { backgroundColor: colors.off }]} /> : <View style={styles.noHandle} />}

              {title ? (
                <View style={styles.header}>
                  <Text accessibilityRole="header" style={styles.flex} variant="cardTitle">
                    {title}
                  </Text>
                  {dismissible ? (
                    <PressableScale accessibilityLabel="Cerrar" hitSlop={12} onPress={onClose}>
                      <Ionicons color={colors.text} name="close" size={22} />
                    </PressableScale>
                  ) : null}
                </View>
              ) : null}
            </View>
          </GestureDetector>

          {children}

          {footer ? <View style={[styles.footer, { gap: theme.spacing.gap - 2 }]}>{footer}</View> : null}
        </Animated.View>

        {/* El visor de fotos del layout raíz queda DEBAJO de un Modal nativo:
            se monta otro aquí para que las fotos abiertas desde una hoja se
            vean por encima de ella. */}
        <ImageGalleryHost />
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  flex: {
    flex: 1,
  },
  footer: {
    paddingTop: 12,
  },
  handle: {
    alignSelf: 'center',
    borderRadius: 999,
    height: 4,
    marginBottom: 12,
    width: 40,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  noHandle: {
    height: 10,
  },
  sheet: {
    // Tope holgado: un selector con buscador mide 72 % del alto más el asa, el
    // título y los márgenes.
    maxHeight: '90%',
    paddingTop: 10,
  },
});
