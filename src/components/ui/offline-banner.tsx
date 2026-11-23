import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/src/components/ui/text';
import { useIsConnected } from '@/src/hooks/use-is-connected';
import { useThemeColors } from '@/src/hooks/use-theme';

type OfflineBannerProps = {
  // Para decidirlo desde fuera (una app que ya detecta la red con otro
  // medio). Sin indicarlo, el aviso lo revisa por su cuenta.
  offline?: boolean;
};

// Franja de «sin conexión». Se monta UNA vez en el layout raíz, bajo el
// navegador: mientras no hay internet ocupa el fondo de la pantalla.
export function OfflineBanner({ offline }: OfflineBannerProps) {
  // Si lo deciden desde fuera, no hace falta preguntar por la red.
  const isConnected = useIsConnected(offline === undefined);
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  if (!(offline ?? isConnected === false)) {
    return null;
  }

  return (
    // Tinta con letra del color del fondo: se nota sin usar rojo, que no es
    // un error de quien usa la app.
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[styles.banner, { backgroundColor: colors.text, paddingBottom: 6 + insets.bottom }]}>
      <Text style={{ color: colors.background }} variant="label">
        Sin conexión a internet
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
  },
});
