import { readFile } from 'fs/promises';

import { basename, join, resolve } from 'path';
import { exec } from 'child_process';

const namespace = 'gleam';
const fileFilter = /\.gleam$/;

async function readCompiledGleam (projectName, file) {
  const dir = join('target', 'lib', projectName);

  const [lib, compiled] = await Promise.all([
    readFile(join(dir, 'gleam.js'), { encoding: 'utf8' }),
    readFile(join(dir, file), { encoding: 'utf8' })
  ]);

  return lib + compiled;
}

export const GleamPlugin = ({ debug, pathToGleam: pathToGleam_ } = {}) => ({
  name: 'gleam',

  async setup (build) {
    build.onEnd(result => {
      console.log(`build ended with ${result.errors.length} errors`);
    });

    build.onStart(() => {
      exec('node node_modules/esbuild-plugin-gleam/bin/build.js build');
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
      const name = basename(args.path, '.gleam');
      try {
        const contents = await readCompiledGleam('example', `${name}.js`);
        return { contents, resolveDir: 'target/lib/example' };
      } catch (e) {
        console.log(e);
        return { errors: [e] };
      }
    });
  }
});
