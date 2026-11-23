<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/logo-dark.svg">
    <img src="assets/logo-light.svg" alt="Modulr" width="260">
  </picture>
</p>

# Modulr Native

A small set of React Native components and screen scaffolds for Expo apps, built to be **copied into
your project and dressed with your brand**.

Modulr is not a package you install. It is a catalog: every component lives in a plain file, reads
all of its colors, fonts, spacing and sizes from a theme, and carries no project logic. You copy the
files you need, write a theme with your brand, and own the code from then on.

> The code comments and the catalog app are written in Spanish.

## What is inside

| Group | Components |
|---|---|
| Base | `Text`, `Button`, `Card`, `PressableScale` |
| Screens | `Screen`, `ListScreen`, `FormScreen`, `AuthShell`, `Header`, `TabBar` |
| Forms | `TextField`, `SearchField`, `Select`, `DateField`, `Switch`, `SwitchRow` |
| Status and feedback | `Status`, `Notice`, `Toast`, `EmptyState`, `ErrorState`, `Skeleton`, `OfflineBanner` |
| Data | `Avatar`, `ListItem`, `ListGroup`, `SectionHeading`, `FilterPills` |
| Overlays | `BottomSheet`, image gallery |

A few things it takes care of so each screen does not have to:

- **Screen geometry.** Fixed header and footer, safe areas, the space a floating tab bar needs and the
  keyboard are solved by the scaffolds. A screen only passes `header` and `footer`.
- **One tab bar, two shapes.** Floating or docked, chosen by the theme.
- **Forms that survive the keyboard** on iOS and Android, with the submit action always reachable.
- **Accessibility by default.** Labels are required where an icon stands alone, touch targets reach
  44 pt, states are announced, and status is never color only.

## Try the catalog

```bash
npm install
npm run web          # in the browser
npx expo start --go  # on a phone with Expo Go
```

The catalog shows every component with its variants and states. Two switches in the header change
the skin (Modulr, or a made-up brand called Aurora) and the light/dark theme. If a component does not
change when you switch skins, it is not reading the theme: that is a bug.

## Use it in your app

1. Copy `src/theme`, `src/hooks` and the files you need from `src/components` into your app, keeping
   the same paths (imports use the `@/src/...` alias).
2. Write your theme. Pass only what changes; the rest is inherited from Modulr:

   ```ts
   import { createTheme } from '@/src/theme/create-theme';

   export const acmeTheme = createTheme({
     name: 'Acme',
     colors: { light: { primary: '#2F6FED', buttonBackground: '#1F4FC4', buttonText: '#FFFFFF' } },
     fonts: { display: { family: 'Inter-ExtraBold', weight: undefined } },
   });
   ```

3. Wrap your app once and mount the two hosts after your navigator:

   ```tsx
   <ThemeProvider theme={acmeTheme}>
     <Stack />
     <ImageGalleryHost />
     <ToastHost />
   </ThemeProvider>
   ```

Colors, fonts, type scale, spacing, radii, control sizes, border widths, press motion and the tab bar
shape are all part of the theme (`src/theme/tokens.ts`).

## Project layout

```
src/theme/        theme contract, the Modulr theme, createTheme, ThemeProvider
src/hooks/        how components read the theme, keyboard and layout helpers
src/components/   the components (this is what you copy)
catalog/          the catalog's own pieces, sections and the example skin
app/              the catalog app (Expo Router)
```

## Requirements

Expo SDK 58, React Native 0.88, React 19, Reanimated 4, Gesture Handler 3, Expo Router and
TypeScript. Optional native modules (`expo-haptics`, `expo-blur`, `expo-brightness`,
`@react-native-community/datetimepicker`) are loaded behind a guard: without them the component
still works, just without that extra.

## License

[MIT](LICENSE)
