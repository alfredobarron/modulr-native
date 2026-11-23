import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ModulrLogo } from '@/catalog/logo';
import { CatalogControls } from '@/catalog/pieces';
import { BaseSections } from '@/catalog/sections/base';
import { DataSections } from '@/catalog/sections/data';
import { FeedbackSections } from '@/catalog/sections/feedback';
import { FormsSections } from '@/catalog/sections/forms';
import { FoundationsSections } from '@/catalog/sections/foundations';
import { OverlaysSections } from '@/catalog/sections/overlays';
import { FilterPills } from '@/src/components/ui/filter-pills';
import { Header } from '@/src/components/ui/header';
import { Screen } from '@/src/components/ui/screen';
import { Text } from '@/src/components/ui/text';
import { useTheme } from '@/src/hooks/use-theme';

// Los grupos del catálogo, en el orden en que conviene conocerlos.
const GROUPS = [
  { key: 'tema', label: 'Tema', Sections: FoundationsSections },
  { key: 'base', label: 'Base', Sections: BaseSections },
  { key: 'formularios', label: 'Formularios', Sections: FormsSections },
  { key: 'avisos', label: 'Estados y avisos', Sections: FeedbackSections },
  { key: 'datos', label: 'Datos', Sections: DataSections },
  { key: 'hojas', label: 'Hojas y visor', Sections: OverlaysSections },
] as const;

type GroupKey = (typeof GROUPS)[number]['key'];

export default function CatalogScreen() {
  const theme = useTheme();
  const [group, setGroup] = useState<GroupKey>('tema');
  const Sections = GROUPS.find((item) => item.key === group)?.Sections ?? FoundationsSections;

  return (
    <Screen header={<Header right={<CatalogControls />} title="Componentes" />}>
      <View style={styles.intro}>
        <ModulrLogo />
        <Text colorToken="body">
          Componentes para apps de React Native que cada proyecto copia y viste con su marca. Cambia la piel arriba para
          ver los mismos componentes con otra marca.
        </Text>
        <Text colorToken="textMuted" variant="caption">
          Piel activa: {theme.name}
        </Text>
      </View>

      <FilterPills active={group} onChange={setGroup} options={GROUPS} />

      <View style={styles.sections}>
        <Sections />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: 12,
    marginBottom: 12,
  },
  sections: {
    gap: 44,
    marginTop: 20,
  },
});
