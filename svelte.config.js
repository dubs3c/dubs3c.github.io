import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';
import path from "path"
import { fileURLToPath } from "url"

const dirname = path.resolve(fileURLToPath(import.meta.url), "../");


/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: [".svelte"],
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess(),
	],
	emitCss: true,
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null
		}),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		files: {
			assets: "static",
		},
		vite: () => ({
			optimizeDeps: {
				exclude: ['src/posts']
			}

		})
	}
};

export default config;
