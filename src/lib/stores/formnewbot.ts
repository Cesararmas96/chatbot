import { writable } from 'svelte/store'

export const storeFormNewBot = writable<any | null>(null)
export const storeFormNewBots = writable<any[] | null>(null)

export const variablesOperationalFormNewBot = writable<any[]>([])
