import type { AuthenticatedUser, JwtPayload } from "../../types/auth";

/**
 * Reads the claims out of a JWT without verifying its signature.
 *
 * Verification is deliberately absent, not forgotten. Checking a signature in
 * the browser proves nothing: the code doing the checking is the code an
 * attacker controls. The signature is verified by every service that receives
 * the token, using the shared secret, which is the only place it means
 * anything.
 *
 * So this is for display only — greeting someone by name, showing an admin
 * link. Nothing here may be the basis of an authorization decision.
 *
 * Returns null on anything malformed rather than throwing: a bad token is an
 * expected condition, not an exceptional one.
 */
export function decodeToken(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payload.padEnd(
      payload.length + ((4 - (payload.length % 4)) % 4),
      "="
    );

    // decodeURIComponent/escape round-trip: atob yields Latin-1, so a name with
    // an accent in it comes back mangled without this.
    const json = decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );

    const parsed: unknown = JSON.parse(json);
    if (!isJwtPayload(parsed)) return null;

    return parsed;
  } catch {
    return null;
  }
}

function isJwtPayload(value: unknown): value is JwtPayload {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.sub === "string" &&
    typeof candidate.exp === "number" &&
    (candidate.roles === undefined || Array.isArray(candidate.roles))
  );
}

/** Turns a token into the user it describes, or null if it cannot. */
export function toAuthenticatedUser(token: string): AuthenticatedUser | null {
  const payload = decodeToken(token);
  if (!payload) return null;

  return {
    email: payload.sub,
    roles: payload.roles ?? [],
    userId: typeof payload.uid === "number" ? payload.uid : null,
    // exp is in seconds; Date wants milliseconds.
    expiresAt: new Date(payload.exp * 1000),
  };
}

/**
 * Whether a token has expired, judged by the browser's clock.
 *
 * Only ever used to decide whether to bother making a request. The real
 * decision belongs to the service validating the signature — a client clock
 * can be wrong, or set deliberately.
 */
export function isExpired(payload: JwtPayload, now: Date = new Date()): boolean {
  return payload.exp * 1000 <= now.getTime();
}
