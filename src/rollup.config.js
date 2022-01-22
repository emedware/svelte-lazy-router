import typescript from 'rollup-plugin-ts';
import svelte from 'rollup-plugin-svelte';
import preprocess from 'svelte-preprocess';
import commonjs from '@rollup/plugin-commonjs';
import autoExternal from 'rollup-plugin-auto-external';
import { terser } from "rollup-plugin-terser";
import copy from 'rollup-plugin-copy';
import pkg from "../package.json";
import dts from "rollup-plugin-dts";
import svelteDts from "svelte-dts";
import dstBundle from "dts-bundle";

const production = !process.env.ROLLUP_WATCH;
const name = pkg.name
	.replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
	.replace(/^\w/, m => m.toUpperCase())
	.replace(/-\w/g, m => m[1].toUpperCase());

/**
 * @type {import('rollup').RollupOptions}
 */
export default [{
	input: 'src/index.ts',
	output: [
		// Take care that, without a svelte-steer.d.ts, it uses the .js instead of the .mjs
		{ file: pkg.module, format: 'esm', sourcemap: !production },
		{ file: pkg.main+'.js', format: 'umd', name, sourcemap: !production },
		{ file: pkg.main+'.min.js', format: 'iife', name, plugins: [terser()], sourcemap: !production }
	],
	watch: !production && {
		include: ['src/**/*']
	},
	plugins: [
		//svelteDts({output: 'dst/svelte-steer.sdts.d.ts'}),
		//dts(),
		/*copy({
			targets: [
				{src: 'src/@types/*', dest: 'dst'}
			]
		}),*/
		autoExternal(),
		typescript({
			allowNonTsExtensions: true
		}),
		svelte({
			compilerOptions: {
				dev: !production
			},
			preprocess: preprocess()
		}),
		commonjs({
			include: /node_modules/
		})
	]
}, {
	input: 'src/bundle.d.ts/index.d.ts',
	output: [
		{ file: pkg.typings, format: 'es', sourcemap: !production }
	],
	watch: !production && {
		include: ['src/**/*']
	},
	plugins: [
		dts({
			
		})
	]
}];

var opts = {
    name: 'svelte-steer',
    main: 'src/bundle.d.ts/index.d.ts',
    baseDir: 'src',
    out: '../dst/svelte-steer.d.ts',
    externals: false,
    referenceExternals: false,
    removeSource: false,
    newline: '\n',
    indent: '	',
    prefix: '__',
    separator: '/',
    verbose: false,
    emitOnIncludedFileNotFound: false,
    emitOnNoIncludedFileNotFound: false,    
    // output d.ts as designed for module folder. (no declare modules)
    outputAsModuleFolder: false,
    // path to file that contains the header
    // // insert a header in output file. i.e.: http://definitelytyped.org/guides/contributing.html#header
    // - default: null
    ////headerPath: "path/to/header/file",
    // text of the the header
    // doesn't work with headerPath
    // // insert a header in output file. i.e.: http://definitelytyped.org/guides/contributing.html#header
    // - default: ''
    ////headerTex: "" 
};
 
dstBundle.bundle(opts);