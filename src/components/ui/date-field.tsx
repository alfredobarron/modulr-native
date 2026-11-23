import { useState } from 'react';
import { Platform } from 'react-native';

import { FieldButton, FieldFrame } from '@/src/components/ui/field';

// Módulo NATIVO opcional: sin `@react-native-community/datetimepicker` (o en
// web, donde no existe) el campo se apaga en vez de tumbar la pantalla.
let DateTimePicker: typeof import('@react-native-community/datetimepicker').default | null = null;
if (Platform.OS !== 'web') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    DateTimePicker = require('@react-native-community/datetimepicker').default;
  } catch {
    DateTimePicker = null;
  }
}

export type DateFieldMode = 'date' | 'time' | 'datetime';

type DateFieldProps = {
  label: string;
  hideLabel?: boolean;
  value: Date | null;
  onChange: (date: Date) => void;
  // Qué se elige: el día, la hora o las dos cosas.
  mode?: DateFieldMode;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  hint?: string;
  errorText?: string | null;
  disabled?: boolean;
  // Idioma del calendario y del texto del campo.
  locale?: string;
  // Cómo se escribe lo elegido. Sin él: «12 de septiembre, 8:00 p.m.».
  formatValue?: (date: Date) => string;
};

const FORMATS: Record<DateFieldMode, Intl.DateTimeFormatOptions> = {
  date: { day: 'numeric', month: 'long', year: 'numeric' },
  datetime: { day: 'numeric', hour: 'numeric', minute: '2-digit', month: 'long' },
  time: { hour: 'numeric', minute: '2-digit' },
};

const PLACEHOLDERS: Record<DateFieldMode, string> = {
  date: 'Elegir fecha',
  datetime: 'Elegir fecha y hora',
  time: 'Elegir hora',
};

// Fecha, hora o las dos en un campo, con el selector NATIVO del sistema.
//
// En Android «fecha y hora» viene en dos pasos (primero el calendario, luego
// el reloj) y hay que encadenarlos a mano; en iOS es uno solo. El componente
// lo esconde: quien lo usa recibe una fecha completa.
export function DateField({
  label,
  hideLabel,
  value,
  onChange,
  mode = 'date',
  placeholder,
  minimumDate,
  maximumDate,
  hint,
  errorText,
  disabled = false,
  locale = 'es-MX',
  formatValue,
}: DateFieldProps) {
  // 'date' → 'time' es el encadenado de Android; null = cerrado.
  const [step, setStep] = useState<'date' | 'time' | null>(null);
  // Lo elegido en el primer paso, esperando la hora.
  const [draft, setDraft] = useState<Date | null>(null);

  const unavailable = DateTimePicker === null;
  const base = value ?? minimumDate ?? new Date();
  const text = value ? (formatValue ? formatValue(value) : value.toLocaleString(locale, FORMATS[mode])) : null;

  const open = () => {
    setDraft(null);
    setStep(mode === 'time' ? 'time' : 'date');
  };

  const handleChange = (event: { type: string }, picked?: Date) => {
    // Android manda 'dismissed' al cancelar: no hay nada que guardar.
    if (event.type === 'dismissed' || !picked) {
      setStep(null);
      setDraft(null);
      return;
    }

    if (Platform.OS === 'android' && mode === 'datetime' && step === 'date') {
      setDraft(picked);
      setStep('time');
      return;
    }

    if (Platform.OS === 'android' && mode === 'datetime' && step === 'time' && draft) {
      const merged = new Date(draft);
      merged.setHours(picked.getHours(), picked.getMinutes(), 0, 0);
      setStep(null);
      setDraft(null);
      onChange(merged);
      return;
    }

    setStep(null);
    onChange(picked);
  };

  return (
    <FieldFrame disabled={disabled || unavailable} errorText={errorText} hideLabel={hideLabel} hint={hint} label={label}>
      <FieldButton
        accessibilityLabel={text ? `${label}: ${text}` : label}
        disabled={disabled || unavailable}
        error={Boolean(errorText)}
        icon={mode === 'time' ? 'time-outline' : 'calendar-outline'}
        onPress={open}
        placeholder={placeholder ?? PLACEHOLDERS[mode]}
        value={text}
      />

      {DateTimePicker && step ? (
        <DateTimePicker
          display={Platform.OS === 'ios' ? (mode === 'time' ? 'spinner' : 'inline') : 'default'}
          locale={locale}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          mode={Platform.OS === 'ios' ? mode : step}
          onChange={handleChange}
          value={draft ?? base}
        />
      ) : null}
    </FieldFrame>
  );
}
