"use client";

import { useContext } from "react";
import { ModulesContext, type ModulesState } from "../contexts/ModulesContext";

/**
 * Los modulos del portal.
 *
 * Los sirve ModulesProvider, que hace UNA sola peticion para toda la pantalla.
 * Cuando cada componente llamaba a su propio `fetch`, una carga del portal
 * disparaba tres viajes identicos y tres repintados escalonados.
 *
 * Es la UNICA forma de obtenerlos. No hay lista de respaldo escrita en el
 * codigo: una segunda copia se desincroniza el dia en que alguien añade un
 * modulo desde el panel.
 */
export function useModules(): ModulesState {
  const state = useContext(ModulesContext);

  if (!state) {
    throw new Error("useModules necesita estar dentro de ModulesProvider");
  }

  return state;
}

export type { ModulesState };
