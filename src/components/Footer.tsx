"use client";

import type { ReactNode } from "react";
import { GALAGA_MARK, GALAGA_URL } from "../constants/galaga";
import { LEGAL_LINKS } from "../constants/legal";
import { useLinkComponent } from "../contexts/LinkContext";
import { withSessionToken } from "../utils/auth/session";

interface Props {
  /**
   * Donde viven las paginas legales. Sin ella, son paginas de ESTA aplicacion
   * (`/aviso-legal`). Con ella —la direccion del portal—, los enlaces llevan
   * alli, con el token para no volver a pedir la contraseña.
   */
  legalBaseUrl?: string;
  /**
   * El bloque de la derecha. Por defecto, el credito de Galaga Agency; con
   * esta prop se sustituye.
   */
  center?: ReactNode;
}

/**
 * El pie de todas las aplicaciones. Claro, sobre el fondo de la pagina: la
 * cabecera ya es la masa oscura, y un segundo bloque berenjena abajo pesaba
 * demasiado. A la izquierda la firma y los enlaces legales (la marca completa ya
 * esta en la cabecera); a la derecha el credito de quien la hizo, con la G de
 * Galaga pequeña a su lado. Como marca de agua, grande y detras, se rechazo:
 * cortada parecia salirse de la pantalla, y entera pesaba demasiado.
 * Separado de la pagina por aire, sin lineas.
 *
 * Contenido alineado a 1400px centrados, como las secciones de la pagina.
 */
export function Footer({
  legalBaseUrl,
  center = (
    <a
      href={GALAGA_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="dxd-credit flex items-center gap-4 self-start rounded-md keyboard-focus-ring md:self-auto"
    >
      <svg aria-hidden="true" viewBox={GALAGA_MARK.viewBox} className="dxd-credit-mark h-[2.65rem] w-auto shrink-0 fill-current text-primary/35">
        <g transform={GALAGA_MARK.transform}>
          <path d={GALAGA_MARK.d} />
        </g>
      </svg>
      <span className="flex flex-col">
        <span className="text-body text-primary/40">Desarrollado por</span>
        <span className="dxd-credit-mark title-section uppercase tracking-[0.16em] text-primary/45">Galaga Agency</span>
      </span>
    </a>
  ),
}: Props = {}) {
  const Link = useLinkComponent();
  const base = legalBaseUrl?.replace(/\/+$/, "");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto px-5 pb-10 pt-16 md:px-8 lg:px-16 lg:pb-12 lg:pt-20" aria-label="Pie">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-12 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-8">
          <p className="text-body text-primary/55">© {year} Dos por Dos Grupo Imagen</p>
          <nav className="flex flex-wrap items-baseline gap-x-6 gap-y-2" aria-label="Enlaces legales">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={base ? withSessionToken(`${base}${link.href}`) : link.href}
                className="dxd-footer-link text-body text-primary/75 keyboard-focus-ring"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {center}
      </div>
    </footer>
  );
}
