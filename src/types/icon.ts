/** Un icono resuelto por /api/icons: su clave y el SVG ya listo. */
export interface SerializedIcon {
  key: string;
  /** Lo que va DENTRO del <svg>. */
  body: string;
  viewBox: string;
}
