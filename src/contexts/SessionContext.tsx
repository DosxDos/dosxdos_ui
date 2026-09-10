"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { AuthenticatedUser } from "../types/auth";
import {
  clearToken,
  consumeTokenFromUrl,
  currentUser,
} from "../utils/auth/session";

interface SessionValue {
  user: AuthenticatedUser | null;
  /** Mientras se comprueba: ni hay sesion ni se sabe que no la hay. */
  isResolving: boolean;
  signOut: () => void;
}

export const SessionContext = createContext<SessionValue | null>(null);

/**
 * Resuelve quien esta usando el portal.
 *
 * El token llega en el fragmento de la URL tras iniciar sesion, o ya esta
 * guardado de antes. Si no hay ninguno utilizable, se manda a la persona al
 * modulo de acceso con `returnUrl` para que vuelva aqui al terminar.
 */
export function SessionProvider({
  children,
  siteUrl,
  authUrl,
}: {
  children: ReactNode;
  /** La base publica de ESTA aplicacion. Es a donde se vuelve tras entrar. */
  siteUrl: string;
  /** El modulo de acceso compartido. */
  authUrl: string;
}) {
  /**
   * `null` = todavia no se sabe. Ese es el estado con el que se pinta en el
   * servidor y con el que arranca el cliente, y por eso los dos coinciden.
   *
   * No se resuelve en el inicializador de useState: el servidor no tiene ni URL
   * ni localStorage, asi que devolveria "sin sesion" mientras el cliente
   * devuelve el usuario, y React se queja de que el HTML no cuadra.
   */
  const [session, setSession] = useState<{ user: AuthenticatedUser | null } | null>(null);

  useEffect(() => {
    // Primero el fragmento: si acaba de volver de iniciar sesion, ese token es
    // mas nuevo que el que pudiera haber guardado.
    consumeTokenFromUrl();

    const resolved = currentUser();

    // La sesion vive en la URL y en localStorage, que solo existen despues de
    // montar. Resolverla durante el render devuelve "sin sesion" en el servidor
    // y "con sesion" en el cliente: justo el desajuste de hidratacion que este
    // codigo evita. El render de mas es el precio, y es uno solo.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession({ user: resolved });

    if (!resolved) {
      // Sin sesion: al modulo de acceso. `replace` y no `assign` para que el
      // boton de atras no devuelva a una pantalla vacia en bucle.
      const returnUrl = encodeURIComponent(siteUrl);
      window.location.replace(`${authUrl}/?returnUrl=${returnUrl}`);
    }
  }, []);

  const user = session?.user ?? null;
  const isResolving = session === null;

  const signOut = useCallback(() => {
    clearToken();
    setSession({ user: null });
    window.location.replace(authUrl);
  }, []);

  const value = useMemo(
    () => ({ user, isResolving, signOut }),
    [user, isResolving, signOut]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
