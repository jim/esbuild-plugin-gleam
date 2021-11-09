import { readFile } from 'fs/promises';
import { basename, join, resolve } from 'path';
import { promisify } from 'util';
import { exec as callbackExec } from 'child_process';
const exec = promisify(callbackExec);

const namespace = 'gleam';
const fileFilter = /\.gleam$/;

async function readCompiledGleam (projectName, file) {
  const dir = join('target', 'lib', projectName);
  return await readFile(join(dir, file), { encoding: 'utf8' });
}

const packageName = JSON.parse(await readFile('./package.json')).name;

export const GleamPlugin = () => ({
  name: 'gleam',

  async setup (build) {
    let compiled;

    build.onEnd(result => {
      console.log(`build ended with ${result.errors.length} errors`);
    });

    build.onStart(() => {
      compiled = exec('node node_modules/esbuild-plugin-gleam/bin/build.js build');
    });

    build.onResolve({ filter: fileFilter }, args => ({
      path: join(args.resolveDir, args.path),
      namespace
    }));

    const gleamPackageRegex = /^gleam-packages\//;
    const targetDirPath = resolve('target');

    build.onResolve({ filter: gleamPackageRegex }, args => {
      const includePath = args.path.replace(gleamPackageRegex, '');
      const result = {
        path: join(targetDirPath, 'lib', includePath)
      };
      return result;
    });

    build.onLoad({ filter: /.*/, namespace }, async args => {
      await compiled;

      const name = basename(args.path, '.gleam');
      const contents = await readCompiledGleam(packageName, `${name}.js`);
      return { contents, resolveDir: join('target', 'lib/', packageName) };
    });
  }
});
