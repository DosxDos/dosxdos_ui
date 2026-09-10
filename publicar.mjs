import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

/**
 * Publica una version del paquete y la instala en todas las aplicaciones.
 *
 * Compartir de verdad tiene un precio: hasta que cada aplicacion no reinstala,
 * sigue con la version que tenia. Es a proposito —nadie cambia de menu por
 * sorpresa al desplegar otra cosa— pero son tres `npm install` que se olvidan.
 * Esto los hace de una vez.
 *
 *   node publicar.mjs 0.3.0
 *
 * NO despliega nada: dejar los cambios en el arbol de cada aplicacion es
 * deliberado. Asi se pueden mirar, probar en local y commitear cuando toque, en
 * vez de que un menu llegue a produccion sin que nadie lo haya visto.
 */
const AQUI = dirname(fileURLToPath(import.meta.url));

/** Las aplicaciones que usan el paquete, como carpetas hermanas de esta. */
const APLICACIONES = ["dosxdos_portal", "dosxdos_logistica", "dosxdos_auth"];

const version = process.argv[2];

if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error("Uso: node publicar.mjs <version>   (por ejemplo 0.3.0)");
  process.exit(1);
}

const sh = (cmd, cwd = AQUI) =>
  execSync(cmd, { cwd, stdio: ["ignore", "pipe", "pipe"] }).toString().trim();

// Nada a medias: publicar con cambios sin guardar deja una etiqueta que no
// corresponde a ningun commit y es imposible saber despues que se publico.
const sucio = sh("git status --porcelain");
if (sucio) {
  console.error("Hay cambios sin guardar. Haz commit antes de publicar:\n" + sucio);
  process.exit(1);
}

const etiqueta = `v${version}`;

if (sh("git tag").split("\n").includes(etiqueta)) {
  console.error(
    `La etiqueta ${etiqueta} ya existe.\n` +
      "Mover una etiqueta publicada hace que dos aplicaciones con la misma " +
      "version tengan codigo distinto. Sube el numero."
  );
  process.exit(1);
}

// 1. La version en package.json y la etiqueta, juntas.
const manifiesto = resolve(AQUI, "package.json");
const paquete = JSON.parse(readFileSync(manifiesto, "utf8"));
paquete.version = version;
writeFileSync(manifiesto, JSON.stringify(paquete, null, 2) + "\n");

sh("git add package.json");
sh(`git commit -m "v${version}"`);
sh(`git tag -a ${etiqueta} -m "v${version}"`);
sh("git push origin main --tags");
console.log(`· publicado ${etiqueta}`);

// 2. Y a cada aplicacion que este al lado.
const destino = `github:DosxDos/dosxdos_ui#${etiqueta}`;

for (const app of APLICACIONES) {
  const ruta = resolve(AQUI, "..", app);

  if (!existsSync(ruta)) {
    console.log(`· ${app}: no esta aqui al lado, se salta`);
    continue;
  }

  const suPaquete = JSON.parse(
    readFileSync(resolve(ruta, "package.json"), "utf8")
  );
  if (!suPaquete.dependencies?.["@dosxdos/ui"]) {
    console.log(`· ${app}: todavia no usa el paquete, se salta`);
    continue;
  }

  try {
    sh(`npm install ${destino}`, ruta);
    console.log(`· ${app}: actualizado`);
  } catch (error) {
    console.error(`· ${app}: FALLO -> ${error.message.split("\n")[0]}`);
  }
}

console.log(`
Listo. En cada aplicacion han cambiado package.json y package-lock.json.
Miralas, pruebalas y haz commit cuando estes conforme.`);
