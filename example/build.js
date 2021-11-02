const esbuild = require('esbuild');
const GleamPlugin = require('esbuild-plugin-gleam');

esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  outdir: 'dist',
  plugins: [
    GleamPlugin({ debug: true }),
  ],
}).catch(_e => process.exit(1))