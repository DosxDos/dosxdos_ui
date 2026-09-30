"use client";

import { LegalSection } from "./LegalSection";
import { LEGAL_COMPANY as COMPANY } from "./constants";

/**
 * El texto de la politica de privacidad, igual en todas las aplicaciones.
 *
 * Solo el texto: el marco (la cabecera de la aplicacion, volver, el titulo)
 * lo pone cada aplicacion, porque cada una tiene el suyo y su router.
 */
export function PoliticaPrivacidadContent() {
  return (
    <>
    <LegalSection title="Quién trata tus datos">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-primary/5 p-4">
          <p className="font-semibold text-primary">Responsable</p>
          <p className="pt-1">{COMPANY.name}</p>
        </div>
        <div className="rounded-xl bg-primary/5 p-4">
          <p className="font-semibold text-primary">Contacto</p>
          <p className="pt-1">{COMPANY.email}</p>
        </div>
      </div>
    </LegalSection>

    <LegalSection title="Qué datos se tratan aquí">
      <p>
        El portal solo necesita saber quién eres para dejarte pasar. En
        concreto:
      </p>
      <ul className="flex flex-col gap-3">
        <li className="flex gap-3">
          <span className="pt-1 text-accent">•</span>
          <span>
            <strong className="text-primary">Tu correo electrónico</strong>,
            que es con lo que inicias sesión.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="pt-1 text-accent">•</span>
          <span>
            <strong className="text-primary">Tus permisos</strong>, para saber
            qué aplicaciones mostrarte.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="pt-1 text-accent">•</span>
          <span>
            <strong className="text-primary">
              Un registro de los inicios de sesión
            </strong>
            , con la fecha y la dirección desde la que se hicieron, para poder
            detectar accesos que no reconozcas.
          </span>
        </li>
      </ul>
      <p>
        El portal <strong className="text-primary">no</strong> guarda tus
        fichajes, tus presupuestos ni ningún otro dato de trabajo. Eso lo trata
        cada aplicación por su cuenta, y cada una tiene su propia política.
      </p>
    </LegalSection>

    <LegalSection title="Para qué se usan">
      <p>
        Únicamente para darte acceso a las aplicaciones internas y para
        proteger esas cuentas frente a accesos no autorizados. No se usan para
        publicidad, no se elaboran perfiles y no se toman decisiones
        automatizadas sobre ti.
      </p>
    </LegalSection>

    <LegalSection title="Con qué base legal">
      <p>
        El tratamiento es necesario para la relación laboral y para el interés
        legítimo de {COMPANY.name} en mantener seguros sus sistemas internos,
        conforme al artículo 6.1 b) y f) del Reglamento General de Protección
        de Datos.
      </p>
    </LegalSection>

    <LegalSection title="Qué se guarda en tu navegador">
      <p>
        Al iniciar sesión se guarda tu credencial de acceso en el
        almacenamiento de sesión del navegador. Tiene dos consecuencias que
        conviene conocer:
      </p>
      <ul className="flex flex-col gap-3">
        <li className="flex gap-3">
          <span className="pt-1 text-accent">•</span>
          <span>
            Se borra al cerrar la pestaña. En un ordenador compartido, cerrar
            la pestaña cierra la sesión.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="pt-1 text-accent">•</span>
          <span>
            Caduca a las 24 horas aunque no la cierres.
          </span>
        </li>
      </ul>
      <p>
        No se usan cookies de analítica ni de publicidad, ni de terceros.
      </p>
    </LegalSection>

    <LegalSection title="Cuánto tiempo se conservan">
      <p>
        Tu cuenta existe mientras dure la relación laboral. Los registros de
        acceso se conservan el tiempo necesario para poder investigar un
        incidente de seguridad y, después, se eliminan.
      </p>
    </LegalSection>

    <LegalSection title="Quién más puede verlos">
      <p>
        Los datos se quedan en los servidores de {COMPANY.name}. No se ceden a
        terceros ni se transfieren fuera del Espacio Económico Europeo, salvo
        obligación legal.
      </p>
    </LegalSection>

    <LegalSection title="Tus derechos">
      <p>
        Puedes pedir acceder a tus datos, rectificarlos, suprimirlos, limitar
        u oponerte a su tratamiento, y solicitar su portabilidad. Escribe a{" "}
        <strong className="text-primary">{COMPANY.email}</strong>.
      </p>
      <p>
        Si crees que no se han respetado, puedes reclamar ante la Agencia
        Española de Protección de Datos (www.aepd.es).
      </p>
    </LegalSection>
    </>
  );
}
