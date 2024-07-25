import { writable } from 'svelte/store'

export const storeFeedback = writable<any | null>(null)
export const storeFeedbacks = writable<any[] | null>(null)

export const variablesOperationalFeedback = writable<any[]>([])
