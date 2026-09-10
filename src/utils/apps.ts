import type { PortalApp } from "../types/app";
import type { AuthenticatedUser } from "../types/auth";

/**
 * Las aplicaciones que se le pintan a esta persona.
 *
 * Es SOLO presentacion. Ocultar una tarjeta no impide entrar: cualquiera puede
 * escribir la URL. Cada aplicacion comprueba los roles del token por su cuenta,
 * que es donde la comprobacion significa algo.
 */
export function visibleApps(
  apps: readonly PortalApp[],
  user: AuthenticatedUser | null
): PortalApp[] {
  if (!user) return [];

  // Administracion lo ve todo: si no, quien administra tendria que asignarse a
  // si mismo el rol de cada aplicacion para poder mirarla.
  if (user.roles.includes("ROLE_ADMIN")) return [...apps];

  return apps.filter((app) => {
    // Sin roles asignados no lo ve nadie. Antes se enseñaba a todo el mundo, y
    // eso convertia "todavia no he dado permisos" en "lo ve la empresa
    // entera": exactamente lo contrario de lo que se espera de una lista de
    // permisos. Un modulo que deba ver todo el mundo lleva ROLE_USER, que es
    // el rol que tienen todas las cuentas.
    if (!app.roles || app.roles.length === 0) return false;
    return app.roles.some((role) => user.roles.includes(role));
  });
}

/**
 * El nombre que se muestra, sacado del correo.
 *
 * El token no lleva nombre de pila: su `sub` es el correo. Se saca la parte
 * antes de la arroba y se capitaliza, que da algo legible sin inventarse datos
 * ni pedirselos a otro servicio.
 */
export function displayName(user: AuthenticatedUser): string {
  const local = user.email.split("@")[0] ?? user.email;
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/**
 * Las iniciales de una persona, para el avatar.
 *
 * Del correo, que es lo unico que trae el token: `maria.gonzalez@` da "MG".
 * Con una sola palabra se cogen sus dos primeras letras, porque una inicial
 * suelta en un circulo se lee como un error.
 */
export function initials(user: AuthenticatedUser): string {
  const parts = displayName(user).split(" ").filter(Boolean);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return (parts[0] ?? user.email).slice(0, 2).toUpperCase();
}

/**
 * El nombre que se enseña de una persona.
 *
 * En auth_service_db, el `username` de muchas cuentas ES el correo: se dieron
 * de alta asi. Preferirlo sin mas hacia que el perfil enseñara
 * "thomas.augot@galagaagency.com" como titulo, con el mismo correo repetido
 * justo debajo. Solo se usa cuando aporta algo distinto; si no, se saca del
 * correo.
 */
export function preferredName(
  username: string | undefined,
  user: AuthenticatedUser
): string {
  const limpio = username?.trim();
  if (!limpio) return displayName(user);

  // Ni el correo entero, ni su parte de delante de la arroba: las dos serian
  // el mismo dato dos veces.
  const local = user.email.split("@")[0] ?? "";
  const esElCorreo =
    limpio.toLowerCase() === user.email.toLowerCase() ||
    limpio.toLowerCase() === local.toLowerCase();

  return esElCorreo ? displayName(user) : limpio;
}
