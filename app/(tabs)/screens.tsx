import { useRouter } from 'expo-router';
import { FlatList, View } from 'react-native';

import { CatalogControls } from '@/catalog/pieces';
import { Card } from '@/src/components/ui/card';
import { Header } from '@/src/components/ui/header';
import { ListScreen, useListContentStyle } from '@/src/components/ui/list-screen';
import { Text } from '@/src/components/ui/text';

const DEMOS = [
  {
    href: '/demo/detail',
    title: 'Screen',
    file: 'src/components/ui/screen.tsx',
    note: 'Una pantalla que scrollea: header fijo, acción fija al fondo y jalar para refrescar.',
  },
  {
    href: '/demo/list',
    title: 'ListScreen',
    file: 'src/components/ui/list-screen.tsx',
    note: 'Una lista larga con header y acción fijos. La lista descuenta sola el header, el pie y el menú.',
  },
  {
    href: '/demo/login',
    title: 'AuthShell',
    file: 'src/components/ui/auth-shell.tsx',
    note: 'Las pantallas de acceso: logo, título y el formulario, con el botón alcanzable con el teclado abierto.',
  },
  {
    href: '/demo/form',
    title: 'FormScreen',
    file: 'src/components/ui/form-screen.tsx',
    note: 'Captura de datos: el campo enfocado no queda tapado y la acción sube con el teclado.',
  },
] as const;

// Renglones de relleno para ver la lista pasar bajo el header y el menú.
const FILLER = Array.from({ length: 8 }, (_, index) => `Renglón de relleno ${index + 1}`);

export default function ScreensTab() {
  const router = useRouter();
  const contentStyle = useListContentStyle();

  return (
    <ListScreen header={<Header right={<CatalogControls />} subtitle="Esta pantalla es un ListScreen" title="Pantallas" />}>
      <FlatList
        contentContainerStyle={contentStyle}
        data={FILLER}
        keyExtractor={(item) => item}
        ListHeaderComponent={
          <View style={{ gap: contentStyle.gap }}>
            {DEMOS.map((demo) => (
              <Card accessibilityLabel={`Abrir ejemplo de ${demo.title}`} key={demo.href} onPress={() => router.push(demo.href)}>
                <View>
                  <Text variant="cardTitle">{demo.title}</Text>
                  <Text colorToken="textMuted" variant="data">
                    {demo.file}
                  </Text>
                </View>
                <Text colorToken="body">{demo.note}</Text>
              </Card>
            ))}
          </View>
        }
        renderItem={({ item }) => (
          <Card>
            <Text colorToken="textMuted">{item}</Text>
          </Card>
        )}
        showsVerticalScrollIndicator={false}
      />
    </ListScreen>
  );
}
