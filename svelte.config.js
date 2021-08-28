import preprocess from 'svelte-preprocess';
import static_adapter from '@sveltejs/adapter-static';

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
		adapter: static_adapter({
			pages: 'build',
			assets: 'build',
			fallback: null
		}),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		files: {
			assets: "static",
		},
		/*paths: {
			base: '/dubs3c.github.io',
		},*/
		appDir: 'internal',
	}
};


export default config;
