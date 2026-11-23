import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Example, Section } from '@/catalog/pieces';
import { Button, ButtonVariant } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { Text } from '@/src/components/ui/text';
import { toast } from '@/src/components/ui/toast';
import { useTheme } from '@/src/hooks/use-theme';
import type { Size } from '@/src/theme/tokens';

const VARIANTS: readonly { key: ButtonVariant; label: string; use: string }[] = [
  { key: 'primary', label: 'Guardar', use: 'La acción de la pantalla. Una sola.' },
  { key: 'secondary', label: 'Volver', use: 'La alternativa: contorno marcado.' },
  { key: 'ghost', label: 'Ver todo', use: 'Solo texto: la acción que no debe pesar.' },
  { key: 'danger', label: 'Eliminar', use: 'Lo destructivo: se lee como botón sin competir.' },
];

const SIZES: readonly Size[] = ['sm', 'md', 'lg'];

export function BaseSections() {
  const theme = useTheme();
  const [saving, setSaving] = useState(false);

  const simulateSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1600);
  };

  return (
    <>
      <Section
        file="src/components/ui/button.tsx"
        note="Una acción. La variante dice cuánto pesa a la vista; el tamaño, cuánto mide; lo demás son estados."
        title="Botón">
        <Example title="Variantes">
          {VARIANTS.map((variant) => (
            <View key={variant.key} style={styles.variantRow}>
              <Button label={variant.label} variant={variant.key} />
              <View style={styles.flex}>
                <Text variant="label">{variant.key}</Text>
                <Text colorToken="textMuted" variant="caption">
                  {variant.use}
                </Text>
              </View>
            </View>
          ))}
        </Example>

        <Example title="Tamaños">
          <View style={styles.row}>
            {SIZES.map((size) => (
              <Button key={size} label={`${size} · ${theme.size.control[size]}`} size={size} variant="secondary" />
            ))}
          </View>
        </Example>

        <Example title="Con ícono">
          <View style={styles.row}>
            <Button icon="add" label="Agregar" variant="secondary" />
            <Button iconRight="arrow-forward" label="Continuar" />
            <Button icon="trash-outline" label="Eliminar" variant="danger" />
          </View>
        </Example>

        <Example title="Solo ícono">
          <View style={styles.row}>
            <Button icon="add" iconOnly label="Agregar" />
            <Button icon="options-outline" iconOnly label="Filtrar" variant="secondary" />
            <Button icon="trash-outline" iconOnly label="Eliminar" variant="danger" />
            <Button icon="close" iconOnly label="Cerrar" size="sm" variant="secondary" />
          </View>
        </Example>

        <Example title="Cargando">
          <View style={styles.row}>
            <Button label="Guardar cambios" loading={saving} onPress={simulateSave} />
            <Button label="Subir archivo" loading variant="secondary" />
          </View>
        </Example>

        <Example title="Deshabilitado">
          <View style={styles.row}>
            {VARIANTS.map((variant) => (
              <Button disabled key={variant.key} label={variant.label} variant={variant.key} />
            ))}
          </View>
        </Example>

        <Example title="En uso: las acciones de un detalle">
          <Card>
            <Text variant="cardTitle">Revisar el contrato</Text>
            <Text colorToken="body">La acción de la pantalla va llena; la destructiva se lee como botón sin competir con ella.</Text>
            <Button fullWidth icon="checkmark" label="Marcar como terminada" size="lg" />
            <Button fullWidth label="Eliminar tarea" size="lg" variant="danger" />
          </Card>
        </Example>

        <Example title="En uso: una acción discreta al pie">
          <Card>
            <Text variant="cardTitle">Tu cuenta</Text>
            <Text colorToken="body">«Cerrar sesión» no compite con nada: va en ghost, centrada y a todo lo ancho.</Text>
            <Button fullWidth icon="log-out-outline" label="Cerrar sesión" onPress={() => toast.success('Sesión cerrada')} variant="ghost" />
          </Card>
        </Example>

        <Example title="En uso: dos acciones lado a lado">
          <Card>
            <Text variant="cardTitle">Luis Rentería</Text>
            <Text colorToken="body">Responsable de la tarea.</Text>
            <View style={styles.pair}>
              <Button icon="call-outline" label="Llamar" style={styles.flex} variant="secondary" />
              <Button icon="mail-outline" label="Escribir" style={styles.flex} variant="secondary" />
            </View>
          </Card>
        </Example>
      </Section>

      <Section
        file="src/components/ui/card.tsx"
        note="Fondo y borde del tema, sin sombra. Con onPress, la tarjeta entera es tocable."
        title="Tarjeta">
        <Card>
          <Text variant="cardTitle">Tarjeta fija</Text>
          <Text colorToken="body">El interior y el aire entre renglones salen de spacing.cardPadding y cardGap.</Text>
        </Card>
        <Card accessibilityLabel="Tarjeta tocable" onPress={() => toast.success('Tocaste la tarjeta')}>
          <Text variant="cardTitle">Tarjeta tocable</Text>
          <Text colorToken="body">Tócala: encoge como todo lo tocable.</Text>
        </Card>
      </Section>
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  pair: {
    flexDirection: 'row',
    gap: 10,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  variantRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
});
