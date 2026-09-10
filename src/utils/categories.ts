import type { PortalApp } from "../types/app";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  DEFAULT_CATEGORY,
} from "../constants/categories";

/** La clave de la seccion de favoritos. No sale de la base de datos. */
export const FAVOURITES_KEY = "favoritos";

/** Un grupo de modulos, listo para pintar como seccion. */
export interface AppGroup {
  key: string;
  /** El titulo de la seccion. */
  label: string;
  apps: PortalApp[];
}

/** El titulo de una categoria; si no se conoce, su propia clave capitalizada. */
export function categoryLabel(key: string): string {
  const known = CATEGORY_LABELS[key];
  if (known) return known;
  return key.charAt(0).toUpperCase() + key.slice(1);
}

/**
 * Agrupa los modulos por categoria, en el orden en que deben salir.
 *
 * Las categorias conocidas van primero y en el orden de CATEGORY_ORDER; las
 * demas despues, alfabeticamente. Una categoria que no este listada se pinta
 * igual en vez de desaparecer: perder una tarjeta porque nadie añadio su
 * categoria a una constante es peor que enseñarla con un titulo mejorable.
 *
 * Un grupo vacio no se devuelve: solo se crean cubos para modulos que existen,
 * asi que una seccion con titulo y nada debajo no puede darse.
 */
export function groupByCategory(apps: readonly PortalApp[]): AppGroup[] {
  const byKey = new Map<string, PortalApp[]>();

  for (const app of apps) {
    const key = app.category || DEFAULT_CATEGORY;
    const bucket = byKey.get(key);
    if (bucket) bucket.push(app);
    else byKey.set(key, [app]);
  }

  const rank = (key: string) => {
    const index = CATEGORY_ORDER.indexOf(key);
    return index === -1 ? CATEGORY_ORDER.length : index;
  };

  return [...byKey.entries()]
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
    .map(([key, grouped]) => ({
      key,
      label: categoryLabel(key),
      apps: grouped,
    }));
}

/**
 * Si merece la pena pintar los titulos de seccion.
 *
 * Con un solo grupo no: el titulo no separa nada de nada, solo mete una linea
 * de texto entre el saludo y las tarjetas. Agrupar tiene sentido cuando hay al
 * menos dos cosas que distinguir.
 */
export function shouldLabelGroups(groups: readonly AppGroup[]): boolean {
  return groups.length > 1;
}

/**
 * Saca los favoritos a su propia seccion, la primera.
 *
 * Se MUEVEN, no se copian: un modulo que apareciera arriba en favoritos y otra
 * vez abajo en su seccion se leeria como un fallo, y obligaria a mirar dos
 * veces la misma lista.
 *
 * Sin favoritos marcados no se añade la seccion: un titulo con nada debajo
 * parece que algo se ha perdido.
 */
export function conFavoritosDelante(
  grupos: AppGroup[],
  favoritos: readonly string[]
): AppGroup[] {
  if (favoritos.length === 0) return grupos;

  const marcados = new Set(favoritos);
  const arriba: PortalApp[] = [];

  const resto = grupos
    .map((grupo) => {
      const quedan = grupo.apps.filter((app) => {
        if (!marcados.has(app.id)) return true;
        arriba.push(app);
        return false;
      });
      return { ...grupo, apps: quedan };
    })
    // Una seccion que se queda sin nada desaparece.
    .filter((grupo) => grupo.apps.length > 0);

  if (arriba.length === 0) return grupos;

  return [
    { key: FAVOURITES_KEY, label: "Favoritos", apps: arriba },
    ...resto,
  ];
}
