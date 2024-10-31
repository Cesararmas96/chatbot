<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { v4 as uuidv4 } from 'uuid'
	import { goto } from '$app/navigation' // Importación de goto
	import { getApiData } from '$lib/services/getData.js'
	import { fetchChatData } from '$lib/services/chatService'
	import { sendErrorNotification } from '$lib/stores/toast'
	import { storeUser } from '$lib/stores'
	import SidebarBot from '$lib/components/SidebarBot.svelte'
	import ChatInput from '$lib/components/chat/ChatInput.svelte'
	import CardLibrary from '$lib/components/chat/CardLibrary.svelte'
	import LoaderCustom from '$lib/components/common/LoaderCustom.svelte'
	import * as Card from '$lib/components/ui/card/index.js'
	import { Button } from '$lib/components/ui/button/index.js'
	import { Menu } from 'lucide-svelte'

	let botData = null
	let errorMessage = ''
	let isLoading = false
	let initialLoad = true
	let botName = ''
	let query = ''
	let chatInputRef: any
	let uuid = ''
	let messages = []
	let chatStarted = false

	$: botName = $page.params.bot?.toLowerCase()

	export let data: any

	$storeUser = data.user
	const session = data.user ? data.user : $storeUser

	onMount(async () => {
		if (!botName) {
			errorMessage = 'Bot name is missing in the URL'
			initialLoad = false
			return
		}

		const apiUrl = `${import.meta.env.VITE_API_AI_URL}/api/v1/bots`
		try {
			const botsList = await getApiData(
				apiUrl,
				'GET',
				{},
				{},
				{
					headers: {
						Authorization: `Bearer ${session.token}`,
						'Content-Type': 'application/json'
					}
				}
			)
			const matchedBot = botsList.find((bot) => bot.name.toLowerCase() === botName)
			if (matchedBot) {
				const botApiUrl = `${import.meta.env.VITE_API_AI_URL}/api/v1/bots?name=${matchedBot.name}`
				const data = await getApiData(
					botApiUrl,
					'GET',
					{},
					{},
					{
						headers: {
							Authorization: `Bearer ${session.token}`,
							'Content-Type': 'application/json'
						}
					}
				)
				botData = data ? data[0] : null
				errorMessage = botData ? '' : `Bot with name ${botName} not found.`
			} else {
				errorMessage = `Bot with name ${botName} not found.`
			}
		} catch (error) {
			errorMessage = 'Error fetching bot data.'
			console.error(error)
		} finally {
			initialLoad = false
		}
	})

	let isSidebarOpen = false

	const toggleSidebar = () => {
		isSidebarOpen = !isSidebarOpen
	}

	// Manejo del envío de la consulta con control de errores y carga
	const handleFetchData = async () => {
		isLoading = true
		try {
			const { response, question, answer, chat_history, sid, at } = await fetchChatData(
				botName,
				query
			)
			const newMessage = {
				text: response,
				query,
				answer,
				chat_history,
				sid,
				user_id: session.user_id,
				chatbot_id: botData.chatbot_id,
				at
			}
			messages = [...messages, newMessage]
			query = '' // Limpiar el input solo si la respuesta es exitosa

			// Si es el primer mensaje, genera un UUID, guarda los mensajes y redirige
			if (!uuid) {
				uuid = uuidv4() // Generar el UUID para identificar el chat
				localStorage.setItem('messages', JSON.stringify(messages))

				// Redirige a la página de conversación completa
				await goto(`/${botName}/${uuid}`)
			} else {
				// Si ya estamos en una conversación, actualiza los mensajes en localStorage
				localStorage.setItem('messages', JSON.stringify(messages))
			}
		} catch (error) {
			console.error('Fetch operation failed:', error)
			sendErrorNotification('Error: Unable to fetch data. Please try again.') // Notificación de error
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

{#if initialLoad}
	<!-- Solo mostrar LoaderCustom durante la carga inicial -->
	<LoaderCustom />
{:else if errorMessage}
	<p class="error">{errorMessage}</p>
{:else if botData && botData.chatbot_id}
	<div class="flex flex-col md:flex-row h-screen bg-black text-white">
		<!-- Mobile header with button to toggle sidebar -->
		<div class="md:hidden p-4 bg-zinc-900 flex justify-between items-center">
			<a href="/home" class="flex items-center">
				<img src="/troc.png" alt="" class="w-12 h-12" />
				<h1 class="text-xl font-bold ml-2">T-ROC Chatbots</h1>
			</a>
			<Button on:click={toggleSidebar} class="bg-zinc-800 p-2">
				<Menu class="h-6 w-6 text-white" />
			</Button>
		</div>

		<!-- Sidebar section -->
		<SidebarBot chatbotid={botData.id} {isSidebarOpen} {toggleSidebar} {session} />

		<!-- Main content section -->
		<div class="flex-1 flex flex-col min-h-0 h-full p-5 bg-zinc-900">
			<Card.Root class="flex flex-col flex-1">
				<Card.Content class="flex-1 flex flex-col justify-between">
					<div class="flex-1 flex flex-col items-center justify-center">
						<div class="w-full max-w-2xl">
							<header class="text-center mb-8">
								<div class="flex items-center justify-center gap-3 mb-2">
									<img
										src="/images/bots/{botData.name}.png"
										class="w-24 md:w-20"
										alt="{botData.name}-logo"
									/>
									<h1 class="text-2xl font-bold">{botData.name}</h1>
								</div>
								<p class="text-xl text-gray-400">How can I help you today?</p>
							</header>
							<div class="mb-8">
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
									{#if botData.chatbot_id}
										<CardLibrary {session} chatbotId={botData.chatbot_id} />
									{:else}
										<p>Error: chatbotId is missing</p>
									{/if}
								</div>
							</div>
						</div>
					</div>
					<div class="p-6">
						<div class="max-w-2xl mx-auto">
							<div class="relative">
								{#if !chatStarted}
									<!-- Input para enviar consulta -->
									<ChatInput
										{isLoading}
										on:submit={handleSubmit}
										bind:this={chatInputRef}
										bind:query
									/>
								{:else}
									<!-- Vista de conversación sin recarga -->
									<div class="chatbox">
										{#each messages as message}
											<div class="message">
												<p><strong>User:</strong> {message.query}</p>
												<p><strong>Bot:</strong> {message.text}</p>
											</div>
										{/each}
										<ChatInput
											{isLoading}
											on:submit={handleSubmit}
											bind:this={chatInputRef}
											bind:query
										/>
									</div>
								{/if}
								<p class="text-xs text-gray-500 mt-2 text-center">
									Chatbots can make mistakes. Verify important information.
								</p>
							</div>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
{/if}
