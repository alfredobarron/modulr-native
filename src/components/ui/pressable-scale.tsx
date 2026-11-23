import { PropsWithChildren } from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { useTheme } from '@/src/hooks/use-theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Acepta lo mismo que `Pressable` (rol, estado, hitSlop para completar los 44
// de toque en lo compacto…), salvo el estilo en función: lo presionado ya lo
// dice la escala, no la opacidad.
type PressableScaleProps = PropsWithChildren<
  Omit<PressableProps, 'style' | 'children' | 'onPressIn' | 'onPressOut'> & {
    style?: StyleProp<ViewStyle>;
  }
>;

// Microinteracción estándar de lo tocable: encoge a `motion.pressScale` en
// `motion.pressDuration` ms con la curva de salida; al soltar regresa con
// resorte. Todo lo tocable es un PressableScale.
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

export function PressableScale({ style, children, ...rest }: PressableScaleProps) {
  const { motion } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessible
      {...rest}
      onPressIn={() => {
        scale.set(withTiming(motion.pressScale, { duration: motion.pressDuration, easing: EASE_OUT }));
      }}
      onPressOut={() => {
        scale.set(withSpring(1, { damping: 18, stiffness: 300 }));
      }}
      style={[animatedStyle, style]}>
      {children}
    </AnimatedPressable>
  );
}
