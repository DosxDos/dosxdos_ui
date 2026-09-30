/** "martes, 29 de septiembre de 2026": la fecha de la cabecera. */
export function todayLabel(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);
}
