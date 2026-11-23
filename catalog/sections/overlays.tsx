import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Section } from '@/catalog/pieces';
import { Avatar } from '@/src/components/ui/avatar';
import { BottomSheet } from '@/src/components/ui/bottom-sheet';
import { Button } from '@/src/components/ui/button';
import { gallery } from '@/src/components/ui/image-gallery';
import { PressableScale } from '@/src/components/ui/pressable-scale';
import { Text } from '@/src/components/ui/text';
import { TextField } from '@/src/components/ui/text-field';

// Fotos de muestra de un servicio público de imágenes de relleno.
const PHOTOS = ['modulr-1', 'modulr-2', 'modulr-3', 'modulr-4'].map((seed) => ({
  id: seed,
  uri: `https://picsum.photos/seed/${seed}/900/1200`,
}));

export function OverlaysSections() {
  const [sheet, setSheet] = useState<'simple' | 'form' | 'locked' | null>(null);
  const close = () => setSheet(null);

  return (
    <>
      <Section
        file="src/components/ui/bottom-sheet.tsx"
        note="Lo que se elige o se confirma sin salir de la pantalla. Se cierra arrastrando, tocando fuera o con la «x»."
        title="Hoja inferior">
        <View style={styles.row}>
          <Button label="Simple" onPress={() => setSheet('simple')} variant="secondary" />
          <Button label="Con formulario" onPress={() => setSheet('form')} variant="secondary" />
          <Button label="Sin cerrar" onPress={() => setSheet('locked')} variant="secondary" />
        </View>

        <BottomSheet onClose={close} title="Revisar el contrato" visible={sheet === 'simple'}>
          <Text colorToken="body">Dentro de una hoja el contenido va plano, sin tarjetas: la hoja ya es la superficie.</Text>
        </BottomSheet>

        <BottomSheet
          footer={<Button fullWidth label="Guardar nota" onPress={close} size="lg" />}
          onClose={close}
          title="Agregar una nota"
          visible={sheet === 'form'}>
          <TextField hint="El botón queda fijo y sube con el teclado." label="Nota" multiline placeholder="Lo que haga falta saber." />
        </BottomSheet>

        <BottomSheet
          dismissible={false}
          footer={
            <>
              <Button fullWidth label="Sí, eliminar" onPress={close} size="lg" variant="danger" />
              <Button fullWidth label="Volver" onPress={close} size="lg" variant="secondary" />
            </>
          }
          onClose={close}
          title="¿Eliminar esta tarea?"
          visible={sheet === 'locked'}>
          <Text colorToken="body">No se puede deshacer. Esta hoja no se cierra arrastrando ni tocando fuera: hay que responder.</Text>
        </BottomSheet>
      </Section>

      <Section
        file="src/components/ui/image-gallery.tsx"
        note="El visor de fotos a pantalla completa. Se desliza sin fin y se abre desde cualquier parte."
        title="Visor de fotos">
        <View style={styles.row}>
          {PHOTOS.map((photo, index) => (
            <PressableScale accessibilityLabel={`Ver foto ${index + 1}`} key={photo.id} onPress={() => gallery.show([...PHOTOS], index)}>
              <Avatar name="Foto" photoUrl={photo.uri} shape="rounded" size={72} />
            </PressableScale>
          ))}
        </View>
      </Section>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
