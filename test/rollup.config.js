import typescript from 'rollup-plugin-ts';
import svelte from 'rollup-plugin-svelte';
import preprocess from 'svelte-preprocess';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import copy from 'rollup-plugin-copy';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { join } from "path";

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'test/index.ts',
	preserveEntrySignatures: false,
	output: {
		dir: 'demo',
		format: 'esm',
		sourcemap: true
	},
	watch: !production && {
		include: ['src/**', 'test/**']
	},
	plugins: [
		copy({
			targets: [
				{ src: 'test/index.html', dest: 'demo' }
			],
			verbose: true
		}),
		typescript({
			allowNonTsExtensions: true,
			tsconfig: 'test/tsconfig.json'
		}),
		svelte({
			compilerOptions: {
				dev: true
			},
			preprocess: preprocess()
		}),
		nodeResolve({
			browser: true,
			dedupe: ['svelte']
		}),
		alias({
			entries: [
				{ find: 'svelte-steer', replacement: join(__dirname, production ? '..' : '../src') }
			]
		}),
		commonjs({
			include: /node_modules/
		})
	]
};