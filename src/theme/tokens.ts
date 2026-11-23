import type { TextStyle } from 'react-native';

// ---------------------------------------------------------------------------
// Contrato del tema de Modulr. Todo lo que una marca puede vestir vive aquí:
// colores, letras, escala de texto, espacios, radios, tamaños, movimiento y la
// forma del menú. Los componentes NO escriben ningún valor propio: lo leen del
// tema. Una marca parte de `modulrTheme` y cambia solo lo que quiere con
// `createTheme` (src/theme/create-theme.ts).
// ---------------------------------------------------------------------------

export type Palette = {
  // Superficies
  background: string;
  surface: string;
  surfaceMuted: string;
  surfaceNeutral: string;
  surfaceHighlighted: string;

  // Texto: tinta, cuerpo y apoyo
  text: string;
  body: string;
  textMuted: string;

  // Bordes: el de tarjetas y el fuerte (campos y botones secundarios, ≥3:1)
  border: string;
  borderStrong: string;

  // Marca: el acento (lo activo), su tinte y su versión para texto
  primary: string;
  primarySoft: string;
  link: string;

  // Botón principal, y el contorno del secundario
  buttonBackground: string;
  buttonText: string;
  buttonOutline: string;
  // Botón destructivo: cada marca decide si es rojo o un contorno sobrio.
  buttonDangerBackground: string;
  buttonDangerText: string;
  buttonDangerOutline: string;

  // Estados: color, su versión para texto (`Ink`) y su tinte de fondo. Los
  // tintes van OPACOS: un botón con tinte flota sobre contenido que scrollea.
  green: string;
  greenInk: string;
  greenTint: string;
  red: string;
  redInk: string;
  redTint: string;
  amber: string;
  amberInk: string;
  amberTint: string;
  blue: string;
  blueInk: string;
  blueTint: string;
  off: string;

  // Piezas
  input: string;
  // Interruptor: riel encendido y botón (el apagado usa `off`)
  switchOn: string;
  switchThumb: string;
  avatarBackground: string;
  avatarText: string;
  scrim: string;
  // Visor de fotos: siempre oscuro, sea cual sea el tema
  viewerBackground: string;
  viewerText: string;
};

export type ColorToken = keyof Palette;

// Vocabulario común de los componentes. Las mismas tres palabras significan lo
// mismo en todos: `size` es el alto del control, `tone` es el significado
// (qué tan delicado o qué estado) y `variant`, cuánto pesa a la vista.
export type Size = 'sm' | 'md' | 'lg';
export type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

// Una letra es una familia, un peso o los dos: con fuentes propias el peso va
// en la familia (`Archivo-Bold`); con la del sistema, en `weight`.
export type FontToken = {
  family?: string;
  weight?: TextStyle['fontWeight'];
};

export type FontRole = 'regular' | 'medium' | 'semiBold' | 'bold' | 'display' | 'numeric';

export type TextVariant =
  | 'display'
  | 'headline'
  | 'subtitle'
  | 'cardTitle'
  | 'title'
  | 'body'
  | 'caption'
  | 'label'
  | 'labelStrong'
  | 'fieldLabel'
  | 'button'
  | 'buttonSmall'
  | 'tab'
  | 'data'
  | 'price';

export type TypeToken = {
  font: FontRole;
  size: number;
  lineHeight: number;
  letterSpacing?: number;
  // Cifras del mismo ancho, para montos y horas en columna.
  tabular?: boolean;
};

export type Theme = {
  name: string;
  colors: { light: Palette; dark: Palette };
  fonts: Record<FontRole, FontToken>;
  type: Record<TextVariant, TypeToken>;
  spacing: {
    // Márgenes de pantalla
    screenHorizontal: number;
    screenTop: number;
    screenBottom: number;
    scrollBottom: number;
    // Aire entre el header fijo y el primer bloque
    headerGap: number;
    // Ritmo vertical entre bloques y entre tarjetas de una lista
    gap: number;
    // Interior de una tarjeta
    cardPadding: number;
    cardGap: number;
    // Interior horizontal de un botón o un campo
    controlHorizontal: number;
  };
  radius: {
    control: number;
    card: number;
    sheet: number;
    button: number;
    pill: number;
  };
  size: {
    // Alto de botón y campo, en tres tamaños
    control: { sm: number; md: number; lg: number };
    // Ícono dentro de un botón
    icon: number;
  };
  border: {
    width: number;
    // Grosor del contorno que debe leerse como control: el botón secundario.
    emphasis: number;
  };
  motion: {
    pressScale: number;
    pressDuration: number;
    disabledOpacity: number;
  };
  tabBar: {
    // `floating`: cápsula separada del borde. `docked`: pegada al fondo.
    variant: 'floating' | 'docked';
    height: number;
    radius: number;
    sideMargin: number;
    bottomMargin: number;
  };
};

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type ThemeOverrides = DeepPartial<Theme>;
