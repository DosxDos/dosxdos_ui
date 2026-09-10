"use client";

import type { SerializedIcon } from "../types/icon";

/**
 * Pinta un icono venido de /api/icons.
 *
 * El SVG llega como cadena desde el servidor, asi que se inserta con
 * dangerouslySetInnerHTML. Es seguro aqui y solo aqui: el contenido no lo
 * escribe nadie, sale de serializar los paquetes de iconos instalados. Si algun
 * dia la fuente dejara de ser esos paquetes, esto necesitaria saneado.
 */
export function RemoteIcon({
  icon,
  className,
}: {
  icon: SerializedIcon;
  className?: string;
}) {
  return (
    <svg
      viewBox={icon.viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
}
