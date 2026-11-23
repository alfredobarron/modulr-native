import { modulrTheme } from './modulr';
import type { Theme, ThemeOverrides } from './tokens';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function merge<T>(base: T, overrides: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(overrides)) {
    return (overrides === undefined ? base : overrides) as T;
  }

  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(overrides)) {
    // Una llave presente se aplica aunque valga `undefined`: así una marca con
    // fuentes propias QUITA el peso que heredaría de la letra del sistema.
    result[key] = overrides[key] === undefined ? undefined : merge(result[key], overrides[key]);
  }
  return result as T;
}

// Viste a Modulr con una marca: se pasa SOLO lo que cambia y lo demás se
// hereda. Lo habitual es cambiar `name`, `colors` y `fonts`; quien quiera
// también puede mover espacios, radios, tamaños y la forma del menú.
//
//   export const acmeTheme = createTheme({
//     name: 'Acme',
//     colors: { light: { primary: '#2F6FED', buttonBackground: '#1F4FC4', buttonText: '#FFFFFF' } },
//     fonts: { display: { family: 'Inter-ExtraBold', weight: undefined } },
//   });
export function createTheme(overrides: ThemeOverrides, base: Theme = modulrTheme): Theme {
  return merge(base, overrides);
}
