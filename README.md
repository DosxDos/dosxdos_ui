# @dosxdos/ui

Lo que comparten los módulos de Dos por Dos: la cabecera, el pie y la sesión.

Existe para que un cambio en el menú se haga **una sola vez**. Antes estos
ficheros vivían copiados en cada repositorio, con la regla de acordarse de
copiarlos a todos —y ya habían empezado a separarse: `UserMenu` era distinto en
el portal y en logística sin que nadie lo hubiera decidido.

Para entender el sistema entero —el acceso compartido, el token, los
subdominios— está `ARQUITECTURA.md`, en la raíz de cualquiera de los módulos.

---

## Qué hay dentro

| Pieza | Qué es |
|---|---|
| `AppsMenu` | El menú de aplicaciones. Se pinta con lo que sirve `/api/modules`. |
| `UserMenu` | La cuenta: nombre, perfil y cerrar sesión. |
| `Footer` | La firma y los enlaces legales. |
| `TransitionLink` | Enlace interno. Sustituye a `next/link` en todo el código. |
| `Icons` | Los iconos del proyecto. Cambiar de librería es tocar un fichero. |
| `ModuleIcon` / `RemoteIcon` | El icono de un módulo, que llega como SVG desde la base de datos. |
| `SessionProvider` / `useSession` | Quién eres. Lee el token y redirige si no hay. |
| `ModulesProvider` / `useModules` | El catálogo de aplicaciones, pedido una sola vez. |
| `utils/auth/*` | Leer, guardar y descodificar el token. |

Todo se importa de `"@dosxdos/ui"`, **nunca** de una ruta interna: así se puede
mover un fichero aquí dentro sin romper a nadie.

---

## Instalar

```bash
npm install github:DosxDos/dosxdos_ui#v0.1.0
```

Se fija una **etiqueta**, no una rama. Con `#main`, cualquier `npm install` se
traería lo último y una aplicación podría cambiar de menú sin que nadie la
hubiera tocado.

> **No lo instales con `file:../dosxdos_ui`.** npm crea un enlace simbólico y
> Turbopack no resuelve paquetes a través de uno: el build falla con
> `Module not found: Can't resolve '@dosxdos/ui'` aunque el paquete esté
> perfectamente. Costó un rato averiguarlo. Desde GitHub se instala como una
> carpeta de verdad y funciona.

---

## Los tres pasos en cada aplicación

### 1. Transpilarlo

El paquete viaja como TypeScript **sin compilar**, y Next no toca `node_modules`
por defecto:

```ts
// next.config.ts
const nextConfig: NextConfig = {
  transpilePackages: ["@dosxdos/ui"],
};
```

Es a propósito: publicarlo compilado obliga a un paso de build y a versionar
artefactos, y para tres aplicaciones que comparten cuatro componentes no
compensa. El precio es esta línea.

### 2. Que Tailwind mire dentro

Sin esto los componentes llegan con el HTML correcto y **ninguna regla que los
pinte** —un menú sin estilos, que parece que se ha roto el CSS entero—:

```css
/* globals.css, justo detrás de @import "tailwindcss" */
@source "../node_modules/@dosxdos/ui/src";
```

### 3. Montar los proveedores

Reciben lo que el paquete no puede saber:

```tsx
// components/layout/Providers.tsx
import { SessionProvider, ModulesProvider } from "@dosxdos/ui";
import { appConfig } from "@/config/app.config";
import { fetchModules } from "@/services/modules-service";

<SessionProvider siteUrl={appConfig.siteUrl} authUrl={appConfig.authUrl}>
  <ModulesProvider fetchModules={fetchModules}>
    {children}
  </ModulesProvider>
</SessionProvider>
```

**`fetchModules` lo pone cada aplicación** porque pide el catálogo a SU propio
origen (`/api/modules`), y ese route handler se lo pide por dentro al portal.
Ese rodeo evita CORS: el portal no lleva lista de orígenes permitidos y un
módulo nuevo no obliga a redesplegarlo.

### Lo que el paquete da por hecho

