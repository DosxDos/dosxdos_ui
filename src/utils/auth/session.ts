"use client";

import type { AuthenticatedUser } from "../../types/auth";
import { toAuthenticatedUser, decodeToken, isExpired } from "./jwt";

/**
 * Donde vive el token en el navegador.
 *
 * localStorage y no sessionStorage: con sessionStorage la sesion moria al
 * cerrar la pestaña, y habia que volver a escribir la contraseña varias veces
 * al dia —cerrar una pestaña no es cerrar sesion, y tratarlo como si lo fuera
 * solo enseña a la gente a teclear su contraseña sin pensar—.
 *
 * El token caduca a las 24 h por su cuenta, y `currentUser()` descarta el
 * caducado en cuanto lo lee. Para salir de verdad esta el boton de cerrar
 * sesion, que llama a `clearToken()`.
 */
const STORAGE_KEY = "dxd_token";

/**
 * Lee el token que trae el fragmento de la URL y lo guarda.
 *
 * El modulo de acceso lo entrega en el fragmento (`#token=`) justamente porque
 * no se envia al servidor: no aparece en los logs ni en la cabecera Referer.
 * Esa ventaja se pierde si se queda en la barra de direcciones, asi que se
 * limpia en cuanto se lee — con replaceState, para no dejar una entrada en el
 * historial que devuelva a una URL con el token dentro.
 *
 * @returns el token si venia en la URL
 */
export function consumeTokenFromUrl(): string | null {
  if (typeof window === "undefined") return null;

  const hash = window.location.hash;
  if (!hash.startsWith("#token=")) return null;

  const token = decodeURIComponent(hash.slice("#token=".length));
  if (!token) return null;

  storeToken(token);
  window.history.replaceState(null, "", window.location.pathname + window.location.search);

  return token;
}

export function storeToken(token: string): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, token);
  } catch {
    // La navegacion privada puede rechazar la escritura. Se sigue: el token
    // vive en memoria durante esta carga y la persona puede trabajar.
  }
}

export function readToken(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearToken(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // nada que hacer
  }
}

/**
 * El usuario de la sesion actual, o null si no hay ninguna utilizable.
 *
 * Un token caducado se descarta aqui mismo: dejarlo guardado solo sirve para
 * que cada peticion falle con un 401 sin que nadie entienda por que.
 *
 * Esto NO es una comprobacion de seguridad. La firma se valida en cada servicio
 * que recibe el token, que es donde significa algo; aqui solo se decide si
 * merece la pena pintar la pantalla o mandar a la persona a iniciar sesion.
 */
export function currentUser(): AuthenticatedUser | null {
  const token = readToken();
  if (!token) return null;

  const payload = decodeToken(token);
  if (!payload || isExpired(payload)) {
    clearToken();
    return null;
  }

  return toAuthenticatedUser(token);
}

/**
 * Añade el token a la URL de una aplicacion, en el fragmento.
 *
 * Es el mismo trato que usa el modulo de acceso para entregarnoslo a nosotros:
 * el fragmento no se envia al servidor, asi que no aparece en los logs ni en la
 * cabecera Referer. La aplicacion que lo recibe lo canjea por su propia sesion
 * y limpia la URL.
 */
export function withSessionToken(url: string): string {
  // Una ruta del propio portal no necesita token: la sesion ya esta aqui.
  // Ademas `new URL` la rechazaria por no ser absoluta.
  if (url.startsWith("/")) return url;

  const token = readToken();
  if (!token) return url;

  try {
    const target = new URL(url);
    target.hash = `token=${encodeURIComponent(token)}`;
    return target.toString();
  } catch {
    // URL mal formada: mejor mandar a la persona sin sesion que no mandarla.
    return url;
  }
}
