import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

// ¿Hay internet? Sin módulo nativo: pregunta cada 15 s (y al volver a la app)
// a una dirección que responde vacío. `null` mientras no se sabe.
export function useIsConnected(enabled = true) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    async function check() {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      try {
        await fetch('https://clients3.google.com/generate_204', { method: 'HEAD', signal: controller.signal });
        setIsConnected(true);
      } catch {
        setIsConnected(false);
      } finally {
        clearTimeout(timeout);
      }
    }

    void check();
    const interval = setInterval(() => void check(), 15_000);
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') void check();
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [enabled]);

  return isConnected;
}
