<script lang="ts">
	import { onMount, afterUpdate } from 'svelte'
	import { page } from '$app/stores'
	import { fetchChatData } from '$lib/services/chatService'
	import { storeUser } from '$lib/stores/session.js'
	import { db } from '$lib/db'
	import SidebarBot from '$lib/components/SidebarBot.svelte'
	import ChatInput from '$lib/components/chat/ChatInput.svelte'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import { Skeleton } from '$lib/components/ui/skeleton/index.js'
	import { get } from 'svelte/store'
	import { marked } from 'marked'
	import Avatar from '$lib/components/common/Avatar.svelte'
	import * as Tooltip from '$lib/components/ui/tooltip'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'

	import {
		Clipboard,
		Share2,
		RefreshCw,
		ThumbsUp,
		ThumbsDown,
		Flag,
		X,
		ChevronDown,
		Check
	} from 'lucide-svelte'

	///feature share
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js'
	import { Button } from '$lib/components/ui/button/index.js'
	import { Input } from '$lib/components/ui/input'

	import { Clipboard, Share2, RefreshCw, ThumbsUp, ThumbsDown, Flag } from 'lucide-svelte'
	import MessageDisplay from '$lib/components/chat/MessageDisplay.svelte'
	let shared = $page.url.searchParams.get('shared') === 'true'

	let isLoadingResponse = false
	let bot = ''
	let chatbotId = ''
	let user_id = ''
	let token = ''
	let isLoading = false
	let messages = []
	let query = ''
	let chatInputRef: any
	let messagesContainer: HTMLDivElement

	let selectedLlm = 'Gemini' // Inicialmente no hay LLM seleccionado

	let llmOptions = [
		{ name: 'Groq', description: 'Fast summaries and concise text generation.' },
		{ name: 'Claude', description: 'Great for natural and coherent conversations.' },
		{ name: 'Gemini', description: 'Versatile, multi-domain content creation.' }
	]
	export let data
	$storeUser = data.user
	user_id = data.user.user_id
	token = data.user.token

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
			} else {
				messages = []
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
		isLoadingResponse = true
		try {
			const { response, question, answer, chat_history, sid, at } = await fetchChatData(
				bot,
				query,
				selectedLlm
			)
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
		} catch (error) {
			sendErrorNotification('Error: Unable to fetch data. Please try again.')
		} finally {
			isLoading = false
			isLoadingResponse = false
		}
	}

	const handleSubmit = async (event: CustomEvent) => {
		event.preventDefault()
		query = event.detail.query
		await handleFetchData()

		// Enfocar el campo de entrada después de manejar la respuesta
		if (chatInputRef && chatInputRef.focusInput) {
			chatInputRef.focusInput()
		}
	}

	///////////////////////
	// Feature Share
	const currentUrl = new URL($page.url.href).host

	// Función para manejar la regeneración de la última pregunta
	const handleRegenerate = async (message, llm = selectedLlm) => {
		selectedLlm = llm // Actualiza el LLM seleccionado
		if (message.query) {
			query = message.query // Muestra la última consulta en el input
			await handleFetchData() // Reenvía la consulta
		}
	}

	const handleChangeLlm = (llm) => {
		selectedLlm = llm // Actualiza el LLM seleccionado
	}
</script>

{#if messages.length > 0}
	<div class="chatbox flex flex-col h-screen w-full">
		<div class="main-content flex-1 flex flex-col">
			<div class="flex border-b border-gray-700">
				<!-- <DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Button variant="" class="relative group p-2 w-auto my-5 ml-5">
							<span class="font-semibold text-xl">{selectedLlm}</span>
							<ChevronDown class="ml-1 h-4 w-4" />
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Group>
							<DropdownMenu.Label>
								<span class="opacity-95">Change model</span>
							</DropdownMenu.Label>
							<DropdownMenu.Separator />
							{#each llmOptions as llm}
								<DropdownMenu.Item
									class="cursor-pointer flex flex-col items-start gap-1"
									on:click={() => handleChangeLlm(llm.name)}
								>
									<div class="flex items-center w-full gap-2">
										<span class="font-bold">{llm.name}</span>
										{#if selectedLlm === llm.name}
											<Check class="h-4 w-4 " />
										{/if}
									</div>
									<div class="text-sm text-gray-500">{llm.description}</div>
								</DropdownMenu.Item>
							{/each}
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root> -->
			</div>
			<div
				class="scroll-area custom-scrollbar2 flex-1 p-6 overflow-auto"
				bind:this={messagesContainer}
			>
				<div class="mx-auto space-y-4 md:px-32">
					{#each messages as message, index (message.sid)}
						{#if message.query}
							<div class="message-container flex items-start gap-3 flex-row-reverse pb-5">
								<div
									class="avatar w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0"
								>
									<Avatar showFullName={false} {shared} />
								</div>
								<div class="message text-white bg-blue-600 p-4 rounded-lg max-w-[80%]">
									{message.query}
								</div>
							</div>
						{/if}
						{#if message.text}
							<MessageDisplay
								{message}
								{currentUrl}
								{bot}
								{selectedLlm}
								{llmOptions}
								onRegenerate={handleRegenerate}
								{token}
								isLastMessage={index === messages.length - 1}
							/>
						{/if}
					{/each}

					{#if isLoadingResponse}
						<!-- Mostrar el Skeleton mientras se espera la respuesta -->
						<div class="message-container flex items-start gap-3 flex-row-reverse pb-5">
							<div
								class="avatar w-8 h-8 rounded-full
									
									bg-blue-400 flex items-center justify-center flex-shrink-0"
							>
								<Avatar showFullName={false} />
							</div>
							<div class="message bg-blue-500 p-4 rounded-lg max-w-[80%]">
								{query}
							</div>
						</div>

						<div class="flex items-center space-x-4">
							<img
								src={`/images/bots/${bot.toLowerCase() ? bot.toLowerCase() : 'default'}.png`}
								alt="{bot}-logo"
								class="h-10 w-10"
							/>
							<div class="space-y-2">
								<Skeleton class="h-4 w-[350px]" />
								<Skeleton class="h-4 w-[300px]" />
							</div>
						</div>
					{/if}
				</div>
			</div>

			<div
				class="border-t
					bg-white border-gray-300
					  p-4 fixed bottom-0 left-0 right-0"
			>
				<div class="max-w-2xl mx-auto">
					<div class="relative">
						<ChatInput {isLoading} bind:query on:submit={handleSubmit} bind:this={chatInputRef} />
					</div>
					<p class="text-xs text-gray-500 mt-2 text-center">
						Chatbots can make mistakes. Verify important information.
					</p>
				</div>
			</div>
		</div>
	</div>
{:else}
	<!-- <p>No hay mensajes en esta conversación. Comienza a chatear para ver los mensajes aquí.</p> -->
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

		z-index: 10; /* Asegura que esté por encima de otros elementos background-color: black; Ajusta el color según tu tema */
	}

	@media (min-width: 1024px) {
		.scroll-area {
			max-width: 100%; /* Aumenta el ancho máximo en pantallas grandes */
		}
	}
</style>
