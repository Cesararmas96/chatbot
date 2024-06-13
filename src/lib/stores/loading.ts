import { writable } from "svelte/store";

export const isLoading = writable(false)
export const queryMessage = writable("")
export const message = writable("")