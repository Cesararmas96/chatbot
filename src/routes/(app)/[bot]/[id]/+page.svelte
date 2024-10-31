<script lang="ts">
	import { onMount } from 'svelte'
	import ChatInput from '$lib/components/chat/ChatInput.svelte'
	import { fetchChatData } from '$lib/services/chatService'
	import { sendErrorNotification } from '$lib/stores/toast'

	let messages = [] // Cargar los mensajes del historial
	let query = '' // Query para enviar el input del usuario
	let isLoading = false

	// Cargar historial de mensajes desde `localStorage` en `onMount`
	onMount(() => {
		const storedMessages = localStorage.getItem('messages')
		messages = storedMessages ? JSON.parse(storedMessages) : []
	})

	// Manejo del envío de mensaje y llamado a la API
	const handleFetchData = async () => {
		isLoading = true
		try {
			const { response, question, answer, chat_history, sid, at } = await fetchChatData(
				$page.params.bot,
				query
			)
			const newMessage = {
				text: response,
				query,
				answer,
				chat_history,
				sid,
				at
			}
			messages = [...messages, newMessage]
			localStorage.setItem('messages', JSON.stringify(messages)) // Guardar historial actualizado
			query = '' // Limpiar input después de enviar
		} catch (error) {
			console.error('Error fetching response:', error)
			sendErrorNotification('Error: Unable to fetch data. Please try again.')
		} finally {
			isLoading = false
		}
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		query = event.detail.query
		await handleFetchData()
	}
</script>

<div class="conversation-container">
	{#each messages as message}
		<div class="message">
			<p><strong>User:</strong> {message.query}</p>
			<p><strong>Bot:</strong> {message.text}</p>
		</div>
	{/each}

	<!-- Input para continuar la conversación -->
	<ChatInput {isLoading} on:submit={handleSubmit} bind:query />
</div>

<style>
	.conversation-container {
		max-width: 600px;
		margin: auto;
	}
	.message {
		margin-bottom: 1rem;
	}
</style>
