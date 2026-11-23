import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { create } from 'zustand';

import { Text } from '@/src/components/ui/text';
import { useResponsiveContentStyle } from '@/src/hooks/use-responsive-style';
import { useTheme, useThemeColors } from '@/src/hooks/use-theme';

export type ToastTone = 'success' | 'error';

type ToastState = {
  // `id` distingue dos avisos seguidos con el mismo texto.
  current: { id: number; message: string; tone: ToastTone } | null;
  show: (message: string, tone: ToastTone) => void;
  clear: () => void;
};

const useToastStore = create<ToastState>((set) => ({
  current: null,
  show: (message, tone) => set((state) => ({ current: { id: (state.current?.id ?? 0) + 1, message, tone } })),
  clear: () => set({ current: null }),
}));

// El aviso del RESULTADO de una acción («Dirección guardada», «No se pudo
// cancelar»). Se llama desde cualquier parte, sin hooks ni contexto:
//
//   toast.success('Dirección guardada');
//   toast.error('No se pudo guardar. Intenta de nuevo.');
//
// Un aviso nuevo reemplaza al anterior. Para explicar algo dentro de la
// pantalla va `Notice`, no esto.
export const toast = {
  success: (message: string) => useToastStore.getState().show(message, 'success'),
  error: (message: string) => useToastStore.getState().show(message, 'error'),
  dismiss: () => useToastStore.getState().clear(),
};

const FADE_MS = 200;
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);
// Un error se queda más: suele pedir que se lea y se haga algo.
const DURATION: Record<ToastTone, number> = { error: 6000, success: 4000 };

// Se monta UNA vez, en el layout raíz, después del navegador:
//
//   <Stack />
//   <ToastHost />
//
// El aviso aparece y se va con un fundido, sin deslizarse; un toque lo cierra.
export function ToastHost() {
  const theme = useTheme();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const responsiveStyle = useResponsiveContentStyle();
  const current = useToastStore((state) => state.current);
  const clear = useToastStore((state) => state.clear);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!current) {
      return undefined;
    }

    opacity.set(0);
    opacity.set(withTiming(1, { duration: FADE_MS, easing: EASE_OUT }));

    const timeout = setTimeout(() => {
      opacity.set(
        withTiming(0, { duration: FADE_MS, easing: EASE_OUT }, (finished) => {
          if (finished) runOnJS(clear)();
        }),
      );
    }, DURATION[current.tone]);

    return () => clearTimeout(timeout);
  }, [clear, current, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  if (!current) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.overlay, { paddingHorizontal: theme.spacing.screenHorizontal, top: insets.top + 8 }, animatedStyle]}>
      <View pointerEvents="box-none" style={responsiveStyle}>
        <Pressable
          accessibilityLabel={`${current.message}. Toca para cerrar.`}
          accessibilityLiveRegion={current.tone === 'error' ? 'assertive' : 'polite'}
          accessibilityRole="alert"
          onPress={clear}
          style={[
            styles.toast,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: theme.radius.card,
              borderWidth: theme.border.width,
            },
          ]}>
          {/* Tarjeta plana: el resultado lo dice el punto antes de la frase. */}
          <View style={[styles.dot, { backgroundColor: current.tone === 'error' ? colors.red : colors.green }]} />
          <Text style={styles.flex}>{current.message}</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  dot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  flex: {
    flex: 1,
  },
  // La elevación solo ordena capas en Android: sin fondo no dibuja sombra.
  overlay: {
    elevation: 999,
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 999,
  },
  toast: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});
