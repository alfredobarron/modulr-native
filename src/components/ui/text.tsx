import { Text as RNText, type TextProps } from 'react-native';

import { textStyle, useTheme, useThemeColors } from '@/src/hooks/use-theme';
import type { ColorToken, TextVariant } from '@/src/theme/tokens';

export type AppTextProps = TextProps & {
  colorToken?: ColorToken;
  variant?: TextVariant;
};

// Todo el texto de la app pasa por aquí: la variante trae letra, tamaño e
// interlineado del tema (`theme.type`), y el color, un token de la paleta.
export function Text({ style, colorToken = 'text', variant = 'body', ...rest }: AppTextProps) {
  const theme = useTheme();
  const colors = useThemeColors();

  return <RNText style={[{ color: colors[colorToken] }, textStyle(theme, variant), style]} {...rest} />;
}
