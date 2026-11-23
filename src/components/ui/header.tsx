import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { PressableScale } from '@/src/components/ui/pressable-scale';
import { Text } from '@/src/components/ui/text';
import { useTheme, useThemeColors } from '@/src/hooks/use-theme';

type HeaderProps = {
  title: string;
  // Contexto bajo el título (el proyecto, la ciudad, «3 pendientes»). Debajo y en
  // apoyo: el título manda.
  subtitle?: string;
  // Con `onBack` sale la flecha de regreso.
  onBack?: () => void;
  // Acciones a la derecha: uno o dos `Button` en tamaño `sm`. Solo cosas que
  // se TOCAN; lo que informa (estados, conteos) va en el contenido.
  right?: ReactNode;
  // Tamaño del título. Sin indicarlo: grande en una pantalla raíz y compacto
  // en una con flecha. Se fuerza `large` cuando una sección principal se abre
  // desde otra pantalla y por eso trae flecha.
  size?: 'large' | 'compact';
};

// El header de toda pantalla. Se pasa al andamio (`<Screen header={…}>`), que
// lo fija arriba y hace pasar el contenido por debajo.
export function Header({ title, subtitle, onBack, right, size }: HeaderProps) {
  const theme = useTheme();
  const colors = useThemeColors();
  const large = (size ?? (onBack ? 'compact' : 'large')) === 'large';

  return (
    <View style={[styles.row, { minHeight: theme.size.control.sm + 2 }]}>
      {onBack ? (
        <PressableScale accessibilityLabel="Regresar" hitSlop={10} onPress={onBack} style={styles.back}>
          <Ionicons color={colors.text} name="arrow-back" size={22} />
        </PressableScale>
      ) : null}
      <View style={styles.copy}>
        <Text accessibilityRole="header" numberOfLines={1} variant={large ? 'headline' : 'subtitle'}>
          {title}
        </Text>
        {subtitle ? (
          <Text colorToken="textMuted" numberOfLines={1} variant="caption">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  back: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  copy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  right: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
});
