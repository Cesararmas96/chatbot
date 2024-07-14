import { writable } from 'svelte/store'

export const storeShare = writable<any | null>(null)
export const storeShares = writable<any[] | null>(null)

export const variablesOperationalShare = writable<any[]>([])
