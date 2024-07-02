import { preprocess } from 'svelte/compiler';
import adapter from '@sveltejs/adapter-node';

const config = {
    preprocess: preprocess(),
    kit: {
        adapter: adapter(),
        serviceWorker: {
            register: false
        }
    }
};

export default config;
