"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "../hooks/useSession";
import { displayName, initials } from "../utils/apps";
import { IconChevronDown, IconLogout, IconUser } from "./Icons";
import { EnlacePerfil } from "./EnlacePerfil";

/**
 * La pastilla con quien ha entrado, a la derecha de la barra.
 *
 * Al pulsarla se abre un menu con el perfil y la salida. Antes el nombre estaba
 * suelto y el boton de salir al lado, ocupando sitio y dando la misma
 * importancia a leer tu correo que a cerrar la sesion.
 *
 * El avatar son las iniciales: el token solo trae el correo, no una foto. Una
 * silueta generica no dice nada; las iniciales al menos distinguen a una
 * persona de otra en un equipo compartido.
 *
 * Aqui va SOLO lo que es de la cuenta: el perfil y la salida. "Modulos" estuvo
 * un tiempo en esta lista, de cuando el administrador de modulos no era un
 * modulo todavia; ahora tiene su propia tarjeta en el portal y su entrada en el
 * menu de aplicaciones, asi que ponerlo tambien aqui era el tercer sitio para
 * lo mismo. Las aplicaciones van en el menu de aplicaciones.
 */
export function UserMenu({ perfilHref }: {
  /**
   * A donde lleva "Mi perfil".
   *
   * Lo pone quien usa el menu porque NO es igual en todas partes: en el portal
   * el perfil es una ruta suya (`/perfil`), y desde cualquier otro modulo tiene
   * que ser la URL absoluta del portal CON el token pegado —la sesion se guarda
   * por origen, asi que sin el rebotaria al modulo de acceso—.
   */
  perfilHref: string;
}) {
  const { user, signOut } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      // El foco vuelve a la pastilla: dejarlo en un menu que ya no existe
      // pierde a quien navega con teclado.
      triggerRef.current?.focus();
    };

    // Se engancha en el frame siguiente. En una pantalla tactil el
    // `pointerdown` del MISMO toque que abre el menu llega despues de que este
    // efecto se monte, ve el objetivo fuera del panel y lo cierra al instante:
    // el menu parecia no abrirse nunca.
    const enganchar = requestAnimationFrame(() => {
      document.addEventListener("pointerdown", onPointerDown);
    });
    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(enganchar);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  if (!user) return null;

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="user-menu"
        aria-label={`Menú de ${displayName(user)}`}
        // En movil es SOLO el circulo con las iniciales, sin pastilla
        // alrededor: el anillo blanco de 1px sobrando por todos lados se leia
        // como un fallo de maquetacion.
        className="flex items-center rounded-full text-primary transition-shadow duration-200 keyboard-focus-ring-inverse md:gap-2.5 md:bg-secondary md:py-1.5 md:pl-1.5 md:pr-3 md:shadow-md md:hover:shadow-lg"
      >
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-body font-bold text-primary md:h-9 md:w-9 md:bg-primary md:text-secondary"
        >
          {initials(user)}
        </span>
        {/* En movil solo el avatar: el nombre completo empujaba la pastilla
            fuera de la barra. */}
        <span className="hidden max-w-[160px] truncate text-body font-semibold md:block">
          {displayName(user)}
        </span>
        <IconChevronDown
          className={`mr-1 hidden h-4 w-4 shrink-0 text-primary/50 transition-transform duration-200 md:block ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          id="user-menu"
          className="absolute right-0 top-[calc(100%+0.75rem)] z-dropdown w-[min(16rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-xl"
        >
          <div className="border-b border-primary/10 p-4">
            <p className="truncate text-body font-semibold text-primary">
              {displayName(user)}
            </p>
            <p className="truncate text-body text-primary/60">{user.email}</p>
          </div>

          <div className="p-2">
            <EnlacePerfil
              href={perfilHref}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-body text-primary transition-colors hover:bg-primary/5 keyboard-focus-ring"
            >
              <IconUser className="h-4 w-4 shrink-0" />
              Mi perfil
            </EnlacePerfil>

            <button
              type="button"
              onClick={signOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-body text-primary transition-colors hover:bg-primary/5 keyboard-focus-ring"
            >
              <IconLogout className="h-4 w-4 shrink-0" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
