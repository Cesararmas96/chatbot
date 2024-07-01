import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      out: 'build' // El directorio de salida para el adaptador Node
    })
  },
  preprocess: vitePreprocess()
};

export default config;
