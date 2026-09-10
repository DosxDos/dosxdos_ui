"use client";

import { LEGAL_LINKS } from "../constants/legal";
import { TransitionLink } from "./TransitionLink";

/** El pie del portal: la firma y los enlaces legales. */
export function Footer() {
  return (
    <footer className="border-t border-primary/10 py-6" aria-label="Pie">
      <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 md:px-10 lg:px-16">
        <p className="text-body text-primary/40">Dos por Dos Grupo Imagen</p>

        <nav className="flex flex-wrap gap-6" aria-label="Enlaces legales">
          {LEGAL_LINKS.map((link) => (
            <TransitionLink
              key={link.href}
              href={link.href}
              className="text-body text-primary hover:underline keyboard-focus-ring"
            >
              {link.label}
            </TransitionLink>
          ))}
        </nav>
      </div>
    </footer>
  );
}
