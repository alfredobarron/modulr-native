# CLAUDE — Modulr Native

Catálogo de componentes para apps Expo / React Native. Aquí nace y se prueba cada componente con un
estilo neutro; cada app lo copia y lo viste con su marca. No es un paquete: se distribuye por copia.

## Qué es cada carpeta

- `src/theme/` — el contrato del tema (`tokens.ts`), el tema neutro de Modulr (`modulr.ts`: los
  colores de su logo, carbón y naranja ladrillo, y letra del sistema), `createTheme` y `ThemeProvider`.
- `src/hooks/` — cómo leen el tema los componentes, y los auxiliares de teclado y de layout.
- `src/components/ui/` y `src/components/navigation/` — los componentes. Es lo que se copia a cada
  app, con la misma ruta.
- `catalog/` y `app/` — la app de catálogo. **No se copia**: muestra los componentes por grupos
  (`catalog/sections/`), con pantallas de ejemplo (`app/demo/`) y la piel inventada «Aurora»
  (`catalog/skins.ts`) para ver cada componente vestido con otra marca.

## Reglas de un componente

- **Ningún valor propio**: colores, letras, tamaños de texto, espacios, radios, altos de control,
  grosor de borde y movimiento salen del tema (`useTheme()`, `useThemeColors()`). Ningún hex ni
  nombre de fuente fuera de `src/theme/`.
- **Solo lo que una app usa**: un componente o una variante entra cuando una pantalla real la
  necesita, no porque otra librería la tenga.
- **Genéricos**: un componente resuelve un problema de interfaz (un botón, una tarjeta), no una
  pantalla de un proyecto. Mismo vocabulario en todos: `variant` (cuánto pesa), `size` (`sm`, `md`,
  `lg`) y `tone` (qué significa).
- **Sin nombres de marca ni de proyecto**: ni en tokens, ni en props, ni en comentarios, ni en los
  ejemplos del catálogo.
- **Sin lógica de proyecto**: nada de API, sesión, stores de negocio ni rutas de una app.
- **Lo tocable es siempre un `PressableScale`** y lleva nombre para lector de pantalla. Excepciones:
  los filtros y el menú de pestañas, que no se animan.
- **Si un token falta, se agrega al contrato** (`tokens.ts` y `modulr.ts`), no se escribe el valor
  en el componente.
- **Una pantalla nunca calcula su geometría**: márgenes, altura del header, espacio del menú y
  teclado los resuelven los andamios (`Screen`, `ListScreen`, `FormScreen`, `AuthShell`) con
  `screen-layout.ts`. El header y la acción fija se les pasan como `header` y `footer`.
- **Los módulos nativos opcionales se cargan con guarda** (`try { require(...) }`): sin ellos el
  componente funciona, solo sin ese extra.
- **Cada componente entra al catálogo** en la sección de su grupo, con sus variantes y estados, y se
  revisa en las dos pieles y en claro y oscuro: si algo no cambia al pasar a Aurora, trae un valor
  fijo.

## Cómo lo viste una marca

`createTheme({ ... })` con solo lo que cambia; lo demás se hereda de Modulr. Lo habitual es `name`,
`colors` y `fonts`. Espacios, radios, tamaños y la forma del menú (`tabBar.variant`: `floating` o
`docked`) también se pueden mover, pero por defecto se conservan los de Modulr.

## Cómo correrlo

- `npm run web` — el catálogo en el navegador.
- `npx expo start --go` — en el teléfono con Expo Go.
- `npm run typecheck` y `npm run lint` antes de dar algo por terminado.

## Idioma

Comentarios y catálogo en español; `README.md` en inglés.

## Stack

Expo SDK 58, React Native 0.88, React 19.3, Reanimated 4, Gesture Handler 3, Expo Router,
TypeScript 6, React Compiler encendido.
