import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { type TextInputInstance } from 'react-native';

import { CatalogControls } from '@/catalog/pieces';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { DateField } from '@/src/components/ui/date-field';
import { FormScreen } from '@/src/components/ui/form-screen';
import { Header } from '@/src/components/ui/header';
import { Select } from '@/src/components/ui/select';
import { SwitchRow } from '@/src/components/ui/switch';
import { TextField } from '@/src/components/ui/text-field';
import { toast } from '@/src/components/ui/toast';

const PROJECTS = [
  { value: 'atlas', label: 'Proyecto Atlas' },
  { value: 'boreal', label: 'Proyecto Boreal' },
  { value: 'cima', label: 'Proyecto Cima', caption: 'Archivado: solo lectura' },
] as const;

export default function FormDemo() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [tried, setTried] = useState(false);
  const [project, setProject] = useState<(typeof PROJECTS)[number]['value'] | null>(null);
  const [due, setDue] = useState<Date | null>(null);
  const [notify, setNotify] = useState(true);
  // «Siguiente» en el teclado pasa el foco al campo de abajo.
  const owner = useRef<TextInputInstance>(null);
  const place = useRef<TextInputInstance>(null);
  const link = useRef<TextInputInstance>(null);
  const notes = useRef<TextInputInstance>(null);

  const save = () => {
    setTried(true);

    if (title.trim().length === 0) {
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Tarea guardada');
    }, 1400);
  };

  return (
    <FormScreen
      footer={<Button fullWidth label="Guardar tarea" loading={saving} onPress={save} size="lg" />}
      header={<Header onBack={() => router.back()} right={<CatalogControls />} title="Nueva tarea" />}>
      <TextField
        errorText={tried && title.trim().length === 0 ? 'Ponle un título para encontrarla después.' : undefined}
        hint="Corto y con un verbo: «Revisar el contrato»."
        label="Título"
        onChangeText={setTitle}
        onSubmitEditing={() => owner.current?.focus()}
        returnKeyType="next"
        value={title}
      />
      <Select label="Proyecto" onChange={setProject} options={PROJECTS} placeholder="Elegir proyecto" value={project} />
      <DateField label="Fecha límite" mode="datetime" onChange={setDue} value={due} />
      <TextField label="Responsable" onSubmitEditing={() => place.current?.focus()} ref={owner} returnKeyType="next" />
      <TextField label="Lugar" onSubmitEditing={() => link.current?.focus()} ref={place} returnKeyType="next" />
      <TextField
        autoCapitalize="none"
        keyboardType="url"
        label="Enlace"
        onSubmitEditing={() => notes.current?.focus()}
        ref={link}
        returnKeyType="next"
      />
      <TextField label="Notas" multiline placeholder="Lo que haga falta saber." ref={notes} />
      <Card>
        <SwitchRow
          description={notify ? 'Te avisamos un día antes.' : 'No recibes recordatorio.'}
          label="Recordarme"
          onValueChange={setNotify}
          value={notify}
        />
      </Card>
    </FormScreen>
  );
}
