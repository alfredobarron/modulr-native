import { usePathname, useSegments } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { create } from 'zustand';

import { useTheme } from '@/src/hooks/use-theme';

// ---------------------------------------------------------------------------
// Fuente ÚNICA de la geometría de pantalla. Ninguna pantalla calcula márgenes,
// alturas de header ni el espacio del menú: lo hacen los andamios (Screen,
// ListScreen, FormScreen) con lo que hay aquí, y los valores salen del tema.
// ---------------------------------------------------------------------------

// Aire entre el contenido que scrollea y un menú flotante.
const FLOATING_TAB_BAR_AIR = 12;

// Espacio inferior que una pantalla DENTRO de pestañas debe dejar libre.
// Menú flotante: el contenido pasa por detrás, así que hay que reservarlo.
// Menú pegado: ocupa su propio lugar en la pantalla y ya incluye el margen
// seguro del teléfono, así que no se reserva nada.
export function useTabBarClearance() {
  const { tabBar } = useTheme();
  const insets = useSafeAreaInsets();

  if (tabBar.variant === 'docked') {
    return 0;
  }

  return tabBar.height + tabBar.bottomMargin + insets.bottom + FLOATING_TAB_BAR_AIR;
}

export function useIsInTabs() {
  const segments = useSegments();
  return (segments as readonly string[]).includes('(tabs)');
}

// Margen inferior según dónde está la pantalla: en pestañas, lo que pida el
// menú; fuera de ellas, el margen seguro del teléfono.
export function useBottomInset() {
  const insets = useSafeAreaInsets();
  const inTabs = useIsInTabs();
  const tabBarClearance = useTabBarClearance();

  return inTabs ? tabBarClearance : insets.bottom;
}

// Alturas MEDIDAS del header y del pie fijos de cada pantalla. Van en un store
// por ruta y no en un contexto porque las listas piden su estilo
// (useListContentStyle) ANTES de pintar su ListScreen, fuera de cualquier
// Provider.
type Measures = { header?: number; footer?: number };

const useScreenMeasures = create<{
  byScreen: Record<string, Measures>;
  set: (key: string, part: keyof Measures, height: number) => void;
}>((setState) => ({
  byScreen: {},
  set: (key, part, height) =>
    setState((state) =>
      state.byScreen[key]?.[part] === height
        ? state
        : { byScreen: { ...state.byScreen, [key]: { ...state.byScreen[key], [part]: height } } },
    ),
}));

// La ruta con la que se MONTÓ la pantalla, fija: usePathname es la ruta actual
// de la app y, al empujar otra pantalla, la que se queda atrás perdería su
// medida y brincaría durante la transición.
export function useScreenKey() {
  const pathname = usePathname();
  const [key] = useState(pathname);
  return key;
}

export function useSetScreenMeasure() {
  return useScreenMeasures((state) => state.set);
}

export function useScreenMeasure(key: string, part: keyof Measures) {
  return useScreenMeasures((state) => state.byScreen[key]?.[part]);
}

// Altura del header ANTES de medirlo, para que el primer cuadro no brinque:
// los márgenes de pantalla más el renglón del título.
export function useHeaderEstimate() {
  const theme = useTheme();
  return theme.spacing.screenTop * 2 + theme.size.control.sm + 2;
}

// Lo mismo para un pie con una acción en tamaño `lg`.
export function useFooterEstimate() {
  const theme = useTheme();
  return theme.size.control.lg + FOOTER_PADDING_TOP;
}

export const FOOTER_PADDING_TOP = 10;
