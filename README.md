# @dosxdos/ui

Los componentes que comparten los modulos de Dos por Dos: la cabecera, el pie y
la sesion.

Existe para que un cambio en el menu se haga **una vez**. Antes vivian copiados
en cada repositorio y ya habian empezado a separarse.

## Instalar

```bash
npm install github:DosxDos/dosxdos_ui#v0.1.0
```

Se fija una ETIQUETA, no una rama: sin ella cualquier `npm install` se traeria
lo ultimo de `main` y una aplicacion cambiaria de menu sin que nadie la tocara.

## Que hace falta en quien lo usa

**1. Transpilarlo.** El paquete viaja como TypeScript sin compilar, y Next no
toca `node_modules` por defecto:

```ts
// next.config.ts
transpilePackages: ["@dosxdos/ui"],
```

**2. Que Tailwind mire dentro.** Si no, los componentes llegan con el HTML
correcto y ninguna regla que los pinte:

```css
/* globals.css */
@source "../node_modules/@dosxdos/ui/src";
```

**3. Montar los proveedores**, que reciben lo que el paquete no puede saber:

```tsx
<SessionProvider siteUrl={appConfig.siteUrl} authUrl={appConfig.authUrl}>
  <ModulesProvider fetchModules={fetchModules}>
```

`fetchModules` lo pone cada aplicacion porque pide el catalogo a SU propio
origen (`/api/modules`), que por dentro se lo pide al portal. Asi no hay que
abrir CORS ni redesplegar el portal al crear un modulo.

## El menu de usuario

```tsx
// En el portal, el perfil es una ruta suya
<UserMenu perfilHref="/perfil" />

// Desde cualquier otro modulo, la URL del portal CON el token: la sesion se
// guarda por origen, y sin el rebotaria al modulo de acceso
<UserMenu perfilHref={withSessionToken(`${appConfig.portalUrl}/perfil`)} />
```

## Publicar un cambio

```bash
# 1. cambiar, y subir la version en package.json
git commit -am "..." && git tag v0.2.0 && git push --tags

# 2. en cada aplicacion
npm install github:DosxDos/dosxdos_ui#v0.2.0
```

Ese segundo paso es el precio de compartir de verdad: hasta que no se actualiza,
cada aplicacion sigue con la version que tenia. Es a proposito —nadie cambia de
menu por sorpresa— pero hay que acordarse.
