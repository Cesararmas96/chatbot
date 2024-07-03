import { writable } from 'svelte/store'

export const storeBot = writable<any | null>(null)
export const storeBots = writable<any[] | null>(null)

export const variablesOperationalBot = writable<any[]>([])
