/**
 * Las secciones en las que se agrupan los modulos.
 *
 * Aqui solo esta el TITULO y el ORDEN de las conocidas. Que categoria tiene
 * cada modulo lo dice la tabla, no este archivo: si una categoria viviera aqui
 * como lista cerrada, añadir una obligaria a desplegar, que es justo lo que se
 * quito al mover los modulos a la base de datos.
 *
 * Una categoria que aparezca en la tabla y no este aqui se pinta igual, con su
 * propia clave como titulo y al final. Se degrada, no se rompe.
 */
export const DEFAULT_CATEGORY = "aplicaciones";

export const CATEGORY_LABELS: Readonly<Record<string, string>> = {
  aplicaciones: "Aplicaciones",
  administracion: "Administración",
};

/** El orden en que salen. Lo que no este listado va despues, alfabetico. */
export const CATEGORY_ORDER: readonly string[] = [
  "administracion",
  "aplicaciones",
];
