import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Example, Section } from '@/catalog/pieces';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { EmptyState, ErrorState } from '@/src/components/ui/empty-state';
import { Notice } from '@/src/components/ui/notice';
import { OfflineBanner } from '@/src/components/ui/offline-banner';
import { Skeleton, SkeletonCircle } from '@/src/components/ui/skeleton';
import { Status } from '@/src/components/ui/status';
import { SwitchRow } from '@/src/components/ui/switch';
import { toast } from '@/src/components/ui/toast';
import type { Tone } from '@/src/theme/tokens';

const STATUSES: readonly { tone: Tone; label: string }[] = [
  { tone: 'primary', label: 'Nueva' },
  { tone: 'warning', label: 'Pendiente' },
  { tone: 'success', label: 'Terminada' },
  { tone: 'danger', label: 'Vencida' },
  { tone: 'info', label: 'En revisión' },
  { tone: 'neutral', label: 'Archivada' },
];

export function FeedbackSections() {
  const [offline, setOffline] = useState(false);
  const [sending, setSending] = useState(false);

  return (
    <>
      <Section
        file="src/components/ui/status.tsx"
        note="El estado de algo. Siempre con la palabra: el color solo no dice nada."
        title="Estado">
        <Example title="dot · en renglones de una lista">
          <View style={styles.row}>
            {STATUSES.map((item) => (
              <Status key={item.tone} label={item.label} tone={item.tone} />
            ))}
          </View>
        </Example>
        <Example title="badge · en encabezados y tarjetas">
          <View style={styles.row}>
            {STATUSES.map((item) => (
              <Status key={item.tone} label={item.label} tone={item.tone} variant="badge" />
            ))}
          </View>
        </Example>
        <Example title="tint · cuando debe saltar a la vista">
          <View style={styles.row}>
            {STATUSES.map((item) => (
              <Status key={item.tone} label={item.label} tone={item.tone} variant="tint" />
            ))}
          </View>
        </Example>
      </Section>

      <Section
        file="src/components/ui/notice.tsx"
        note="Un aviso dentro de la pantalla: una o dos oraciones que explican algo o piden algo."
        title="Aviso">
        <Notice text="Los cambios se guardan solos mientras escribes." />
        <Notice
          action={{
            label: 'Reenviar correo',
            loading: sending,
            onPress: () => {
              setSending(true);
              setTimeout(() => setSending(false), 1400);
            },
          }}
          text="Te enviamos un correo para confirmar tu cuenta. Mientras tanto no puedes invitar a nadie."
          title="Cuenta sin confirmar"
          tone="warning"
        />
        <Notice text="No pudimos guardar el archivo. Pesa más de 10 MB." tone="danger" />
        <Notice text="Tu cuenta quedó confirmada." tone="success" />
      </Section>

      <Section
        file="src/components/ui/toast.tsx"
        note="El resultado de una acción. Se llama desde cualquier parte; un toque lo cierra."
        title="Toast">
        <View style={styles.row}>
          <Button label="Éxito" onPress={() => toast.success('Cambios guardados')} variant="secondary" />
          <Button label="Error" onPress={() => toast.error('No se pudo guardar. Intenta de nuevo.')} variant="secondary" />
        </View>
      </Section>

      <Section
        file="src/components/ui/empty-state.tsx"
        note="Una lista sin nada que mostrar, y algo que no cargó. Mismo lenguaje y sin rojo."
        title="Vacío y error">
        <Card>
          <EmptyState
            action={<Button icon="add" label="Nueva tarea" />}
            icon="checkbox-outline"
            subtitle="Cuando agregues una, aquí vas a ver en qué va."
            title="Todavía no tienes tareas"
          />
        </Card>
        <Card>
          <ErrorState onRetry={() => toast.success('Reintentando…')} />
        </Card>
      </Section>

      <Section
        file="src/components/ui/skeleton.tsx"
        note="Dos piezas básicas. El esqueleto de cada pantalla se arma con ellas, calcando lo que va a llegar."
        title="Esqueleto">
        <Card>
          <View style={styles.pair}>
            <SkeletonCircle size={44} />
            <View style={styles.skeletonCopy}>
              <Skeleton height={16} width="55%" />
              <Skeleton width="80%" />
            </View>
          </View>
          <Skeleton />
          <Skeleton width="70%" />
        </Card>
      </Section>

      <Section
        file="src/components/ui/offline-banner.tsx"
        note="Franja al fondo de la app mientras no hay internet. Aquí se enciende a mano para verla."
        title="Sin conexión">
        <SwitchRow
          description={offline ? 'Así se ve la franja.' : 'Enciéndelo para ver la franja.'}
          label="Simular sin conexión"
          onValueChange={setOffline}
          value={offline}
        />
        <OfflineBanner offline={offline} />
      </Section>
    </>
  );
}

const styles = StyleSheet.create({
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
  skeletonCopy: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
  },
});
