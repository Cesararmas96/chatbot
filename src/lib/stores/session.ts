import { writable } from "svelte/store";

export const storeUser = writable<any | null>(null);
