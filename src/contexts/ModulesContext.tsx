"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import type { PortalApp } from "../types/app";

/** Los modulos, tal y como estan ahora mismo en la base de datos. */
export interface ModulesState {
  modules: readonly PortalApp[];
  isLoading: boolean;
  /** La consulta fallo. Distinto de "no hay ninguno". */
  hasFailed: boolean;
}

export const ModulesContext = createContext<ModulesState | null>(null);

/**
 * El catalogo, pedido UNA vez para toda la pantalla.
 *
 * Antes cada componente que lo necesitaba —el menu de aplicaciones, la lista y
 * la tarjeta de fichaje— llamaba al hook por su cuenta, y cada llamada hacia su
 * propia peticion: tres viajes identicos por carga, con tres estados separados
 * que se resolvian en momentos distintos y repintaban el arbol uno detras de
 * otro. Aqui se pide una vez y se reparte.
 *
 * Se distingue "cargando" de "vacio" a proposito: sin esa diferencia la pantalla
 * enseña "no tienes aplicaciones" durante el primer instante de cada visita, y
 * eso se lee como que se han perdido los permisos.
 */
export function ModulesProvider({
  children,
  fetchModules,
}: {
  children: ReactNode;
  /**
   * Como pide esta aplicacion el catalogo.
   *
   * Cada modulo lo pide a SU PROPIO origen —`/api/modules`— y el route handler
   * se lo pide por dentro al portal: asi no hay que abrir CORS ni redesplegar
   * el portal cada vez que nace un modulo. Por eso la funcion la pone quien
   * usa el proveedor y no viaja en el paquete.
   */
  fetchModules: () => Promise<readonly PortalApp[]>;
}) {
  const [state, setState] = useState<ModulesState>({
    modules: [],
    isLoading: true,
    hasFailed: false,
  });

  useEffect(() => {
    let cancelado = false;

    fetchModules()
      .then((modules) => {
        if (!cancelado) setState({ modules, isLoading: false, hasFailed: false });
      })
      .catch(() => {
        if (!cancelado) {
          setState({ modules: [], isLoading: false, hasFailed: true });
        }
      });

    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <ModulesContext.Provider value={state}>{children}</ModulesContext.Provider>
  );
}
