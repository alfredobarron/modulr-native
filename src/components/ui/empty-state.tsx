import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/src/components/ui/button';
import { Text } from '@/src/components/ui/text';
import { useThemeColors } from '@/src/hooks/use-theme';

type EmptyStateProps = {
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  // Qué no hay («Todavía no tienes tareas»).
  title: string;
  // Qué va a aparecer aquí o qué hacer («Cuando pidas algo, aquí vas a ver en
  // qué va»).
  subtitle?: string;
  // La acción que saca del vacío: un `Button`.
  action?: ReactNode;
};

// Una lista o una sección sin nada que mostrar. Va como `ListEmptyComponent`
// de la lista o en el lugar del contenido.
export function EmptyState({ icon = 'file-tray-outline', title, subtitle, action }: EmptyStateProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={[styles.icon, { backgroundColor: colors.surfaceNeutral }]}>
        <Ionicons color={colors.text} name={icon} size={30} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.center} variant="title">
          {title}
        </Text>
        {subtitle ? (
          <Text colorToken="textMuted" style={styles.center}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {/* En fila para centrar la acción: un `Button` se alinea al inicio de
          su columna, y aquí todo va al centro. */}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

// Algo no cargó. Mismo lenguaje que el vacío y SIN rojo: no es destructivo ni
// culpa de quien usa la app; solo hay que reintentar.
export function ErrorState({
  title = 'No se pudo cargar',
  message = 'Revisa tu conexión e intenta de nuevo.',
  onRetry,
}: ErrorStateProps) {
  return (
    <EmptyState
      action={onRetry ? <Button icon="refresh" label="Reintentar" onPress={onRetry} variant="secondary" /> : undefined}
      icon="cloud-offline-outline"
      subtitle={message}
      title={title}
    />
  );
}

const styles = StyleSheet.create({
  action: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  center: {
    textAlign: 'center',
  },
  // Más aire arriba que abajo: el vacío suele quedar pegado al header.
  container: {
    alignItems: 'center',
    gap: 16,
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 56,
  },
  copy: {
    gap: 4,
  },
  icon: {
    alignItems: 'center',
    borderRadius: 999,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
});
