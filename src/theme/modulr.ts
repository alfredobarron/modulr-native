import type { Theme } from './tokens';

// ---------------------------------------------------------------------------
// Tema de Modulr: el estilo neutro del catálogo, sacado de su logo. Carbón para
// el texto, grises sin tinte, UN acento (el naranja de los ladrillos) y la letra
// del sistema, sin archivos de fuente. Esquinas de ladrillo: redondeadas, no en
// píldora. Es la base de la que parte cada marca.
// ---------------------------------------------------------------------------

// Los dos colores del logo.
const LADRILLO = '#FBAD56';
const CARBON = '#2E2E30';

export const modulrTheme: Theme = {
  name: 'Modulr',
  colors: {
    light: {
      background: '#F5F5F4',
      surface: '#FFFFFF',
      surfaceMuted: '#EDEDEC',
      surfaceNeutral: 'rgba(46,46,48,0.07)',
      surfaceHighlighted: '#FFF3E3',

      text: CARBON,
      body: '#4A4A4D',
      textMuted: '#6E6E73',

      border: 'rgba(46,46,48,0.12)',
      borderStrong: 'rgba(46,46,48,0.45)',

      primary: LADRILLO,
      primarySoft: '#FFF3E3',
      // El naranja del logo no se lee como texto sobre claro: para eso, este.
      link: '#A85A00',

      // Como en el logo: ladrillo con letra carbón (6.1:1).
      buttonBackground: LADRILLO,
      buttonText: CARBON,
      buttonOutline: 'rgba(46,46,48,0.45)',
      buttonDangerBackground: '#FCEDED',
      buttonDangerText: '#C42B2B',
      buttonDangerOutline: 'transparent',

      green: '#3FA828',
      greenInk: '#2B7A14',
      greenTint: '#E8F5E5',
      red: '#E5484D',
      redInk: '#C42B2B',
      redTint: '#FCEDED',
      amber: '#F59E0B',
      amberInk: '#92400E',
      amberTint: '#FEEFD4',
      blue: '#2F7DE1',
      blueInk: '#1D5BB0',
      blueTint: '#E6EFFB',
      off: '#A5A5AA',

      input: '#FFFFFF',
      switchOn: LADRILLO,
      switchThumb: '#FFFFFF',
      avatarBackground: '#FFF3E3',
      avatarText: '#A85A00',
      scrim: 'rgba(46,46,48,0.45)',
      viewerBackground: '#000000',
      viewerText: '#FFFFFF',
    },
    dark: {
      background: '#161617',
      surface: '#212123',
      surfaceMuted: '#2B2B2E',
      surfaceNeutral: 'rgba(255,255,255,0.09)',
      surfaceHighlighted: '#3B2D1B',

      text: '#F4F4F5',
      body: '#C9C9CE',
      textMuted: '#98989F',

      border: 'rgba(255,255,255,0.12)',
      borderStrong: 'rgba(255,255,255,0.42)',

      primary: LADRILLO,
      primarySoft: '#3B2D1B',
      link: '#FFC27A',

      buttonBackground: LADRILLO,
      buttonText: CARBON,
      buttonOutline: 'rgba(255,255,255,0.42)',
      buttonDangerBackground: '#402B2E',
      buttonDangerText: '#FF8A8C',
      buttonDangerOutline: 'transparent',

      green: '#5BD44A',
      greenInk: '#7BD862',
      greenTint: '#293A28',
      red: '#FF6B6E',
      redInk: '#FF8A8C',
      redTint: '#402B2E',
      amber: '#FBBF24',
      amberInk: '#FCD34D',
      amberTint: '#443A23',
      blue: '#5AA2FF',
      blueInk: '#8ABEFF',
      blueTint: '#293342',
      off: '#6F6F76',

      input: '#212123',
      switchOn: LADRILLO,
      switchThumb: '#FFFFFF',
      avatarBackground: '#3B2D1B',
      avatarText: '#FFC27A',
      scrim: 'rgba(0,0,0,0.6)',
      viewerBackground: '#000000',
      viewerText: '#FFFFFF',
    },
  },
  fonts: {
    regular: { weight: '400' },
    medium: { weight: '500' },
    semiBold: { weight: '600' },
    bold: { weight: '700' },
    display: { weight: '800' },
    numeric: { weight: '600' },
  },
  type: {
    display: { font: 'display', size: 34, lineHeight: 38, letterSpacing: -0.6 },
    headline: { font: 'display', size: 28, lineHeight: 32, letterSpacing: -0.3 },
    subtitle: { font: 'bold', size: 20, lineHeight: 25 },
    cardTitle: { font: 'bold', size: 18, lineHeight: 23 },
    title: { font: 'bold', size: 16, lineHeight: 21 },
    body: { font: 'regular', size: 15, lineHeight: 21 },
    caption: { font: 'medium', size: 13, lineHeight: 18 },
    label: { font: 'semiBold', size: 13, lineHeight: 17 },
    labelStrong: { font: 'bold', size: 13, lineHeight: 17 },
    fieldLabel: { font: 'semiBold', size: 14, lineHeight: 18 },
    button: { font: 'semiBold', size: 15, lineHeight: 20 },
    buttonSmall: { font: 'semiBold', size: 13, lineHeight: 16 },
    // Etiqueta del menú: 14 de interlineado para no recortar la «g».
    tab: { font: 'semiBold', size: 12, lineHeight: 14 },
    data: { font: 'numeric', size: 14, lineHeight: 18, tabular: true },
    price: { font: 'numeric', size: 20, lineHeight: 24, tabular: true },
  },
  spacing: {
    screenHorizontal: 16,
    screenTop: 8,
    screenBottom: 12,
    scrollBottom: 32,
    headerGap: 14,
    gap: 12,
    cardPadding: 16,
    cardGap: 14,
    controlHorizontal: 20,
  },
  radius: {
    control: 12,
    card: 16,
    sheet: 24,
    button: 12,
    pill: 999,
  },
  size: {
    control: { sm: 36, md: 44, lg: 52 },
    icon: 18,
  },
  border: {
    width: 1,
    emphasis: 1,
  },
  motion: {
    pressScale: 0.97,
    pressDuration: 160,
    disabledOpacity: 0.4,
  },
  tabBar: {
    variant: 'floating',
    height: 58,
    radius: 29,
    sideMargin: 22,
    bottomMargin: 10,
  },
};
