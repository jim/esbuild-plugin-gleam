# esbuild-plugin-gleam

A small wrapper around [the Gleam build script](https://github.com/gleam-lang/template-gleam-javascript/blob/main/bin/build.js) for use with [esbuild](https://esbuild.github.io). 

## Prerequisites

This plugin assumes that there is a `gleam` executable available on the current PATH. Installation instructions are available on [the Gleam website](https://gleam.run/getting-started/).

## Project Setup

To use this esbuild plugin, [you will need to use the JavaScript API](). For an example of a complete setup, see the `examples` directory. 

You'll want to:

1. Add this plugin to your package's dependencies:
    ```console
    $ npm install https://github.com/jim/esbuild-plugin-gleam
    ```

2. Add the GleamPlugin to your esbuild scripts (check `example/build.js`):
    ```js
    import esbuild from 'esbuild';
    import { GleamPlugin } from 'esbuild-plugin-gleam';

    esbuild.build({
    entryPoints: ['src/index.js'],
    bundle: true,
    outdir: 'dist',
    plugins: [
        GleamPlugin()
    ]
    }).catch(_e => process.exit(1));
    ```

3. Add the following to the top level of your `package.json` file:
    ```json
    "gleamDependencies": [
        {
            "name": "gleam_stdlib",
            "ref": "main",
            "url": "https://github.com/gleam-lang/stdlib.git"
        },
        {
            "name": "gleam_javascript",
            "ref": "main",
            "url": "https://github.com/gleam-lang/javascript.git",
            "dependencies": [
                "gleam_stdlib"
            ]
        }
    ]
    ```

4. Run `npm run build` to build your project.