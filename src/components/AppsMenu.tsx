"use client";

import { useEffect, useRef, useState } from "react";
import { visibleApps } from "../utils/apps";
import { groupByCategory, shouldLabelGroups } from "../utils/categories";
import { useSession } from "../hooks/useSession";
import { useModules } from "../hooks/useModules";
import { IconClose, IconMenu } from "./Icons";
import { ModuleIcon } from "./ModuleIcon";
import { TransitionLink } from "./TransitionLink";
import { withSessionToken } from "../utils/auth/session";

/**
 * El menu de aplicaciones que abre la hamburguesa de la barra.
 *
 * Panel ancho por debajo de la barra, con las aplicaciones en rejilla: icono en
 * un cuadro redondeado y el nombre al lado. Es el mismo menu que llevaran los
 * demas micro servicios, para que saltar de uno a otro sea siempre igual.
 *
 * Se cierra al pulsar fuera, con Escape, y al elegir una aplicacion. Sin lo
 * primero se queda abierto tapando la pagina; sin Escape no hay forma de
 * cerrarlo con el teclado.
 */
export function AppsMenu() {
  const { user } = useSession();
  const { modules } = useModules();
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
      // El foco vuelve al boton: si se queda dentro de un panel que ya no
      // existe, quien navega con teclado se pierde.
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

  const groups = groupByCategory(visibleApps(modules, user));
  const withLabels = shouldLabelGroups(groups);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="apps-menu"
        aria-label={isOpen ? "Cerrar el menú" : "Abrir el menú de aplicaciones"}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary transition-colors hover:bg-secondary/20 keyboard-focus-ring-inverse md:h-11 md:w-11"
      >
        {isOpen ? (
          <IconClose className="h-5 w-5" />
        ) : (
          <IconMenu className="h-5 w-5" />
        )}
      </button>

      {isOpen && (
        <div
          id="apps-menu"
          // En movil se ancla a la pantalla por DEBAJO de la barra, con una
          // medida fija: `top-[calc(100%+…)]` sobre un elemento `fixed` mide
          // contra el alto de la ventana, no contra el boton, asi que el panel
          // caia fuera de la pantalla y parecia que no se abria.
          className="fixed inset-x-4 top-[4.75rem] z-dropdown max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-primary/10 bg-white p-4 shadow-xl md:absolute md:inset-x-auto md:right-0 md:top-[calc(100%+1rem)] md:max-h-none md:w-[min(90vw,56rem)] md:p-6"
          data-lenis-prevent
        >
          <div className="flex flex-col gap-5">
            {groups.map((group) => (
              <section key={group.key} aria-labelledby={`menu-${group.key}`}>
                <h3
                  id={`menu-${group.key}`}
                  className={
                    withLabels
                      ? "px-3 pb-2 text-label text-primary/50"
                      : "sr-only"
                  }
                >
                  {group.label}
                </h3>

                <ul className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {group.apps.map((app) => {
                    // Un modulo que todavia no existe se pinta apagado y sin
                    // enlace, igual que en el portal. Aqui era un enlace normal
                    // y llevaba a un dominio que no responde.
                    if (app.comingSoon) {
                      return (
                        <li key={app.id}>
                          <div
                            className="flex items-center gap-4 rounded-xl p-3 opacity-45"
                            aria-label={`${app.name}, próximamente`}
                          >
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/5">
                              <ModuleIcon app={app} className="h-5 w-5 text-primary" />
                            </span>
                            {/* "Pronto" DEBAJO del nombre, no al final de la
                                fila: alineado a la derecha caia en el hueco
                                entre columnas de la rejilla y se leia como un
                                modulo mas, no como una etiqueta de Logistica. */}
                            <span className="flex min-w-0 flex-col">
                              <span className="truncate text-body font-medium text-primary">
                                {app.name}
                              </span>
                              <span className="text-body text-primary/50">
                                Próximamente
                              </span>
                            </span>
                          </div>
                        </li>
                      );
                    }

                    return (
                      <li key={app.id}>
                        <TransitionLink
                          href={withSessionToken(app.url)}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-primary/5 keyboard-focus-ring"
                        >
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/5">
                            <ModuleIcon app={app} className="h-5 w-5 text-primary" />
                          </span>
                          <span className="min-w-0 truncate text-body font-medium text-primary">
                            {app.name}
                          </span>
                        </TransitionLink>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
