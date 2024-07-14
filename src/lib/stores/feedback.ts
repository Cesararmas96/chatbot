import { writable } from 'svelte/store'

export const storefeedback = writable<any | null>(null)
export const storefeedbacks = writable<any[] | null>(null)

export const variablesOperationalfeedbackMessagefeedback = writable<any[]>([])
