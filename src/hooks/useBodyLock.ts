"use client";

import { useEffect } from "react";

/** Bloquea el desplazamiento de la pagina mientras `locked`: para una hoja a pantalla completa. */
export function useBodyLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [locked]);
}
