import 'react-native-reanimated';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SKINS, useCatalogStore } from '@/catalog/skins';
import { ImageGalleryHost } from '@/src/components/ui/image-gallery';
import { ToastHost } from '@/src/components/ui/toast';
import { ThemeProvider, useAppTheme } from '@/src/theme/provider';

function Navigator() {
  const { colors, isDark } = useAppTheme();

  return (
    <>
      <Stack screenOptions={{ contentStyle: { backgroundColor: colors.background }, headerShown: false }} />
      <ImageGalleryHost />
      <ToastHost />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  const skin = useCatalogStore((state) => state.skin);
  const preference = useCatalogStore((state) => state.preference);
  const theme = SKINS.find((item) => item.key === skin)?.theme;

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <ThemeProvider preference={preference} theme={theme}>
          <Navigator />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
