"use client";

import { LegalSection } from "./LegalSection";
import { LEGAL_COMPANY as COMPANY } from "./constants";

/**
 * El texto del aviso legal, igual en todas las aplicaciones.
 *
 * Solo el texto: el marco (la cabecera de la aplicacion, volver, el titulo)
 * lo pone cada aplicacion, porque cada una tiene el suyo y su router.
 */
export function AvisoLegalContent() {
  return (
    <>
    <LegalSection title="Identificación del responsable">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-primary/5 p-4">
          <p className="font-semibold text-primary">Denominación social</p>
          <p className="pt-1">{COMPANY.name}</p>
        </div>
        <div className="rounded-xl bg-primary/5 p-4">
          <p className="font-semibold text-primary">Actividad</p>
          <p className="pt-1">{COMPANY.activity}</p>
        </div>
        <div className="rounded-xl bg-primary/5 p-4">
          <p className="font-semibold text-primary">Correo de contacto</p>
          <p className="pt-1">{COMPANY.email}</p>
        </div>
        <div className="rounded-xl bg-primary/5 p-4">
          <p className="font-semibold text-primary">Servicio</p>
          <p className="pt-1">
            Portal de aplicaciones internas y acceso compartido
          </p>
        </div>
      </div>
    </LegalSection>

    <LegalSection title="Objeto">
      <p>
        Este portal reúne en un solo sitio las aplicaciones internas de{" "}
        {COMPANY.name} y permite entrar en todas ellas con un único inicio de
        sesión. Es una herramienta de uso interno: no está dirigida al público
        ni ofrece servicios a terceros.
      </p>
    </LegalSection>

    <LegalSection title="Condiciones de uso">
      <p>
        El acceso está reservado a las personas que forman parte de{" "}
        {COMPANY.name} y que disponen de una cuenta activa. Las credenciales
        son personales e intransferibles.
      </p>
      <ul className="flex flex-col gap-3">
        <li className="flex gap-3">
          <span className="pt-1 text-accent">•</span>
          <span>
            No compartas tu contraseña ni dejes la sesión abierta en un
            equipo compartido.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="pt-1 text-accent">•</span>
          <span>
            Usa cada aplicación para lo que está prevista y dentro de tus
            funciones.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="pt-1 text-accent">•</span>
          <span>
            Avisa a {COMPANY.email} si crees que alguien ha accedido a tu
            cuenta.
          </span>
        </li>
      </ul>
    </LegalSection>

    <LegalSection title="Propiedad intelectual">
      <p>
        El portal, las aplicaciones que reúne, su código, su diseño y la marca{" "}
        {COMPANY.name} pertenecen a la empresa. No se permite copiarlos,
        distribuirlos ni modificarlos sin autorización por escrito.
      </p>
    </LegalSection>

    <LegalSection title="Responsabilidad">
      <p>
        {COMPANY.name} procura que el servicio esté disponible y funcione
        correctamente, pero no puede garantizar que no se interrumpa nunca:
        una avería, un mantenimiento o un fallo ajeno pueden dejarlo fuera de
        servicio temporalmente.
      </p>
      <p>
        Cada aplicación tiene sus propias condiciones y su propia información
        legal. Este aviso cubre el portal y el acceso compartido.
      </p>
    </LegalSection>

    <LegalSection title="Legislación aplicable">
      <p>
        Este aviso se rige por la legislación española. Para cualquier
        controversia son competentes los juzgados y tribunales que
        correspondan conforme a la normativa vigente.
      </p>
    </LegalSection>
    </>
  );
}
