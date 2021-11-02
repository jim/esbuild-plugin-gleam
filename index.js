const fs = require('fs/promises')
const path = require('path');
const child_process = require('child_process');

const namespace = "gleam";
const fileFilter = /\.gleam$/;

const isProd = () => process.env.NODE_ENV === 'production';

function outDir(name) {
    return path.resolve(join("target", "lib", name));
}

async function compileGleam(options) {
    console.log("compiling gleam");
    const args = [
        "gleam compile-package",
        `--name ${options.name}`,
        "--target javascript",
        `--src ${options.src}`,
        `--out ${options.out}`,
        // (dependencies || []).map((dep) => `--lib=${outDir(dep)}`).join(" "),
        ].join(" ")
        console.log(args);
    const process = child_process.execSync(args);
    // console.log(process.stdout);
    // console.log(process.stderr);
}

async function readCompiledGleam(path) {
    return fs.readFile(path, {encoding: "utf8"});
}

module.exports = ({ optimize = isProd(), debug, pathToGleam: pathToGleam_ } = {}) => ({
    name: 'gleam',
    setup(build) {

        let compile = compileGleam({
            src: "src",
            out: "out",
            name: "gleam",
        });

        build.onEnd(result => {
            console.log(`build ended with ${result.errors.length} errors`)
          })
          build.onStart(() => {
            console.log('build started')
          })
  
      build.onResolve({ filter: fileFilter }, args => ({
        path: path.join(args.resolveDir, args.path),
        namespace,
      }))
  
      build.onLoad({ filter: /.*/, namespace }, async args => {
        await compile;
        const basename = path.basename(args.path, ".gleam");
        const tmpDir = "out"; //await fs.mkdtemp("gleam-compiled");
        try {
          const contents = await readCompiledGleam(path.join(tmpDir, `${basename}.js`));
          return { contents };
        } catch(e) {
          return { errors: [e] };
        }
      });
    },
  });