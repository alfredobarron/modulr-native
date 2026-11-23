import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { SKINS, useCatalogStore } from '@/catalog/skins';
import { Button } from '@/src/components/ui/button';
import { Text } from '@/src/components/ui/text';
import { useTheme } from '@/src/hooks/use-theme';
import type { ThemePreference } from '@/src/theme/provider';

// Piezas del propio catálogo (no son componentes de Modulr): el bloque de cada
// componente y los controles de piel y tema.

type SectionProps = PropsWithChildren<{
  title: string;
  // El archivo del componente, para saber qué se copia a cada app.
  file?: string;
  note?: string;
}>;

export function Section({ title, file, note, children }: SectionProps) {
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing.gap }}>
      <View style={styles.sectionHead}>
        <Text variant="subtitle">{title}</Text>
        {file ? (
          <Text colorToken="textMuted" variant="data">
            {file}
          </Text>
        ) : null}
        {note ? (
          <Text colorToken="body" variant="caption">
            {note}
          </Text>
        ) : null}
      </View>
      {children}
    </View>
  );
}

// Un caso dentro de la sección de un componente, con su rótulo.
export function Example({ title, children }: PropsWithChildren<{ title: string }>) {
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing.gap }}>
      <Text colorToken="textMuted" variant="label">
        {title}
      </Text>
      {children}
    </View>
  );
}

const PREFERENCE_ORDER: readonly ThemePreference[] = ['system', 'light', 'dark'];
const PREFERENCE_ICON = { dark: 'moon', light: 'sunny', system: 'contrast' } as const;
const PREFERENCE_LABEL = { dark: 'oscuro', light: 'claro', system: 'del sistema' } as const;

// Los dos controles del catálogo, en el header de cada pantalla: la piel
// (Modulr o una marca) y el tema. Cada toque pasa al siguiente.
export function CatalogControls() {
  const skin = useCatalogStore((state) => state.skin);
  const preference = useCatalogStore((state) => state.preference);
  const setSkin = useCatalogStore((state) => state.setSkin);
  const setPreference = useCatalogStore((state) => state.setPreference);
  const skinIndex = SKINS.findIndex((item) => item.key === skin);
  const nextSkin = SKINS[(skinIndex + 1) % SKINS.length];
  const nextPreference = PREFERENCE_ORDER[(PREFERENCE_ORDER.indexOf(preference) + 1) % PREFERENCE_ORDER.length];

  return (
    <>
      <Button
        accessibilityLabel={`Piel ${SKINS[skinIndex].label}. Cambiar a ${nextSkin.label}`}
        icon="color-palette-outline"
        label={SKINS[skinIndex].label}
        onPress={() => setSkin(nextSkin.key)}
        size="sm"
        variant="secondary"
      />
      <Button
        accessibilityLabel={`Tema ${PREFERENCE_LABEL[preference]}. Cambiar a ${PREFERENCE_LABEL[nextPreference]}`}
        icon={PREFERENCE_ICON[preference]}
        iconOnly
        label="Tema"
        onPress={() => setPreference(nextPreference)}
        size="sm"
        variant="secondary"
      />
    </>
  );
}

const styles = StyleSheet.create({
  sectionHead: {
    gap: 2,
  },
});
