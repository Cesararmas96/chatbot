<script lang="ts">
	import { onMount, afterUpdate } from 'svelte'
	import { page } from '$app/stores'
	import { fetchChatData } from '$lib/services/chatService'
	import { storeUser } from '$lib/stores/session.js'
	import { db } from '$lib/db'
	import SidebarBot from '$lib/components/SidebarBot.svelte'
	import ChatInput from '$lib/components/chat/ChatInput.svelte'
	import { sendErrorNotification } from '$lib/stores/toast'
	import { get } from 'svelte/store'
	import { marked } from 'marked'

	let bot = ''
	let chatbotId = ''
	let user_id = ''
	let isLoading = false
	let messages = []
	let query = ''
	let chatInputRef: any
	let messagesContainer: HTMLDivElement

	export let data
	$storeUser = data.user
	user_id = data.user.user_id

	const loadMessages = async () => {
		const currentPage = get(page)
		const chatId = currentPage.params.id
		bot = currentPage.params.bot
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
				messages = []
				console.log('No hay mensajes almacenados para esta conversación.')
			}
		} catch (error) {
			console.error('Error al cargar mensajes desde IndexedDB:', error)
		}
	}

	onMount(() => {
		loadMessages()
		page.subscribe(() => {
			loadMessages()
		})
	})

	afterUpdate(() => {
		if (messagesContainer) {
			scrollToBottom(messagesContainer)
		}
	})

	const scrollToBottom = (node: HTMLDivElement) => {
		node.scrollTop = node.scrollHeight
	}

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

			const pageUrl = get(page).url.pathname
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
	<div class="chatbox flex flex-col h-screen w-full">
		<div class="main-content flex-1 flex flex-col">
			<div class="scroll-area flex-1 p-6 overflow-auto" bind:this={messagesContainer}>
				<div class="mx-auto space-y-4">
					{#each messages as message}
						{#if message.query}
							<div class="message-container flex items-start gap-3 flex-row-reverse">
								<div
									class="avatar w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0"
								>
									U
								</div>
								<div class="message bg-purple-600 p-4 rounded-lg max-w-[80%]">
									{message.query}
								</div>
							</div>
						{/if}
						{#if message.text}
							<div class="message-container flex items-start gap-3">
								<div
									class="avatar w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0"
								>
									<svg class="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
										<path
											d="M4.5 10.5C4.5 6.91015 7.41015 4 11 4C13.9124 4 16.3953 5.90328 17.2809 8.5H17.5C20.2614 8.5 22.5 10.7386 22.5 13.5C22.5 16.2614 20.2614 18.5 17.5 18.5H6.5C4.01472 18.5 2 16.4853 2 14C2 11.9621 3.37432 10.2292 5.25 9.76221Z"
										></path>
									</svg>
								</div>
								<div class="message bg-gray-800 p-4 rounded-lg max-w-[80%]">
									{message.text}
									{@html marked(message.text)}
								</div>
							</div>
						{/if}
					{/each}
				</div>
			</div>

			<div class="border-t border-gray-800 p-4 fixed bottom-0 left-0 right-0">
				<div class="max-w-2xl mx-auto">
					<div class="relative">
						<ChatInput {isLoading} bind:query on:submit={handleSubmit} bind:this={chatInputRef} />
					</div>
					<div class="text-center mt-2 text-sm text-gray-400">
						Chatbots can make mistakes. Verify important information.
					</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<p>No hay mensajes en esta conversación. Comienza a chatear para ver los mensajes aquí.</p>
{/if}

<style>
	.main-content {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.scroll-area {
		flex: 1;
		padding: 1.5rem;
		overflow-y: auto;
		max-width: 900px; /* Ajusta según tu preferencia */
		margin: 0 auto; /* Centra el contenido */
		width: 100%;
	}

	.message-container {
		display: flex;
		gap: 0.75rem;
	}

	.border-t {
		position: sticky;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: black; /* Ajusta el color según tu tema */
		z-index: 10; /* Asegura que esté por encima de otros elementos */
	}

	@media (min-width: 1024px) {
		.scroll-area {
			max-width: 100%; /* Aumenta el ancho máximo en pantallas grandes */
		}
	}
</style>
