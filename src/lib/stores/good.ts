import { writable } from 'svelte/store'

export const storeGood = writable<any | null>(null)
export const storeGoods = writable<any[] | null>(null)

export const variablesOperationalGood = writable<any[]>([])
