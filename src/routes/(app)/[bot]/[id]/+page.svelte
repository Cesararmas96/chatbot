<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { fetchChatData } from '$lib/services/chatService'
	import { storeUser } from '$lib/stores/session.js'
	import { db } from '$lib/db'
	import SidebarBot from '$lib/components/SidebarBot.svelte'
	import ChatInput from '$lib/components/chat/ChatInput.svelte'
	import { sendErrorNotification } from '$lib/stores/toast'

	let bot = ''
	let chatbotId = ''
	let user_id = ''
	let isLoading = false
	let messages = []
	let query = ''
	let chatInputRef: any

	export let data
	$storeUser = data.user
	user_id = data.user.user_id

	onMount(async () => {
		bot = $page.params.bot
		const chatId = $page.params.id

		// Obtener mensajes del historial de IndexedDB
		const pageUrl = `/${bot}/${chatId}`
		try {
			const storedMessages = await db.messages.where('pageId').equals(pageUrl).toArray()
			if (storedMessages.length > 0) {
				messages = storedMessages.map((msg) => ({
					text: msg.text,
					query: msg.query,
					answer: msg.answer,
					chat_history: msg.chat_history,
					sid: msg.sid,
					user_id: msg.user_id,
					chatbot_id: msg.chatbot_id
				}))
				console.log('Mensajes cargados desde IndexedDB:', messages)
			} else {
				console.log('No hay mensajes almacenados para esta conversación.')
			}
		} catch (error) {
			console.error('Error al cargar mensajes desde IndexedDB:', error)
		}
	})

	const handleFetchData = async () => {
		isLoading = true
		try {
			const { response, question, answer, chat_history, sid, at } = await fetchChatData(bot, query)
			const newMessage = {
				text: response,
				query,
				answer,
				chat_history,
				sid,
				user_id,
				chatbot_id: chatbotId,
				at
			}
			messages = [...messages, newMessage]
			query = '' // Limpiar input después de recibir la respuesta

			const pageUrl = $page.url.pathname
			await db.messages.add({ ...newMessage, pageId: pageUrl })
			console.log('Nuevo mensaje guardado en IndexedDB:', newMessage)
		} catch (error) {
			console.error('Fetch operation failed:', error)
			sendErrorNotification('Error: Unable to fetch data. Please try again.')
		} finally {
			isLoading = false
		}
	}

	const handleSubmit = async (event: CustomEvent) => {
		event.preventDefault()
		query = event.detail.query
		await handleFetchData()
	}
</script>

{#if messages.length > 0}
	<div class="chatbox">
		{#each messages as message}
			<div class="message">
				<p><strong>User:</strong> {message.query}</p>
				<p><strong>Bot:</strong> {message.text}</p>
			</div>
		{/each}
	</div>
{:else}
	<p>No hay mensajes en esta conversación. Comienza a chatear para ver los mensajes aquí.</p>
{/if}

<div class="chat-input-container">
	<ChatInput {isLoading} bind:query on:submit={handleSubmit} bind:this={chatInputRef} />
</div>
