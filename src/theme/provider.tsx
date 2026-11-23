import { PropsWithChildren, createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { modulrTheme } from './modulr';
import type { Palette, Theme } from './tokens';

export type ThemePreference = 'system' | 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  colors: Palette;
  isDark: boolean;
  preference: ThemePreference;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = PropsWithChildren<{
  // El tema de la marca; sin él, el de Modulr.
  theme?: Theme;
  preference?: ThemePreference;
}>;

export function ThemeProvider({ theme = modulrTheme, preference = 'system', children }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const isDark = preference === 'system' ? systemScheme === 'dark' : preference === 'dark';

  const value = useMemo(
    () => ({ theme, colors: isDark ? theme.colors.dark : theme.colors.light, isDark, preference }),
    [theme, isDark, preference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useAppTheme must be used inside ThemeProvider');
  }

  return context;
}
