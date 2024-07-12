import { writable } from 'svelte/store'

export const storePromptLibrary = writable<any | null>(null)
export const storePromptLibrarys = writable<any[] | null>(null)

export const variablesOperationalPrompt = writable<any[]>([])
