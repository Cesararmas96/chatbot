import { writable } from 'svelte/store'

export const storeChatbotid = writable<any | null>(null)
export const storeChatbotids = writable<any[] | null>(null)

export const variablesOperationalChatbotid = writable<any[]>([])
