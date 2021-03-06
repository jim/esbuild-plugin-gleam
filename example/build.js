import esbuild from 'esbuild';
import { GleamPlugin } from 'esbuild-plugin-gleam';

esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  outdir: 'dist',
  plugins: [
    GleamPlugin({ debug: true })
  ]
}).catch(_e => process.exit(1));
