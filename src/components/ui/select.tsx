import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';

import { BottomSheet } from '@/src/components/ui/bottom-sheet';
import { FieldButton, FieldFrame } from '@/src/components/ui/field';
import { PressableScale } from '@/src/components/ui/pressable-scale';
import { SearchField } from '@/src/components/ui/search-field';
import { Text } from '@/src/components/ui/text';
import { useTheme, useThemeColors } from '@/src/hooks/use-theme';

export type SelectOption<V extends string | number = string> = {
  value: V;
  label: string;
  // Segundo renglón de la opción («Av. Independencia 214»).
  caption?: string;
};

type SelectProps<V extends string | number> = {
  label: string;
  hideLabel?: boolean;
  placeholder?: string;
  options: readonly SelectOption<V>[];
  value: V | null;
  onChange: (value: V) => void;
  hint?: string;
  errorText?: string | null;
  disabled?: boolean;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  // Título de la hoja; sin él, la etiqueta.
  sheetTitle?: string;
  // Buscador sobre la lista. Por sí solo filtra las opciones por su texto.
  searchable?: boolean;
  searchPlaceholder?: string;
  // Para buscar en el servidor: recibe lo escrito y quien usa el Select le
  // pasa las `options` ya filtradas. Con `onSearch` el filtro local se apaga.
  onSearch?: (text: string) => void;
  loading?: boolean;
  // Qué decir cuando no hay opciones.
  emptyText?: string;
};

// El selector de un formulario: un campo que abre una hoja con las opciones.
// Nunca un picker nativo ni una alerta. Se ve como un campo más (misma caja
// que `TextField`) y la opción elegida lleva palomita.
export function Select<V extends string | number>({
  label,
  hideLabel,
  placeholder = 'Elegir',
  options,
  value,
  onChange,
  hint,
  errorText,
  disabled = false,
  icon,
  sheetTitle,
  searchable = false,
  searchPlaceholder = 'Buscar',
  onSearch,
  loading = false,
  emptyText = 'Sin resultados',
}: SelectProps<V>) {
  const theme = useTheme();
  const colors = useThemeColors();
  const { height: windowHeight } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = options.find((option) => option.value === value) ?? null;
  const hasSearch = searchable || Boolean(onSearch);

  const visibleOptions =
    !onSearch && query.trim().length > 0
      ? options.filter((option) => normalize(`${option.label} ${option.caption ?? ''}`).includes(normalize(query)))
      : options;

  const changeQuery = (text: string) => {
    setQuery(text);
    onSearch?.(text);
  };

  const close = () => {
    setOpen(false);
    changeQuery('');
  };

  return (
    <FieldFrame disabled={disabled} errorText={errorText} hideLabel={hideLabel} hint={hint} label={label}>
      <FieldButton
        accessibilityLabel={selected ? `${label}: ${selected.label}` : label}
        disabled={disabled}
        error={Boolean(errorText)}
        icon={icon}
        onPress={() => setOpen(true)}
        placeholder={placeholder}
        value={selected?.label ?? null}
      />

      <BottomSheet onClose={close} title={sheetTitle ?? label} visible={open}>
        {/* Con buscador la hoja toma un alto fijo y alto, para que el buscador
            quede arriba y el teclado tape solo la cola de la lista; si la hoja
            topa, este bloque cede. Sin buscador, mide lo que sus opciones. */}
        <View style={[styles.content, hasSearch ? { height: Math.round(windowHeight * 0.72) } : { maxHeight: Math.round(windowHeight * 0.6) }]}>
          {hasSearch ? (
            <SearchField label={searchPlaceholder} onChangeText={changeQuery} placeholder={searchPlaceholder} value={query} />
          ) : null}

          <FlatList
            accessibilityRole="radiogroup"
            contentContainerStyle={styles.list}
            data={visibleOptions}
            initialNumToRender={12}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(option) => String(option.value)}
            ListEmptyComponent={
              <Text colorToken="textMuted" style={styles.empty}>
                {loading ? 'Buscando…' : emptyText}
              </Text>
            }
            renderItem={({ item }) => {
              const isSelected = item.value === value;

              return (
                <PressableScale
                  accessibilityLabel={item.caption ? `${item.label}. ${item.caption}` : item.label}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => {
                    onChange(item.value);
                    close();
                  }}
                  style={[
                    styles.option,
                    {
                      // Fila plana; lo elegido, en el tinte del acento.
                      backgroundColor: isSelected ? colors.primarySoft : 'transparent',
                      borderRadius: theme.radius.control,
                      minHeight: theme.size.control.md,
                    },
                  ]}>
                  <View style={styles.optionCopy}>
                    <Text numberOfLines={1} variant="title">
                      {item.label}
                    </Text>
                    {item.caption ? (
                      <Text colorToken="textMuted" numberOfLines={2} variant="caption">
                        {item.caption}
                      </Text>
                    ) : null}
                  </View>
                  {isSelected ? <Ionicons color={colors.text} name="checkmark" size={20} /> : null}
                </PressableScale>
              );
            }}
            showsVerticalScrollIndicator={false}
            style={styles.flexShrink}
          />
        </View>
      </BottomSheet>
    </FieldFrame>
  );
}

// «Jose» encuentra «José».
function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

const styles = StyleSheet.create({
  content: {
    flexShrink: 1,
    gap: 12,
  },
  empty: {
    paddingVertical: 24,
    textAlign: 'center',
  },
  flexShrink: {
    flexShrink: 1,
  },
  list: {
    gap: 2,
    paddingBottom: 8,
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  optionCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
});
