import { writable } from 'svelte/store'

export const storeChatbotname = writable<any | null>(null)
export const storeChatbotnames = writable<any[] | null>(null)

export const variablesOperationalChatbotname = writable<any[]>([])
