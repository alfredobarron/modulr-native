import { Image } from 'expo-image';
import { ReactNode, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/src/components/ui/text';
import { fontStyle, useTheme, useThemeColors } from '@/src/hooks/use-theme';

type AvatarProps = {
  // De aquí sale la inicial cuando no hay foto o no carga.
  name?: string | null;
  photoUrl?: string | null;
  // Cambia cuando la foto cambia sin que cambie su dirección (un `updated_at`):
  // obliga a volver a bajarla.
  cacheKey?: string | number | null;
  size?: number;
  // `circle` para personas; `rounded` (esquina del tema) para lo que no lo es:
  // una tienda, una casa.
  shape?: 'circle' | 'rounded';
  // Anillo verde alrededor: la persona está activa o disponible.
  active?: boolean;
  // Sello en la esquina inferior derecha (verificado, un distintivo).
  badge?: ReactNode;
};

function buildUrl(photoUrl?: string | null, cacheKey?: string | number | null) {
  const source = photoUrl?.trim();

  if (!source) {
    return null;
  }

  // Las direcciones firmadas (S3) ya traen parámetros y la firma los cubre
  // exactamente: agregarles `v=` la invalida.
  if (!cacheKey || source.includes('?')) {
    return source;
  }

  return `${source}?v=${encodeURIComponent(String(cacheKey))}`;
}

const RING = 2;

export function Avatar({ name, photoUrl, cacheKey, size = 44, shape = 'circle', active = false, badge }: AvatarProps) {
  const theme = useTheme();
  const colors = useThemeColors();
  const source = buildUrl(photoUrl, cacheKey);
  // El error se recuerda POR dirección: una foto nueva vuelve a intentarse sola.
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const showPhoto = source !== null && failedSource !== source;
  const radius = shape === 'circle' ? size / 2 : size <= 48 ? theme.radius.control : theme.radius.card;
  const initial = name?.trim()[0]?.toUpperCase() ?? '?';

  const face = (
    <View
      style={[
        styles.face,
        { backgroundColor: colors.avatarBackground, borderRadius: radius, height: size, width: size },
      ]}>
      {showPhoto ? (
        <Image
          accessibilityIgnoresInvertColors
          contentFit="cover"
          onError={() => setFailedSource(source)}
          source={{ uri: source }}
          style={{ height: size, width: size }}
        />
      ) : (
        <Text style={[fontStyle(theme, 'bold'), { color: colors.avatarText, fontSize: size * 0.42, lineHeight: size * 0.52 }]}>
          {initial}
        </Text>
      )}
    </View>
  );

  if (!active && !badge) {
    return face;
  }

  return (
    <View>
      {/* El anillo va por FUERA de la cara, separado por un filo del fondo. */}
      <View
        style={
          active
            ? { borderColor: colors.green, borderRadius: radius + RING * 2, borderWidth: RING, padding: RING }
            : undefined
        }>
        {face}
      </View>
      {badge ? <View style={styles.badge}>{badge}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    bottom: -2,
    position: 'absolute',
    right: -2,
  },
  face: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
