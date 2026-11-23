import type { TextStyle } from 'react-native';

import { useAppTheme } from '@/src/theme/provider';
import type { FontRole, Palette, TextVariant, Theme, Tone } from '@/src/theme/tokens';

// El tema completo: espacios, radios, tamaños, movimiento y menú.
export function useTheme(): Theme {
  return useAppTheme().theme;
}

// Los colores del tema activo (claro u oscuro).
export function useThemeColors(): Palette {
  return useAppTheme().colors;
}

export function useThemeIsDark(): boolean {
  return useAppTheme().isDark;
}

export function fontStyle(theme: Theme, role: FontRole): TextStyle {
  const font = theme.fonts[role];
  return { fontFamily: font.family, fontWeight: font.weight };
}

// El estilo de una variante de texto, para lo que no es un <Text> (un
// TextInput, por ejemplo) y debe verse igual.
export function textStyle(theme: Theme, variant: TextVariant): TextStyle {
  const token = theme.type[variant];
  return {
    ...fontStyle(theme, token.font),
    fontSize: token.size,
    lineHeight: token.lineHeight,
    letterSpacing: token.letterSpacing,
    fontVariant: token.tabular ? ['tabular-nums'] : undefined,
  };
}

// Los tres colores de un tono: el vivo (puntos, rellenos), el de texto (se lee
// sobre claro y sobre su tinte) y el tinte de fondo. Lo usan insignias, avisos
// y lo demás que comunica un estado.
export function toneColors(colors: Palette, tone: Tone): { solid: string; ink: string; tint: string } {
  switch (tone) {
    case 'primary':
      return { solid: colors.primary, ink: colors.link, tint: colors.primarySoft };
    case 'success':
      return { solid: colors.green, ink: colors.greenInk, tint: colors.greenTint };
    case 'warning':
      return { solid: colors.amber, ink: colors.amberInk, tint: colors.amberTint };
    case 'danger':
      return { solid: colors.red, ink: colors.redInk, tint: colors.redTint };
    case 'info':
      return { solid: colors.blue, ink: colors.blueInk, tint: colors.blueTint };
    case 'neutral':
      return { solid: colors.off, ink: colors.text, tint: colors.surfaceNeutral };
  }
}
