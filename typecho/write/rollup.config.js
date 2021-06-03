import { nodeResolve } from '@rollup/plugin-node-resolve';
import uglify from '@lopatnov/rollup-plugin-uglify';
export default {
	input: './js/index.js',
	output: {
		dir: './dist',
		format: 'es'
	},
	preserveEntrySignatures: 'strict',
	plugins: [nodeResolve(), uglify()]
};
