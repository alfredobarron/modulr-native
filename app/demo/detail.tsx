import { useRouter } from 'expo-router';
import { useState } from 'react';

import { CatalogControls } from '@/catalog/pieces';
import { Avatar } from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { Header } from '@/src/components/ui/header';
import { ListGroup, ListItem } from '@/src/components/ui/list-item';
import { Notice } from '@/src/components/ui/notice';
import { Screen } from '@/src/components/ui/screen';
import { Status } from '@/src/components/ui/status';
import { Text } from '@/src/components/ui/text';

const ACTIVITY = ['María creó la tarea · lun 9:12', 'Luis la tomó · lun 10:40', 'Ana adjuntó un archivo · mar 16:05'];

export default function DetailDemo() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <Screen
      footer={
        <>
          <Button fullWidth icon="checkmark" label="Marcar como terminada" size="lg" />
          <Button fullWidth label="Eliminar tarea" size="lg" variant="danger" />
        </>
      }
      header={<Header onBack={() => router.back()} right={<CatalogControls />} subtitle="Proyecto Atlas" title="Revisar el contrato" />}
      onRefresh={refresh}
      refreshing={refreshing}>
      <Status label="En curso" tone="warning" variant="badge" />
      <Notice text="Vence el viernes a las 2:30 de la tarde." tone="warning" />
      <Card>
        <Text variant="cardTitle">Descripción</Text>
        <Text colorToken="body">
          Leer la última versión del contrato, marcar las cláusulas que cambiaron y dejar los comentarios para la reunión.
        </Text>
      </Card>
      <Card>
        <Text variant="cardTitle">Responsable</Text>
        <ListGroup>
          <ListItem leading={<Avatar active name="Luis Rentería" />} meta="Desarrollo" title="Luis Rentería" variant="plain" />
        </ListGroup>
      </Card>
      <Card>
        <Text variant="cardTitle">Actividad</Text>
        {ACTIVITY.map((line) => (
          <Text colorToken="body" key={line}>
            {line}
          </Text>
        ))}
      </Card>
      <Card>
        <Text variant="cardTitle">Tiempo estimado</Text>
        <Text variant="price">2 h 30 min</Text>
        <Text colorToken="textMuted" variant="caption">
          Jala hacia abajo para refrescar. El contenido pasa bajo el header y las dos acciones quedan fijas.
        </Text>
      </Card>
    </Screen>
  );
}
