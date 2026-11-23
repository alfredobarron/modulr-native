import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { type TextInputInstance } from 'react-native';

import { ModulrLogo } from '@/catalog/logo';
import { AuthShell } from '@/src/components/ui/auth-shell';
import { Button } from '@/src/components/ui/button';
import { TextField } from '@/src/components/ui/text-field';
import { toast } from '@/src/components/ui/toast';

export default function LoginDemo() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tried, setTried] = useState(false);
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInputInstance>(null);
  const emailError = tried && !email.includes('@') ? 'Escribe un correo válido.' : undefined;

  const submit = () => {
    setTried(true);

    if (!email.includes('@')) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.error('Correo o contraseña incorrectos.');
    }, 1200);
  };

  return (
    <AuthShell
      description="Entra con tu correo."
      logo={<ModulrLogo />}
      onBack={() => router.back()}
      title="Qué gusto verte">
      <TextField
        autoCapitalize="none"
        autoComplete="email"
        errorText={emailError}
        keyboardType="email-address"
        label="Correo"
        onChangeText={setEmail}
        onSubmitEditing={() => passwordRef.current?.focus()}
        returnKeyType="next"
        value={email}
      />
      <TextField
        autoComplete="current-password"
        label="Contraseña"
        onChangeText={setPassword}
        onSubmitEditing={submit}
        ref={passwordRef}
        returnKeyType="go"
        secureTextEntry
        value={password}
      />
      <Button fullWidth label="Entrar" loading={loading} onPress={submit} size="lg" />
      <Button
        fullWidth
        label="Olvidé mi contraseña"
        onPress={() => toast.success('Te enviamos un código a tu correo.')}
        variant="ghost"
      />
    </AuthShell>
  );
}
