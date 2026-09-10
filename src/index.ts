/**
 * Lo que el paquete ofrece a los modulos.
 *
 * Es la UNICA puerta: los modulos importan de "@dosxdos/ui" y nunca de una ruta
 * de dentro. Asi se puede mover un fichero aqui sin romper a nadie.
 */

// La cabecera compartida
export { AppsMenu } from "./components/AppsMenu";
export { UserMenu } from "./components/UserMenu";
export { Footer } from "./components/Footer";

// Piezas sueltas que los modulos tambien usan
export { ModuleIcon } from "./components/ModuleIcon";
export { RemoteIcon } from "./components/RemoteIcon";
export { TransitionLink } from "./components/TransitionLink";
export * from "./components/Icons";

// La sesion y el catalogo
export { SessionProvider } from "./contexts/SessionContext";
export { ModulesProvider } from "./contexts/ModulesContext";
export { useSession } from "./hooks/useSession";
export { useModules } from "./hooks/useModules";

// El token
export {
  consumeTokenFromUrl,
  storeToken,
  readToken,
  clearToken,
  currentUser,
  withSessionToken,
} from "./utils/auth/session";
export { decodeToken, toAuthenticatedUser, isExpired } from "./utils/auth/jwt";

// Ayudas de presentacion
export { visibleApps, displayName, initials } from "./utils/apps";
export {
  groupByCategory,
  shouldLabelGroups,
  conFavoritosDelante,
  FAVOURITES_KEY,
} from "./utils/categories";
export type { AppGroup } from "./utils/categories";
export { LEGAL_LINKS } from "./constants/legal";
export {
  DEFAULT_CATEGORY,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
} from "./constants/categories";

// Tipos
export type { PortalApp } from "./types/app";
export type { AuthenticatedUser, JwtPayload } from "./types/auth";
