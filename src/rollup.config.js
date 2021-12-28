import typescript from 'rollup-plugin-ts';
import svelte from 'rollup-plugin-svelte';
import preprocess from 'svelte-preprocess';
import commonjs from '@rollup/plugin-commonjs';
import autoExternal from 'rollup-plugin-auto-external';
import { nodeResolve } from '@rollup/plugin-node-resolve';
//import svelteDts from "svelte-dts";

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/index.ts',
	output: {
		file: "dst/router-esm.js",
		format: 'esm',
		sourcemap: true
	},
	watch: !production && {
		include: ['src/**']
	},
	plugins: [
		//svelteDts({}),
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
		nodeResolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs({
			include: /node_modules/
		})
	]
};