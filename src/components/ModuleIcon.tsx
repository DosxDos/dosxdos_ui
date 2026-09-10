"use client";

import type { PortalApp } from "../types/app";
import { RemoteIcon } from "./RemoteIcon";
import { IconGrid } from "./Icons";

/**
 * El icono de un modulo.
 *
 * El SVG viene resuelto del servidor dentro del propio modulo. Si falta —clave
 * borrada del paquete, o un modulo llegado por otra via— cae en la rejilla
 * generica en vez de dejar un hueco.
 */
export function ModuleIcon({
  app,
  className,
}: {
  app: PortalApp;
  className?: string;
}) {
  if (app.iconSvg) return <RemoteIcon icon={app.iconSvg} className={className} />;
  return <IconGrid className={className} />;
}
