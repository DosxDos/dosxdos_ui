"use client";

import type { ReactNode } from "react";
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
   * Contenido opcional para el centro de la fila (p. ej. el credito de una
   * colaboracion). Desde `xl` va en una columna central —firma a la izquierda,
   * centro, legal a la derecha—; por debajo, en su propia linea al final.
   * Sin el, el pie es exactamente el de siempre.
   */
  center?: ReactNode;
}

/**
 * El pie de todas las aplicaciones: una sola fila, tan ancha como las
 * secciones de la pagina (1400px centrados, como ellas), no como la barra. La
 * marca pequeña y la firma a la izquierda, los enlaces legales a la derecha
 * con un subrayado que entra al pasar.
 */
export function Footer({ legalBaseUrl, center }: Props = {}) {
  const Link = useLinkComponent();
  const base = legalBaseUrl?.replace(/\/+$/, "");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto px-5 py-8 md:px-10 lg:px-16" aria-label="Pie">
      {/* Con centro, rejilla de tres desde xl: los laterales a 1fr dejan el
          centro centrado de verdad, midan lo que midan firma y enlaces. Por
          debajo de xl no hay aire para tres (a 1024px quedaban 22px entre
          textos) y el centro baja a su propia linea. */}
      <div
        className={
          "mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-x-8 gap-y-4" +
          (center ? " xl:grid xl:grid-cols-[1fr_auto_1fr]" : "")
        }
      >
        <p className="flex items-center gap-3 text-body text-primary/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/img/logos/logo-berengena.png" alt="" aria-hidden="true" className="h-6 w-auto opacity-70" />
          <span>© {year} Dos por Dos Grupo Imagen</span>
        </p>

        {center && <div className="order-last w-full xl:order-none xl:w-auto">{center}</div>}

        <nav
          className={"flex flex-wrap gap-x-7 gap-y-2" + (center ? " xl:justify-self-end" : "")}
          aria-label="Enlaces legales"
        >
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
    </footer>
  );
}
