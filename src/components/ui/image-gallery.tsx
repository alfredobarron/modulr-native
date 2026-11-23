import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { create } from 'zustand';

import { PressableScale } from '@/src/components/ui/pressable-scale';
import { Text } from '@/src/components/ui/text';
import { useThemeColors } from '@/src/hooks/use-theme';

// Módulo NATIVO opcional: sin `expo-brightness` el visor funciona igual, solo
// no sube el brillo. El tipo va escrito a mano para no depender de él.
type BrightnessModule = {
  getBrightnessAsync: () => Promise<number>;
  setBrightnessAsync: (value: number) => Promise<void>;
  restoreSystemBrightnessAsync: () => Promise<void>;
};
let Brightness: BrightnessModule | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Brightness = require('expo-brightness');
} catch {
  Brightness = null;
}

export type GalleryItem = {
  id: string | number;
  uri: string;
};

type GalleryOptions = {
  // Sube el brillo de la pantalla mientras el visor está abierto. Para mostrar
  // un código QR que alguien va a escanear.
  boostBrightness?: boolean;
};

type GalleryState = {
  items: GalleryItem[];
  initialIndex: number;
  visible: boolean;
  // Cambia en cada apertura: reinicia la posición del visor.
  sessionId: number;
  boostBrightness: boolean;
  show: (items: GalleryItem[], initialIndex: number, options?: GalleryOptions) => void;
  hide: () => void;
};

const useGalleryStore = create<GalleryState>((set) => ({
  boostBrightness: false,
  hide: () => set({ visible: false }),
  initialIndex: 0,
  items: [],
  sessionId: 0,
  show: (items, initialIndex, options) =>
    set((state) => ({
      boostBrightness: options?.boostBrightness ?? false,
      initialIndex,
      items,
      sessionId: state.sessionId + 1,
      visible: true,
    })),
  visible: false,
}));

// El visor de fotos a pantalla completa. Se abre desde cualquier parte:
//
//   gallery.show(fotos, 0);
//   gallery.show([{ id: 'qr', uri }], 0, { boostBrightness: true });
export const gallery = {
  show: (items: GalleryItem[], initialIndex = 0, options?: GalleryOptions) =>
    useGalleryStore.getState().show(items, initialIndex, options),
  hide: () => useGalleryStore.getState().hide(),
};

