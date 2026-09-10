/** What the browser sends to our own login route. */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * The claims auth-service puts in the JWT.
 *
 * Confirmed against auth-starter's JwtService.generateToken.
 */
export interface JwtPayload {
  /** The user's email. NOT unique in auth_service_db — never key on it. */
  sub: string;
  roles: string[];
  /**
   * The user's id in auth_service_db, and the only stable identifier here.
   *
   * Optional because tokens issued before the claim was added are still valid
   * until they expire.
   */
  uid?: number;
  /** Expiry, in SECONDS since the epoch — not milliseconds. */
  exp: number;
  iat?: number;
}

/** A signed-in user, as far as this module is concerned. */
export interface AuthenticatedUser {
  email: string;
  roles: string[];
  userId: number | null;
  expiresAt: Date;
}

/** What our login route returns to the browser. */
export interface LoginResult {
  token: string;
}

/**
 * An error shaped for a human.
 *
 * `code` is for us, `message` is what the user reads. Upstream error bodies
 * are never passed through: they leak internals and are written for developers.
 */
export interface AuthError {
  code: AuthErrorCode;
  message: string;
}

export type AuthErrorCode =
  | "credenciales_invalidas"
  | "cuenta_deshabilitada"
  | "servicio_no_disponible"
  | "token_invalido"
  | "token_caducado"
  | "demasiados_intentos"
  | "error_inesperado";
