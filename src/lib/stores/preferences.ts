import { writable } from "svelte/store";

// export const themeMode = writable<string>('light');
// export const themeColor = writable<string>('blue');
export const loading = writable<boolean>(false);
export const sharedBot = writable<boolean>(false);
