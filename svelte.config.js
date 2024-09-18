import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';

// Adaptar https://navai.trocdigital.net/
// import adapter from '@sveltejs/adapter-netlify';

import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';


/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			"@/*": "./path/to/lib/*",
		  },
	},
	preprocess: [
		preprocess({
			postcss: true
		}),
		mdsvex(mdsvexConfig)

	],

	extensions: ['.svelte', ...mdsvexConfig.extensions]



};

export default config;