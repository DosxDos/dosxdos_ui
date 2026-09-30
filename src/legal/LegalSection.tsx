"use client";

import type { ReactNode } from "react";

/** Una tarjeta con un apartado del texto legal. */
export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      className="rounded-2xl border border-primary/10 bg-white/95 p-6 shadow-lg backdrop-blur-sm md:p-8"
      aria-label={title}
    >
      <h2 className="title-section text-primary">{title}</h2>
      <div className="flex flex-col gap-4 pt-4 text-body text-primary/70">
        {children}
      </div>
    </section>
  );
}
