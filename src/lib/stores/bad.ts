import { writable } from 'svelte/store'

export const storeBad = writable<any | null>(null)
export const storeBads = writable<any[] | null>(null)

export const variablesOperationalBad = writable<any[]>([])
