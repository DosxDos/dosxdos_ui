"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Cuanto dura la salida de un panel: lo mismo que la animacion de `styles.css`. */
const EXIT_MS = 180;

/**
 * Un panel que se abre y se cierra CON animacion de salida.
 *
 * React desmonta al instante, y un menu que desaparece de golpe se lee barato.
 * Aqui `isMounted` se queda `true` mientras el panel se va (`isClosing`), y
 * solo despues se desmonta. Cierra al pulsar fuera y con Escape, devolviendo
 * el foco al boton que lo abrio.
 */
export function usePanel<T extends HTMLElement, B extends HTMLElement>() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<T>(null);
  const triggerRef = useRef<B>(null);
  const timer = useRef<number | null>(null);

  const open = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    setIsMounted(true);
    setIsOpen(true);
  }, []);

  const close = useCallback(
    (returnFocus = false) => {
      setIsOpen(false);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setIsMounted(false), EXIT_MS);
      if (returnFocus) triggerRef.current?.focus();
    },
    []
  );

  const toggle = useCallback(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, open, close]);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };

    // En el frame siguiente: en una pantalla tactil el `pointerdown` del MISMO
    // toque que abre el menu llegaria despues de montar esto y lo cerraria.
    const hook = requestAnimationFrame(() => document.addEventListener("pointerdown", onPointerDown));
    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(hook);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  return { isOpen, isMounted, isClosing: isMounted && !isOpen, open, close, toggle, containerRef, triggerRef };
}
