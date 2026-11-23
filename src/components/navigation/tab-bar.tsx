import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FloatingMaterial } from '@/src/components/ui/screen-overlays';
import { Text } from '@/src/components/ui/text';
import { CONTENT_MAX_WIDTH, TABLET_BREAKPOINT } from '@/src/hooks/use-responsive-style';
import { useTheme, useThemeColors } from '@/src/hooks/use-theme';

const ICON_SIZE = 24;

// El menú principal de la app. Una sola pieza con dos formas, según
// `tabBar.variant` del tema:
//
//   floating  Cápsula separada de las orillas; el contenido pasa por detrás.
//   docked    Barra pegada al fondo, de orilla a orilla.
//
// Se monta una vez en el layout de pestañas:
//
//   <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
//
// Cada pestaña da su `title` y su `tabBarIcon`. Una pestaña con `href: null`
// no sale. Para una acción central que no es pestaña (escanear, pedir), esa
// pantalla define `tabBarButton` y aquí se pinta tal cual en su lugar.
export function TabBar({ state, descriptors, emitter, navigateToTab }: BottomTabBarProps) {
  const theme = useTheme();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { tabBar } = theme;
  const floating = tabBar.variant === 'floating';
  // En tablet el menú flotante se acota al ancho del contenido.
  const sideMargin =
    floating && width >= TABLET_BREAKPOINT ? Math.max((width - CONTENT_MAX_WIDTH) / 2, tabBar.sideMargin) : tabBar.sideMargin;

  const items = state.routes.map((route, index) => {
    const { options } = descriptors[route.key];

    if (options.hidden) {
      return null;
    }

    const focused = state.index === index;
    const label = options.title ?? route.name;

    if (options.tabBarButton) {
      return (
        <View key={route.key} style={styles.item}>
          {options.tabBarButton({ children: null } as never)}
        </View>
      );
    }

    const onPress = () => {
      const event = emitter.emit({ canPreventDefault: true, target: route.key, type: 'tabPress' });

      if (!focused && !event.defaultPrevented) {
        navigateToTab(route.key);
      }
    };

    // El activo lleva el ícono en el acento y la etiqueta en tinta (el acento
    // no siempre se lee como texto); los demás, en apoyo.
    const iconColor = focused ? colors.primary : colors.textMuted;

    return (
      <Pressable
        accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        key={route.key}
        onLongPress={() => emitter.emit({ target: route.key, type: 'tabLongPress' })}
        onPress={onPress}
        style={styles.item}>
        {options.tabBarIcon?.({ color: iconColor, focused, size: ICON_SIZE })}
        <Text colorToken={focused ? 'text' : 'textMuted'} numberOfLines={1} variant="tab">
          {label}
        </Text>
      </Pressable>
    );
  });

  if (floating) {
    return (
      <View
        style={[
          styles.floating,
          {
            borderColor: colors.border,
            borderRadius: tabBar.radius,
            borderWidth: theme.border.width,
            bottom: insets.bottom + tabBar.bottomMargin,
            height: tabBar.height,
            left: sideMargin,
            right: sideMargin,
          },
        ]}>
        <FloatingMaterial color={colors.surface} />
        <View accessibilityRole="tablist" style={styles.row}>
          {items}
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        borderTopWidth: theme.border.width,
        paddingBottom: insets.bottom,
      }}>
      {/* Alto fijo y SIN `flex: 1`: en el teléfono un hijo con flex dentro de un
          padre sin alto propio se aplasta a cero (en web no), y el menú no se veía. */}
      <View accessibilityRole="tablist" style={[styles.dockedRow, { height: tabBar.height }]}>
        {items}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floating: {
    overflow: 'hidden',
    position: 'absolute',
  },
  item: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
    justifyContent: 'center',
  },
  dockedRow: {
    flexDirection: 'row',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
});
