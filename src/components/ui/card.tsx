import { PropsWithChildren } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { PressableScale } from '@/src/components/ui/pressable-scale';
import { useTheme, useThemeColors } from '@/src/hooks/use-theme';

type CardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  // Con `onPress` la tarjeta entera es tocable (y encoge al presionar).
  onPress?: () => void;
  accessibilityLabel?: string;
}>;

// La superficie de todo lo que va en tarjeta: fondo y borde del tema, SIN
// sombra (en Android la elevación dibuja un contorno oscuro).
export function Card({ children, style, onPress, accessibilityLabel }: CardProps) {
  const theme = useTheme();
  const colors = useThemeColors();

  const cardStyle = [
    {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: theme.radius.card,
      borderWidth: theme.border.width,
      gap: theme.spacing.cardGap,
      padding: theme.spacing.cardPadding,
    },
    style,
  ];

  if (onPress) {
    return (
      <PressableScale accessibilityLabel={accessibilityLabel} onPress={onPress} style={cardStyle}>
        {children}
      </PressableScale>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}
