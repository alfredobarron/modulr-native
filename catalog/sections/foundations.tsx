import { StyleSheet, View } from 'react-native';

import { Section } from '@/catalog/pieces';
import { Card } from '@/src/components/ui/card';
import { Text } from '@/src/components/ui/text';
import { useTheme, useThemeColors } from '@/src/hooks/use-theme';
import type { ColorToken, TextVariant } from '@/src/theme/tokens';

const COLOR_GROUPS: readonly { title: string; tokens: readonly ColorToken[] }[] = [
  { title: 'Superficies', tokens: ['background', 'surface', 'surfaceMuted', 'surfaceNeutral', 'surfaceHighlighted'] },
  { title: 'Texto y bordes', tokens: ['text', 'body', 'textMuted', 'border', 'borderStrong'] },
  {
    title: 'Marca y botones',
    tokens: [
      'primary',
      'primarySoft',
      'link',
      'buttonBackground',
      'buttonText',
      'buttonOutline',
      'buttonDangerBackground',
      'buttonDangerText',
      'buttonDangerOutline',
    ],
  },
  {
    title: 'Estados',
    tokens: ['green', 'greenInk', 'greenTint', 'red', 'redInk', 'redTint', 'amber', 'amberInk', 'amberTint', 'blue', 'blueInk', 'blueTint', 'off'],
  },
  {
    title: 'Piezas',
    tokens: ['input', 'switchOn', 'switchThumb', 'avatarBackground', 'avatarText', 'scrim', 'viewerBackground', 'viewerText'],
  },
];

const TEXT_SAMPLES: readonly { variant: TextVariant; sample: string }[] = [
  { variant: 'display', sample: 'Tareas de hoy' },
  { variant: 'headline', sample: 'Tareas de hoy' },
  { variant: 'subtitle', sample: 'En curso' },
  { variant: 'cardTitle', sample: 'María Robles' },
  { variant: 'title', sample: 'Revisar el contrato' },
  { variant: 'body', sample: 'Hay que entregarlo antes del viernes a las 2:30 de la tarde.' },
  { variant: 'caption', sample: 'Hace 12 minutos' },
  { variant: 'label', sample: 'Responsable' },
  { variant: 'labelStrong', sample: 'Urgente' },
  { variant: 'fieldLabel', sample: 'Correo' },
  { variant: 'button', sample: 'Guardar cambios' },
  { variant: 'buttonSmall', sample: 'Ver todo' },
  { variant: 'tab', sample: 'Inicio' },
  { variant: 'data', sample: '14:05 · 3.2 km' },
  { variant: 'price', sample: '$1,284.50' },
];

export function FoundationsSections() {
  const theme = useTheme();
  const colors = useThemeColors();

  const measures = [
    ['Radios', `control ${theme.radius.control} · tarjeta ${theme.radius.card} · hoja ${theme.radius.sheet} · botón ${theme.radius.button}`],
    ['Tamaños', `sm ${theme.size.control.sm} · md ${theme.size.control.md} · lg ${theme.size.control.lg} · ícono ${theme.size.icon}`],
    ['Espacios', `pantalla ${theme.spacing.screenHorizontal} · entre bloques ${theme.spacing.gap} · tarjeta ${theme.spacing.cardPadding}`],
    ['Bordes', `normal ${theme.border.width} · de control ${theme.border.emphasis}`],
    ['Menú', `${theme.tabBar.variant === 'floating' ? 'flotante' : 'pegado al fondo'} · alto ${theme.tabBar.height}`],
    ['Al tocar', `escala ${theme.motion.pressScale} en ${theme.motion.pressDuration} ms`],
  ] as const;

  return (
    <>
      <Section file="src/theme/tokens.ts" note="La paleta que llena cada marca, en claro y en oscuro." title="Colores">
        {COLOR_GROUPS.map((group) => (
          <View key={group.title} style={styles.group}>
            <Text colorToken="textMuted" variant="label">
              {group.title}
            </Text>
            <View style={styles.swatches}>
              {group.tokens.map((token) => (
                <View key={token} style={styles.swatch}>
                  <View
                    style={[
                      styles.swatchColor,
                      {
                        backgroundColor: colors[token],
                        borderColor: colors.border,
                        borderRadius: theme.radius.control,
                        borderWidth: theme.border.width,
                      },
                    ]}
                  />
                  <Text numberOfLines={1} variant="caption">
                    {token}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </Section>

      <Section file="src/components/ui/text.tsx" note="Cada variante trae letra, tamaño e interlineado del tema." title="Texto">
        <Card>
          {TEXT_SAMPLES.map((item) => (
            <View key={item.variant} style={styles.line}>
              <Text colorToken="textMuted" style={styles.name} variant="data">
                {item.variant}
              </Text>
              <Text style={styles.flex} variant={item.variant}>
                {item.sample}
              </Text>
            </View>
          ))}
        </Card>
      </Section>

      <Section file="src/theme/modulr.ts" note="Lo que no es color ni letra y una marca también puede mover." title="Medidas">
        <Card>
          {measures.map(([name, value]) => (
            <View key={name} style={styles.line}>
              <Text colorToken="textMuted" style={styles.name} variant="label">
                {name}
              </Text>
              <Text style={styles.flex} variant="data">
                {value}
              </Text>
            </View>
          ))}
        </Card>
      </Section>
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  group: {
    gap: 8,
  },
  line: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 12,
  },
  name: {
    width: 92,
  },
  swatch: {
    gap: 4,
    width: 104,
  },
  swatchColor: {
    height: 44,
  },
  swatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
