import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Section } from '@/catalog/pieces';
import { Card } from '@/src/components/ui/card';
import { DateField } from '@/src/components/ui/date-field';
import { SearchField } from '@/src/components/ui/search-field';
import { Select } from '@/src/components/ui/select';
import { Switch, SwitchRow } from '@/src/components/ui/switch';
import { Text } from '@/src/components/ui/text';
import { TextField } from '@/src/components/ui/text-field';

const COUNTRIES = [
  { value: 'mx', label: 'México' },
  { value: 'co', label: 'Colombia' },
  { value: 'ar', label: 'Argentina' },
] as const;

const PEOPLE = [
  'María Robles',
  'Luis Rentería',
  'Ana Sofía Méndez',
  'José Ángel Peña',
  'Carlos Ibáñez',
  'Lucía Fernández',
  'Raúl Domínguez',
  'Inés Castañeda',
  'Tomás Villaseñor',
  'Paula Ordóñez',
  'Andrés Núñez',
  'Julia Zúñiga',
].map((label, index) => ({ value: index, label, caption: index % 2 === 0 ? 'Diseño' : 'Desarrollo' }));

export function FormsSections() {
  const [name, setName] = useState('María Robles');
  const [query, setQuery] = useState('contrato');
  const [country, setCountry] = useState<(typeof COUNTRIES)[number]['value'] | null>('mx');
  const [person, setPerson] = useState<number | null>(null);
  const [due, setDue] = useState<Date | null>(null);
  const [hour, setHour] = useState<Date | null>(null);
  const [notify, setNotify] = useState(true);
  const [shared, setShared] = useState(false);
  const [access, setAccess] = useState(false);

  return (
    <>
      <Section
        file="src/components/ui/text-field.tsx"
        note="Acepta lo mismo que TextInput. El borde dice el estado: en reposo, enfocado o con error."
        title="Campo de texto">
        <TextField label="Nombre" onChangeText={setName} value={name} />
        <TextField hint="Solo lo usamos para avisarte." keyboardType="phone-pad" label="Celular" placeholder="55 5555 0142" />
        <TextField errorText="Escribe un correo válido." keyboardType="email-address" label="Correo" value="maria@correo" />
        <TextField hint="Al menos 8 caracteres." label="Contraseña" secureTextEntry value="secreto123" />
        <TextField label="Notas" multiline placeholder="Lo que haga falta saber." />
        <TextField editable={false} label="Usuario" value="mrobles" />
      </Section>

      <Section
        file="src/components/ui/search-field.tsx"
        note="Un campo sin etiqueta a la vista, con lupa y la «x» que limpia de un toque."
        title="Buscador">
        <SearchField label="Buscar tareas" onChangeText={setQuery} placeholder="Buscar tareas" value={query} />
      </Section>

      <Section
        file="src/components/ui/select.tsx"
        note="Un campo que abre una hoja con las opciones. Con buscador filtra por texto; también puede buscar en el servidor."
        title="Selector">
        <Select icon="globe-outline" label="País" onChange={setCountry} options={COUNTRIES} value={country} />
        <Select
          hint="Con buscador y sin acentos: prueba «jose» o «nunez»."
          label="Responsable"
          onChange={setPerson}
          options={PEOPLE}
          placeholder="Elegir persona"
          searchable
          searchPlaceholder="Buscar persona"
          value={person}
        />
        <Select errorText="Elige un proyecto." label="Proyecto" onChange={() => {}} options={[]} value={null} />
        <Select disabled label="Idioma" onChange={() => {}} options={[{ value: 'es', label: 'Español' }]} value="es" />
      </Section>

      <Section
        file="src/components/ui/date-field.tsx"
        note="El selector nativo de cada sistema. Solo en el teléfono: en el navegador el campo sale apagado."
        title="Campo de fecha">
        <DateField hint="Fecha y hora: en Android son dos pasos encadenados." label="Fecha límite" mode="datetime" onChange={setDue} value={due} />
        <DateField label="Hora del recordatorio" mode="time" onChange={setHour} value={hour} />
      </Section>

      <Section
        file="src/components/ui/switch.tsx"
        note="El nativo de cada sistema con los colores del tema. En SwitchRow la fila entera es el interruptor."
        title="Interruptor">
        <Card>
          <SwitchRow
            description={notify ? 'Te avisamos de cada cambio.' : 'No recibes avisos.'}
            icon={notify ? 'notifications-outline' : 'notifications-off-outline'}
            label="Notificaciones"
            onValueChange={setNotify}
            value={notify}
          />
          <SwitchRow
            description={shared ? 'Tu equipo puede verla.' : 'Solo tú puedes verla.'}
            icon="people-outline"
            label="Compartir con el equipo"
            onValueChange={setShared}
            value={shared}
          />
          <SwitchRow
            description={access ? 'Puede entrar a la cuenta.' : 'No puede entrar a la cuenta.'}
            icon="key-outline"
            label="Acceso (apagado en rojo)"
            offTone="danger"
            onValueChange={setAccess}
            value={access}
          />
          <SwitchRow description="No se puede cambiar." disabled label="Deshabilitado" onValueChange={() => {}} value />
        </Card>
        <View style={styles.row}>
          <Switch accessibilityLabel="Interruptor suelto" onValueChange={setNotify} value={notify} />
          <Text colorToken="textMuted" variant="caption">
            Suelto, sin fila.
          </Text>
        </View>
      </Section>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
});
