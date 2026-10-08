import { withSessionToken } from "./auth/session";

/**
 * El enlace al formulario del modulo de incidencias, con el contexto puesto.
 *
 * Lo que se manda en la direccion es lo que la persona no sabria decir bien:
 * en que aplicacion estaba y en que pantalla. El modulo rellena el resto
 * (quien es, por la sesion; navegador y tamano de ventana).
 *
 * La pantalla va SIN el fragmento (#...). Es donde las aplicaciones reciben el
 * token al llegar del portal, y un token no puede acabar guardado en una
 * incidencia ni en un correo. El token para entrar al modulo lo pone
 * `withSessionToken`, en el fragmento del enlace nuevo, como cualquier otro
 * salto entre aplicaciones.
 *
 * @param incidenciasUrl la direccion del modulo, sin barra final
 * @param appId          el id de la aplicacion en el catalogo del portal
 * @param appNombre      el nombre que se ve, por si el modulo no encuentra el id
 */
export function enlaceDeIncidencia(incidenciasUrl: string, appId?: string, appNombre?: string): string {
  const base = incidenciasUrl.replace(/\/+$/, "");
  const params = new URLSearchParams();
  if (appId) params.set("app", appId);
  if (appNombre) params.set("nombre", appNombre);
  if (typeof window !== "undefined") {
    params.set("pantalla", window.location.href.split("#")[0]);
  }
  return withSessionToken(`${base}/reportar?${params.toString()}`);
}
