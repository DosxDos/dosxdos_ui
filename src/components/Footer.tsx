"use client";

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
}

/**
 * El pie de todas las aplicaciones: una sola fila, tan ancha como las
 * secciones de la pagina (1400px centrados, como ellas), no como la barra. La
 * marca pequeña y la firma a la izquierda, los enlaces legales a la derecha
 * con un subrayado que entra al pasar.
 */
export function Footer({ legalBaseUrl }: Props = {}) {
  const Link = useLinkComponent();
  const base = legalBaseUrl?.replace(/\/+$/, "");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto px-5 py-8 md:px-10 lg:px-16" aria-label="Pie">
      <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <p className="flex items-center gap-3 text-body text-primary/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/img/logos/logo-berengena.png" alt="" aria-hidden="true" className="h-6 w-auto opacity-70" />
          <span>© {year} Dos por Dos Grupo Imagen</span>
        </p>

        <nav className="flex flex-wrap gap-x-7 gap-y-2" aria-label="Enlaces legales">
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
