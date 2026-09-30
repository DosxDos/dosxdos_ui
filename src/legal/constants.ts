/**
 * Datos de la empresa que aparecen en las paginas legales.
 *
 * En un solo sitio para que el aviso legal y la politica de privacidad no
 * acaben diciendo cosas distintas.
 *
 * NOTA: falta el CIF y el domicilio social. No se inventan. El aviso legal del
 * reloj laboral tampoco los incluye, asi que hay que pedirselos a la empresa y
 * añadirlos aqui.
 */
export const LEGAL_COMPANY = {
  name: "DOS POR DOS GRUPO IMAGEN",
  activity: "Comunicación visual, imagen corporativa y montaje",
  email: "soporte@galagaagency.com",
} as const;

/** Fecha de la ultima revision de los textos legales. */
export const LEGAL_UPDATED_AT = "2 de septiembre de 2026";
