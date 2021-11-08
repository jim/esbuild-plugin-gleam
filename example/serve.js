import esbuild from 'esbuild';
import { GleamPlugin } from 'esbuild-plugin-gleam';

esbuild.serve({
  servedir: 'www',
  port: 8000
},
{
  entryPoints: ['src/index.js'],
  bundle: true,
  outdir: 'www/js',
  plugins: [
    GleamPlugin({ debug: true })
  ]
}).then(server => {
  console.log(`Running development server on ${server.host}:${server.port}`);
}).catch(_e => process.exit(1));