// Se monta UNA vez en el layout raíz, después del navegador. (`BottomSheet` ya
// monta el suyo: un Modal nativo siempre se dibuja encima del layout raíz, y
// las fotos abiertas desde una hoja deben verse por encima de ella.)
export function ImageGalleryHost() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { items, initialIndex, visible, sessionId, hide, boostBrightness } = useGalleryStore();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const opacity = useSharedValue(0);
  const [active, setActive] = useState(false);
  const listRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cada apertura arranca en la foto inicial (estado derivado de la sesión: se
  // ajusta en el render, sin efecto en cascada).
  const [lastSession, setLastSession] = useState(sessionId);
  if (sessionId !== lastSession) {
    setLastSession(sessionId);
    setCurrentIndex(items.length === 0 ? 0 : Math.min(Math.max(initialIndex, 0), items.length - 1));
  }

  if (visible && !active) {
    setActive(true);
  }

  useEffect(() => {
    if (visible) {
      opacity.set(withTiming(1, { duration: 200 }));
    } else {
      opacity.set(
        withTiming(0, { duration: 200 }, (finished) => {
          if (finished) runOnJS(setActive)(false);
        }),
      );
    }
  }, [opacity, visible]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  // El botón atrás de Android cierra el visor, no la pantalla.
  useEffect(() => {
    if (!active) return undefined;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      hide();
      return true;
    });

    return () => subscription.remove();
  }, [active, hide]);

  // Brillo al máximo mientras el visor está abierto; al cerrar se restaura. En
  // Android el brillo de la ventana normalmente «sigue al sistema» (sin valor
  // propio), así que restaurar el valor capturado lo dejaría oscuro: ahí se
  // regresa al modo sistema.
  useEffect(() => {
    const brightness = Brightness;

    if (!active || !boostBrightness || !brightness) return undefined;

    let previousBrightness: number | null = null;
    let cancelled = false;

    void (async () => {
      try {
        if (Platform.OS === 'ios') {
          previousBrightness = await brightness.getBrightnessAsync();
        }
        if (!cancelled) {
          await brightness.setBrightnessAsync(1);
        }
      } catch {
        // Sin permiso o no soportado: el visor funciona igual.
      }
    })();

    return () => {
      cancelled = true;

      if (Platform.OS === 'android') {
        void brightness.restoreSystemBrightnessAsync().catch(() => {});
      } else if (previousBrightness !== null) {
        void brightness.setBrightnessAsync(previousBrightness).catch(() => {});
      }
    };
  }, [active, boostBrightness]);

  const safeInitialIndex = items.length === 0 ? 0 : Math.min(Math.max(initialIndex, 0), items.length - 1);

  // Deslizar sin fin: con una copia de la última al inicio y de la primera al
  // final, al asentarse sobre una copia se salta sin animación a la real.
  const isLoop = items.length > 1;
  const pages = isLoop ? [items[items.length - 1], ...items, items[0]] : items;
  const listInitialIndex = isLoop ? safeInitialIndex + 1 : safeInitialIndex;

  const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const pageIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);

    if (!isLoop) {
      setCurrentIndex(pageIndex);
      return;
    }

    if (pageIndex === 0) {
      listRef.current?.scrollToIndex({ animated: false, index: items.length });
      setCurrentIndex(items.length - 1);
      return;
    }

    if (pageIndex === pages.length - 1) {
      listRef.current?.scrollToIndex({ animated: false, index: 1 });
      setCurrentIndex(0);
      return;
    }

    setCurrentIndex(pageIndex - 1);
  };

  return (
    <Animated.View pointerEvents={active ? 'box-none' : 'none'} style={[StyleSheet.absoluteFill, styles.container, animatedStyle]}>
      {active ? (
        <View accessibilityViewIsModal style={[styles.flex, { backgroundColor: colors.viewerBackground }]}>
          <FlatList
            data={pages}
            getItemLayout={(_, index) => ({ index, length: screenWidth, offset: screenWidth * index })}
            horizontal
            initialScrollIndex={listInitialIndex}
            key={`${sessionId}-${safeInitialIndex}`}
            keyExtractor={(item, index) => `${index}-${item.id}`}
            onMomentumScrollEnd={handleMomentumEnd}
            onScrollToIndexFailed={() => {}}
            pagingEnabled
            ref={listRef}
            renderItem={({ item }) => (
              // Ancho Y alto explícitos: sin el alto, en web la página mide
              // cero y la foto no se ve.
              <View style={[styles.page, { height: screenHeight, width: screenWidth }]}>
                <Image contentFit="contain" source={{ uri: item.uri }} style={styles.image} />
              </View>
            )}
            showsHorizontalScrollIndicator={false}
          />

          <PressableScale
            accessibilityLabel="Cerrar"
            hitSlop={12}
            onPress={hide}
            style={[styles.close, { top: insets.top + 12 }]}>
            <Ionicons color={colors.viewerText} name="close" size={28} />
          </PressableScale>

          {items.length > 1 ? (
            <View pointerEvents="none" style={[styles.counter, { bottom: insets.bottom + 20 }]}>
              <Text style={{ color: colors.viewerText }} variant="label">
                {currentIndex + 1} de {items.length}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  close: {
    position: 'absolute',
    right: 16,
  },
  // Por encima de todo, también en Android.
  container: {
    elevation: 1000,
    zIndex: 1000,
  },
  counter: {
    alignItems: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
  },
  flex: {
    flex: 1,
  },
  image: {
    height: '82%',
    width: '92%',
  },
  page: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
