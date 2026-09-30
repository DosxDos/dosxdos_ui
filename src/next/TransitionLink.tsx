"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AnchorHTMLAttributes, ReactNode } from "react";

/**
 * El enlace que se usa en toda la aplicacion.
 *
 * Envuelve a `next/link` para que la navegacion interna sea del lado del
 * cliente: un `<a>` normal recarga la pagina entera, pierde la sesion en
 * memoria y hace parpadear la barra.
 *
 * Los enlaces externos —las aplicaciones del portal, que viven en otros
 * dominios— pasan como `<a>` de toda la vida, porque ahi si hay que salir.
 */
interface TransitionLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: ReactNode;
}

export function TransitionLink({
  href,
  children,
  onClick,
  ...rest
}: TransitionLinkProps) {
  const pathname = usePathname();

  const isExternal =
    href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");

  if (isExternal) {
    return (
      <a href={href} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  // Estando ya en esa pagina, se sube arriba en vez de navegar: pedirle al
  // router que vaya donde ya esta no hace nada y el enlace parece roto.
  const isSamePage = href.split(/[?#]/)[0] === pathname;

  if (isSamePage) {
    return (
      <a
        href={href}
        onClick={(event) => {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          onClick?.(event);
        }}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}
