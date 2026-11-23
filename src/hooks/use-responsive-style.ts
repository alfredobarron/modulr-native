import { useWindowDimensions } from 'react-native';

export const TABLET_BREAKPOINT = 768;
export const CONTENT_MAX_WIDTH = 600;

export function useResponsiveContentStyle() {
  const { width } = useWindowDimensions();

  if (width < TABLET_BREAKPOINT) {
    return null;
  }

  return {
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center' as const,
    width: '100%' as const,
  };
}
