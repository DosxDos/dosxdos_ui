"use client";

import type { ReactNode } from "react";
import { TransitionLink } from "./TransitionLink";

/**
 * El enlace al perfil, que no siempre es del mismo tipo.
 *
 * Desde el PORTAL el perfil es una ruta suya (`/perfil`) y se navega por dentro
 * con `TransitionLink`. Desde cualquier OTRO modulo es una URL absoluta al
 * portal con el token en el fragmento, y eso es una salida a otro origen: tiene
 * que ser un `<a>` de toda la vida, porque el router de Next no sale del sitio.
 *
 * Se decide por la forma del href en vez de con otra prop: quien monta el menu
 * ya tiene que construir la URL correcta, y pedirle ademas que diga de que tipo
 * es seria pedirle dos veces lo mismo.
 */
export function EnlacePerfil({
  href,
  onClick,
  className,
  children,
}: {
  href: string;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}) {
  const esInterno = href.startsWith("/");

  if (esInterno) {
    return (
      <TransitionLink href={href} onClick={onClick} className={className}>
        {children}
      </TransitionLink>
    );
  }

  return (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  );
}
