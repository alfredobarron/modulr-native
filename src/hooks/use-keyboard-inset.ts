import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, type LayoutChangeEvent, Platform } from 'react-native';

/**
 * Cuánto TAPA el teclado al contenedor de un formulario, y si está abierto.
 *
 * En iOS el KeyboardAvoidingView ya encoge el contenedor: lo tapado es 0.
 * En Android depende del teléfono y de cómo corre la app: a veces la ventana
 * se encoge sola con el teclado y a veces no. No se supone ninguna de las dos:
 * se compara el alto del contenedor con el que tenía ANTES del teclado. Lo que
 * el teclado mide y el contenedor no cedió es lo que queda tapado.
 *
 * Se comparan solo ALTOS, nunca posiciones: las posiciones del teclado vienen
 * en coordenadas de pantalla y las de una vista, en coordenadas de la ventana,
 * que no siempre empiezan en el mismo punto (la barra de estado), y la
 * diferencia dejaba el botón del pie medio tapado.
 *
 * `onLayout` va en el contenedor que debe librar el teclado.
 */
export function useKeyboardInset() {
  const [inset, setInset] = useState(0);
  const [visible, setVisible] = useState(false);
  const restHeight = useRef<number | null>(null);
  const currentHeight = useRef<number | null>(null);
  const keyboardHeight = useRef(0);

  const update = useCallback(() => {
    if (Platform.OS !== 'android' || keyboardHeight.current === 0) {
      setInset(0);
      return;
    }

    const yielded =
      restHeight.current !== null && currentHeight.current !== null ? restHeight.current - currentHeight.current : 0;
    setInset(Math.max(0, Math.round(keyboardHeight.current - yielded)));
  }, []);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      currentHeight.current = event.nativeEvent.layout.height;

      // Sin teclado, este es el alto de referencia.
      if (keyboardHeight.current === 0) {
        restHeight.current = currentHeight.current;
      }

      update();
    },
    [update],
  );

  useEffect(() => {
    const ios = Platform.OS === 'ios';
    const showSubscription = Keyboard.addListener(ios ? 'keyboardWillShow' : 'keyboardDidShow', (event) => {
      keyboardHeight.current = event.endCoordinates.height;
      setVisible(true);
      update();
    });
    const hideSubscription = Keyboard.addListener(ios ? 'keyboardWillHide' : 'keyboardDidHide', () => {
      keyboardHeight.current = 0;
      setVisible(false);
      update();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [update]);

  return { inset, visible, onLayout };
}
