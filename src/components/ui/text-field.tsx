import { Ionicons } from '@expo/vector-icons';
import { ReactNode, Ref, useState } from 'react';
import { Platform, StyleProp, StyleSheet, TextInput, type TextInputInstance, TextInputProps, View, ViewStyle } from 'react-native';

import { FieldFrame, useFieldBoxStyle, useFieldSidePadding } from '@/src/components/ui/field';
import { PressableScale } from '@/src/components/ui/pressable-scale';
import { fontStyle, useTheme, useThemeColors } from '@/src/hooks/use-theme';

type TextFieldProps = TextInputProps & {
  // Siempre con etiqueta: es el nombre del campo para lector de pantalla.
  // `hideLabel` la quita de la vista (un buscador), no del lector.
  label: string;
  hideLabel?: boolean;
  // Ayuda bajo el campo («Al menos 8 caracteres»). El error la reemplaza.
  hint?: string;
  errorText?: string;
  // Algo dentro del campo, antes o después del texto: un ícono, una lada, un
  // botón para limpiar.
  prefix?: ReactNode;
  suffix?: ReactNode;
  // Para enfocar el campo desde fuera (pasar al siguiente con «Siguiente»).
  ref?: Ref<TextInputInstance>;
  containerStyle?: StyleProp<ViewStyle>;
};

// El campo de texto. Acepta lo mismo que `TextInput`: con `secureTextEntry`
// agrega el ojo para ver la contraseña; con `multiline` crece hacia abajo; con
// `editable={false}` se apaga.
export function TextField({
  label,
  hideLabel = false,
  hint,
  errorText,
  prefix,
  suffix,
  ref,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}: TextFieldProps) {
  const theme = useTheme();
  const colors = useThemeColors();
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const secure = Boolean(props.secureTextEntry);
  const multiline = Boolean(props.multiline);
  const disabled = props.editable === false;
  const side = useFieldSidePadding();
  const boxStyle = useFieldBoxStyle({ disabled, error: Boolean(errorText), focused, multiline });
  const bodyType = theme.type.body;

  return (
    <FieldFrame disabled={disabled} errorText={errorText} hideLabel={hideLabel} hint={hint} label={label}>
      <View style={[styles.box, multiline ? styles.boxMultiline : null, boxStyle, containerStyle]}>
        {prefix ? <View style={[styles.adornment, { paddingLeft: side }]}>{prefix}</View> : null}
        <TextInput
          accessibilityLabel={label}
          aria-invalid={Boolean(errorText)}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          placeholderTextColor={colors.textMuted}
          ref={ref}
          style={[
            styles.input,
            fontStyle(theme, bodyType.font),
            {
              color: colors.text,
              fontSize: bodyType.size,
              paddingLeft: prefix ? 8 : side,
              paddingRight: suffix || secure ? 8 : side,
            },
            // El interlineado solo en varios renglones: en uno solo descentra
            // el texto en iOS.
            multiline ? { lineHeight: bodyType.lineHeight, textAlignVertical: 'top' } : null,
            // En web el navegador pinta su propio contorno al enfocar; el
            // foco ya lo dice el borde de la caja.
            Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null,
            style,
          ]}
          {...props}
          secureTextEntry={secure && !revealed}
        />
        {secure ? (
          <PressableScale
            accessibilityLabel={revealed ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            hitSlop={10}
            onPress={() => setRevealed((value) => !value)}
            style={[styles.adornment, { paddingRight: side }]}>
            <Ionicons color={colors.textMuted} name={revealed ? 'eye-off-outline' : 'eye-outline'} size={20} />
          </PressableScale>
        ) : suffix ? (
          <View style={[styles.adornment, { paddingRight: side }]}>{suffix}</View>
        ) : null}
      </View>
    </FieldFrame>
  );
}

const styles = StyleSheet.create({
  adornment: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  box: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  boxMultiline: {
    alignItems: 'flex-start',
  },
  input: {
    alignSelf: 'stretch',
    flex: 1,
    paddingVertical: 12,
  },
});
