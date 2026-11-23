import { useEffect } from 'react';
import { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useThemeColors } from '@/src/hooks/use-theme';

type SkeletonProps = {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
};

// La silueta de algo que está cargando. Son solo las dos piezas básicas (una
// barra y un círculo): el esqueleto de CADA pantalla se arma con ellas en esa
// pantalla, calcando la forma de lo que va a llegar, y no vive aquí.
//
// Relleno neutro y plano: no debe pesar más que lo que reemplaza. El pulso es
// corto (de 0.5 a 1) para que respire sin parpadear; con «reducir movimiento»
// se queda quieto.
export function Skeleton({ width = '100%', height = 14, borderRadius = 8, style }: SkeletonProps) {
  const colors = useThemeColors();
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(reduceMotion ? 0.8 : 0.5);

  useEffect(() => {
    if (reduceMotion) {
      return undefined;
    }

    opacity.set(withRepeat(withTiming(1, { duration: 800 }), -1, true));

    return () => cancelAnimation(opacity);
  }, [opacity, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ backgroundColor: colors.surfaceNeutral, borderRadius, height, width }, animatedStyle, style]}
    />
  );
}

export function SkeletonCircle({ size = 36, style }: { size?: number; style?: StyleProp<ViewStyle> }) {
  return <Skeleton borderRadius={size / 2} height={size} style={style} width={size} />;
}
