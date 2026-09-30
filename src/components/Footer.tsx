"use client";

import { LEGAL_LINKS } from "../constants/legal";
import { useLinkComponent } from "../contexts/LinkContext";
import { withSessionToken } from "../utils/auth/session";

interface Props {
  /**
   * Donde viven las paginas legales. Sin ella, son paginas de ESTA aplicacion
   * (`/aviso-legal`). Con ella —la direccion del portal—, los enlaces llevan
   * alli, con el token para no volver a pedir la contraseña. Es lo que hacen
   * las aplicaciones que no tienen sus propias paginas legales.
   */
  legalBaseUrl?: string;
}

/** El pie de todas las aplicaciones: la firma y los enlaces legales. */
export function Footer({ legalBaseUrl }: Props = {}) {
  const Link = useLinkComponent();
  const base = legalBaseUrl?.replace(/\/+$/, "");
  return (
    <footer className="py-6" aria-label="Pie">
      <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 md:px-10 lg:px-16">
        <p className="text-body text-primary/40">Dos por Dos Grupo Imagen</p>

        <nav className="flex flex-wrap gap-6" aria-label="Enlaces legales">
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={base ? withSessionToken(`${base}${link.href}`) : link.href}
              className="text-body text-primary hover:underline keyboard-focus-ring"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