No trae estilos propios: usa los tokens de la aplicación, para que el menú sea
del mismo color que el resto de la pantalla en cada módulo. Eso significa que la
aplicación **tiene que definirlos**, o los componentes salen con el HTML bien y
los colores en blanco y negro.

En `styles/theme.css`, dentro del bloque `@theme`:

```
--color-primary      el color de marca: texto, iconos, el fondo de la cabecera
--color-secondary    el fondo claro sobre el que va todo
```

En `styles/base.css`:

```
.keyboard-focus-ring   el anillo de foco, solo con teclado
.text-body             el tamaño de texto normal
.text-label            la etiqueta pequeña en mayúsculas
.sr-only               lo que solo leen los lectores de pantalla
```

Cualquier módulo copiado de logística ya los tiene todos: la lista está aquí
para el día que alguien empiece uno de cero.

---

## El menú de usuario y la URL del perfil

Es la única diferencia de verdad entre el portal y los demás módulos, y por eso
viaja como prop:

```tsx
// En el PORTAL: el perfil es una ruta suya
<UserMenu perfilHref="/perfil" />

// Desde CUALQUIER OTRO módulo: la URL del portal, con el token pegado
<UserMenu perfilHref={withSessionToken(`${appConfig.portalUrl}/perfil`)} />
```

La sesión se guarda **por origen**. Sin llevarse el token, el portal no tendría
ninguna y rebotaría a la pantalla de acceso: parecería que el enlace del perfil
está roto.

`EnlacePerfil` decide solo qué tipo de enlace usar mirando el href: una ruta que
empieza por `/` navega por dentro con `TransitionLink`, y una URL absoluta sale
con un `<a>` normal, porque el router de Next no cambia de origen.

---

## Reexportar en vez de reescribir imports

Al migrar una aplicación no hace falta tocar los cuarenta ficheros que importan
`@/hooks/useSession`. Basta con que ese fichero reexporte:

```ts
// hooks/useSession.ts
export { useSession } from "@dosxdos/ui";
```

**Importarlo del sitio equivocado no da error, da un fallo silencioso.** React
compara los contextos por identidad: si un componente lee el contexto local y el
proveedor montado es el del paquete, el hook dirá que no hay sesión y la
pantalla se quedará vacía sin que nada falle por ninguna parte.

---

## Publicar un cambio

```bash
# 1. aquí: cambiar, subir la versión en package.json, etiquetar
git commit -am "..."
git tag v0.2.0
git push --tags

# 2. en cada aplicación que lo use
npm install github:DosxDos/dosxdos_ui#v0.2.0
```

Ese segundo paso es el precio de compartir de verdad: hasta que no se actualiza,
cada aplicación sigue con la versión que tenía. Es a propósito —nadie cambia de
menú por sorpresa— pero hay que acordarse, y es más trabajo que copiar un
fichero. Con tres aplicaciones compensa porque ya se habían desincronizado.

---

## Qué NO meter aquí

- **Nada que lea `@/config/app.config`.** Si el paquete necesita saber una URL,
  llega como prop. En cuanto importe la configuración de una aplicación, deja de
  ser compartido.
- **Nada de una sola aplicación.** Un componente que solo usa el portal vive en
  el portal, aunque sea "por si acaso".
- **Nada con estado de negocio.** Esto son piezas de interfaz y la sesión. Los
  datos los pide cada aplicación.

---

## Cuando algo no va

| Síntoma | Casi siempre es |
|---|---|
| `Module not found: Can't resolve '@dosxdos/ui'` | Instalado con `file:` o `npm link`: es un symlink y Turbopack no lo resuelve. Instálalo desde GitHub. |
| El menú sale sin estilos | Falta el `@source` en `globals.css`. |
| `useSession necesita estar dentro de SessionProvider` | Un componente lee el contexto local y el proveedor es el del paquete (o al revés). Reexporta, no dupliques. |
| El menú sale vacío | El portal no responde: `curl localhost:3001/api/modules`. |
| «Mi perfil» rebota al acceso | Falta el token en `perfilHref`: usa `withSessionToken()`. |
| Cambio algo aquí y la aplicación no se entera | Sigue con la etiqueta antigua. Etiqueta y reinstala. |
