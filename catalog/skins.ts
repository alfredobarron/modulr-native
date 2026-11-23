import { Platform } from 'react-native';
import { create } from 'zustand';

import { createTheme } from '@/src/theme/create-theme';
import { modulrTheme } from '@/src/theme/modulr';
import type { ThemePreference } from '@/src/theme/provider';
import type { Theme } from '@/src/theme/tokens';

// ---------------------------------------------------------------------------
// «Aurora»: una marca INVENTADA, solo para el catálogo. Muestra cómo se viste
// Modulr con otra marca y, de paso, comprueba que ningún componente trae un
// valor fijo: cambia a propósito colores, letra, radios, tamaños, espacios,
// el contorno del botón y la forma del menú. Si al pasar a Aurora algo no se
// mueve, ese componente no está leyendo el tema.
//
// Usa letra con serifa del sistema para no cargar archivos de fuente; una
// marca real pondría aquí sus familias (el peso va entonces en la familia).
// ---------------------------------------------------------------------------
const SERIF = Platform.select({ android: 'serif', default: 'Georgia', ios: 'Georgia' });

const auroraTheme = createTheme({
  name: 'Aurora',
  colors: {
    light: {
      background: '#EEF3F1',
      surfaceMuted: '#E3EBE8',
      surfaceNeutral: 'rgba(15,42,46,0.07)',
      surfaceHighlighted: '#DDF1EC',
      text: '#0F2A2E',
      body: '#2F4A4E',
      textMuted: '#587074',
      border: 'rgba(15,42,46,0.14)',
      borderStrong: 'rgba(15,42,46,0.45)',
      primary: '#0E8F7E',
      primarySoft: '#DDF1EC',
      link: '#0A6B5F',
      // Botón principal en tinta; el secundario, con contorno de tinta.
      buttonBackground: '#0F2A2E',
      buttonText: '#FFFFFF',
      buttonOutline: '#0F2A2E',
      switchOn: '#0E8F7E',
      avatarBackground: '#DDF1EC',
      avatarText: '#0A6B5F',
      scrim: 'rgba(15,42,46,0.45)',
    },
    dark: {
      background: '#08191C',
      surface: '#0F2529',
      surfaceMuted: '#163238',
      surfaceHighlighted: '#12383A',
      text: '#E9F3F1',
      body: '#B7CBC8',
      textMuted: '#8AA29F',
      primary: '#35D0B8',
      primarySoft: '#12383A',
      link: '#6FE0CD',
      buttonBackground: '#35D0B8',
      buttonText: '#08191C',
      buttonOutline: '#E9F3F1',
      input: '#0F2529',
      switchOn: '#35D0B8',
      avatarBackground: '#12383A',
      avatarText: '#6FE0CD',
    },
  },
  fonts: {
    regular: { family: SERIF, weight: '400' },
    medium: { family: SERIF, weight: '400' },
    semiBold: { family: SERIF, weight: '700' },
    bold: { family: SERIF, weight: '700' },
    display: { family: SERIF, weight: '700' },
    numeric: { family: SERIF, weight: '700' },
  },
  spacing: { screenHorizontal: 20, cardPadding: 18 },
  radius: { control: 6, card: 8, sheet: 14, button: 999 },
  size: { control: { sm: 34, md: 42, lg: 50 } },
  border: { emphasis: 1.5 },
  tabBar: { variant: 'docked', height: 56 },
});

export const SKINS = [
  { key: 'modulr', label: 'Modulr', theme: modulrTheme },
  { key: 'aurora', label: 'Aurora', theme: auroraTheme },
] as const satisfies readonly { key: string; label: string; theme: Theme }[];

export type SkinKey = (typeof SKINS)[number]['key'];

type CatalogState = {
  skin: SkinKey;
  preference: ThemePreference;
  setSkin: (skin: SkinKey) => void;
  setPreference: (preference: ThemePreference) => void;
};

export const useCatalogStore = create<CatalogState>((set) => ({
  skin: 'modulr',
  preference: 'system',
  setSkin: (skin) => set({ skin }),
  setPreference: (preference) => set({ preference }),
}));
