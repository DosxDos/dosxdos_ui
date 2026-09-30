"use client";

import { memo } from "react";

import { AppsMenu } from "./AppsMenu";
import { UserMenu } from "./UserMenu";
import { IconBack } from "./Icons";
import { useSession } from "../hooks/useSession";
import { withSessionToken } from "../utils/auth/session";
import { todayLabel } from "../utils/fecha";

interface Props {
  /** "Portal", "Logística"…: el nombre de la aplicacion, junto al logotipo. */
  appName: string;
  /** A donde lleva "Mi perfil". Ya con el token si es otro origen. */
  perfilHref: string;
  /**
   * La direccion del portal, para las aplicaciones que NO son el portal: el
   * logotipo lleva alli y aparece el boton "Portal". En el propio portal se
   * omite.
   */
  portalUrl?: string;
}

/**
 * La barra superior de todas las aplicaciones de Dos por Dos.
 *
 * Fondo berenjena, borde inferior en hielo, fija arriba: quien pasa de una
 * aplicacion a otra tiene que reconocer la misma casa. A la izquierda el
 * logotipo, el nombre de la aplicacion y la fecha; a la derecha el menu de
 * aplicaciones y la cuenta.
 *
 * Antes cada aplicacion tenia su copia y ya se habian separado: el portal con
 * borde y logistica sin el, etiquetas distintas para el lector de pantalla.
 *
 * Los logotipos se leen de /assets/img/logos/ de cada aplicacion.
 */
function AppHeaderBase({ appName, perfilHref, portalUrl }: Props) {
  const { user } = useSession();
  if (!user) return null;

  // Dos archivos, no uno escalado: en movil va la marca sola y a partir de
  // tablet el logotipo completo, que reducido a la altura de una barra de
  // movil deja "GRUPOIMAGEN" ilegible.
  const logo = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/img/logos/logo-gris.png" alt="Dos por Dos grupo Imagen" className="h-9 shrink-0 md:hidden" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/img/logos/logo_full_gris.svg"
        alt="Dos por Dos grupo Imagen"
        className="hidden shrink-0 md:block md:h-10 lg:h-16"
      />
    </>
  );

  // Con el token: la sesion se guarda por origen, y sin el el portal no
  // tendria ninguna y mandaria al modulo de acceso a pedir la contraseña.
  const portal = portalUrl ? withSessionToken(portalUrl) : null;

  return (
    <header className="sticky top-0 z-drawer border-b border-hielo/30 bg-primary" aria-label={`Cabecera de ${appName}`}>
      <div className="px-5 py-3.5 md:px-8 md:py-5 lg:px-16 lg:py-7">
        <div className="flex items-center justify-between gap-3 md:gap-4">
          <div className="flex min-w-0 items-center gap-3 md:gap-4 lg:gap-6">
            {portal ? (
              // Un <a> y no TransitionLink: el portal es OTRO origen y el router
              // de Next no sale de este.
              <a
                href={portal}
                aria-label="Volver al portal"
                className="flex shrink-0 items-center rounded-md transition-opacity duration-200 hover:opacity-75 keyboard-focus-ring"
              >
                {logo}
              </a>
            ) : (
              logo
            )}

            {/* En movil se queda solo el logotipo: el nombre y la fecha no caben
                junto a la pastilla. No es un h1: la barra sale en todas las
                paginas y el h1 es el titulo de cada una. */}
            <div className="hidden min-w-0 md:block">
              <p className="title-section truncate text-secondary">{appName}</p>
              <p className="mt-1 text-body font-medium text-secondary">{todayLabel()}</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 md:gap-3 lg:gap-6">
            {/* El logotipo tambien vuelve al portal, pero hay que saberlo. Esto
                lo dice. En movil no cabe, y para eso esta el menu. */}
            {portal && (
              <a
                href={portal}
                className="hidden shrink-0 items-center gap-2 rounded-full border border-secondary/20 py-2 pl-3 pr-4 text-body font-medium text-secondary transition-colors duration-200 hover:border-secondary/40 hover:bg-secondary/10 keyboard-focus-ring md:inline-flex"
              >
                <IconBack className="h-4 w-4 shrink-0" />
                Portal
              </a>
            )}
            <AppsMenu />
            <UserMenu perfilHref={perfilHref} />
          </div>
        </div>
      </div>
    </header>
  );
}

/** Memoizado: con las mismas props no se vuelve a pintar cuando lo hace la pagina. */
export const AppHeader = memo(AppHeaderBase);
