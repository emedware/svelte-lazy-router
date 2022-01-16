import typescript from 'rollup-plugin-ts';
import svelte from 'rollup-plugin-svelte';
import preprocess from 'svelte-preprocess';
import commonjs from '@rollup/plugin-commonjs';
import autoExternal from 'rollup-plugin-auto-external';
import { terser } from "rollup-plugin-terser";
import pkg from "../package.json";
import dts from "rollup-plugin-dts";
import svelteDts from "svelte-dts";

const production = !process.env.ROLLUP_WATCH;
const name = pkg.name
	.replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
	.replace(/^\w/, m => m.toUpperCase())
	.replace(/-\w/g, m => m[1].toUpperCase());

export default {
	input: 'src/index.ts',
	output: [
		// Take care that, without a svelte-steer.d.ts, it uses the .js instead of the .mjs
		{ file: pkg.module, format: 'esm' },
		{ file: pkg.main+'.js', format: 'umd', name },
		{ file: pkg.main+'.min.js', format: 'iife', name, plugins: [terser()] }
	],
	watch: !production && {
		include: ['src/**/*']
	},
	plugins: [
		//svelteDts({output: 'dst/svelte-dts.d.ts'}),
		//dts(),
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
};