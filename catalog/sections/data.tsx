import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Example, Section } from '@/catalog/pieces';
import { Avatar } from '@/src/components/ui/avatar';
import { Card } from '@/src/components/ui/card';
import { FilterPills } from '@/src/components/ui/filter-pills';
import { ListGroup, ListItem, ListItemSkeleton } from '@/src/components/ui/list-item';
import { SectionHeading } from '@/src/components/ui/section-heading';
import { Status } from '@/src/components/ui/status';
import { Text } from '@/src/components/ui/text';
import { toast } from '@/src/components/ui/toast';
import { useThemeColors } from '@/src/hooks/use-theme';

const FILTERS = [
  { key: 'todas', label: 'Todas', count: 18 },
  { key: 'curso', label: 'En curso', count: 3 },
  { key: 'terminadas', label: 'Terminadas', count: 12 },
  { key: 'canceladas', label: 'Canceladas', count: 3 },
  { key: 'archivadas', label: 'Archivadas' },
] as const;

export function DataSections() {
  const colors = useThemeColors();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('todas');
  const open = () => toast.success('Abriste el renglón');

  return (
    <>
      <Section
        file="src/components/ui/avatar.tsx"
        note="La foto o, si no hay o no carga, la inicial. Redondo para personas; con esquina para lo demás."
        title="Avatar">
        <View style={styles.row}>
          <Avatar name="María Robles" size={32} />
          <Avatar name="Luis Rentería" />
          <Avatar name="Ana" size={56} />
          <Avatar active name="Luis Rentería" size={56} />
          <Avatar active badge={<Ionicons color={colors.blue} name="shield-checkmark" size={18} />} name="Carlos" size={56} />
          <Avatar name="Estudio Norte" shape="rounded" size={56} />
        </View>
        <Text colorToken="textMuted" variant="caption">
          El anillo dice que está disponible; el sello, que está verificado.
        </Text>
      </Section>

      <Section
        file="src/components/ui/list-item.tsx"
        note="El renglón de toda lista: lo que identifica, el título, una línea de estado y datos, y algo a la derecha."
        title="Fila de lista">
        <Example title="card · cada renglón es su tarjeta">
          <ListItem
            icon="document-text-outline"
            meta="Proyecto Atlas"
            onPress={open}
            status={{ label: 'En curso', tone: 'warning' }}
            title="Revisar el contrato"
            trailing={<Text variant="data">2 h</Text>}
          />
          <ListItem
            detail="¿Me puedes mandar la última versión del archivo?"
            leading={<Avatar active name="María Robles" />}
            meta="hace 5 min"
            onPress={open}
            status={{ label: 'Nuevo', tone: 'primary' }}
            title="María Robles"
          />
          <ListItem dimmed icon="archive-outline" status={{ label: 'Archivada', tone: 'neutral' }} title="Plan del trimestre" />
          <ListItemSkeleton />
        </Example>
        <Example title="plain · varios renglones en un bloque (ListGroup)">
          <Card>
            <ListGroup>
              <ListItem icon="person-outline" meta="Nombre, correo y celular" onPress={open} title="Mis datos" variant="plain" />
              <ListItem icon="lock-closed-outline" meta="Contraseña y dispositivos" onPress={open} title="Seguridad" variant="plain" />
              <ListItem
                icon="notifications-outline"
                meta="2 sin leer"
                onPress={open}
                title="Notificaciones"
                trailing={<Status label="2" tone="primary" variant="tint" />}
                variant="plain"
              />
              <ListItem danger icon="trash-outline" onPress={open} title="Eliminar cuenta" variant="plain" />
            </ListGroup>
          </Card>
        </Example>
      </Section>

      <Section
        file="src/components/ui/section-heading.tsx"
        note="Parte una pantalla o una lista en bloques. Más aire arriba que abajo: el título es del bloque que abre."
        title="Encabezado de sección">
        <Card>
          <SectionHeading count={3} first title="En curso" />
          <Text colorToken="body">Con conteo, sin acción.</Text>
          <SectionHeading action={{ label: 'Ver todo', onPress: open }} title="Terminadas" />
          <Text colorToken="body">Con acción: el renglón entero es el botón.</Text>
        </Card>
      </Section>

      <Section
        file="src/components/ui/filter-pills.tsx"
        note="Los filtros de un listado, en una fila que se desliza. El elegido va en tinta."
        title="Filtros">
        <FilterPills active={filter} onChange={setFilter} options={FILTERS} />
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
