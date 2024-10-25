<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/stores' // Para obtener el nombre del bot desde la URL
	import { getApiData } from '$lib/services/getData.js'
	import { storeUser } from '$lib/stores'

	import SidebarBot from '$lib/components/SidebarBot.svelte'
	import ChatInput from '$lib/components/chat/ChatInput.svelte'
	import CardLibrary from '$lib/components/chat/CardLibrary.svelte'
	import * as Card from '$lib/components/ui/card/index.js'

	import { Button } from '$lib/components/ui/button/index.js'
	import { Menu } from 'lucide-svelte'
	import LoaderCustom from '$lib/components/common/LoaderCustom.svelte'

	let botData = null
	let errorMessage = ''
	let isLoading = true
	let botName = ''
	let query = ''
	let chatInputRef: any
	let uuid = ''

	$: botName = $page.params.bot?.toLowerCase() // Obtenemos el parámetro `bot` en minúsculas

	export let data: any

	$storeUser = data.user
	const session = data.user ? data.user : $storeUser

	console.log(session)

	onMount(async () => {
		if (!botName) {
			errorMessage = 'Bot name is missing in the URL'
			isLoading = false
			return
		}

		// Hacer una llamada a la API para obtener la lista de todos los bots
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
				},
				null,
				true
			)

			// Buscar una coincidencia exacta con el botName
			const matchedBot = botsList.find((bot) => bot.name.toLowerCase() === botName)

			if (matchedBot) {
				// Ahora que encontramos el bot correcto, hacer la llamada final a la API usando el nombre exacto
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
					},
					null,
					true
				)

				if (data) {
					botData = data[0] // Asignar datos del bot
				} else {
					errorMessage = `Bot with name ${botName} not found.`
				}
			} else {
				errorMessage = `Bot with name ${botName} not found.`
			}
		} catch (error) {
			errorMessage = 'An error occurred while fetching the bot data.'
			console.error('Error fetching bot data:', error)
		} finally {
			isLoading = false
		}
	})

	// Estado para manejar si el sidebar está visible
	let isSidebarOpen = false

	// Función para alternar la visibilidad del sidebar
	const toggleSidebar = () => {
		isSidebarOpen = !isSidebarOpen
	}

	const handleFetchData = async (lastQuery = '') => {
		isLoading = true
		try {
			const { response, question, answer, chat_history, sid, at } = await fetchChatData(
				bot,
				query || lastQuery
			)
			const newMessage = {
				text: response,
				query: query,
				answer: answer,
				chat_history: chat_history,
				sid: sid,
				user_id: user_id,
				chatbot_id: chatbotId,
				at: at
			}
			messages = [...messages, newMessage]
			query = ''

			if (!uuid) {
				uuid = uuidv4()
				// Guardar los datos en IndexedDB con el nuevo pageId
				const pageUrl = `/${bot}/${uuid}`
				await db.messages.bulkAdd(messages.map((message) => ({ ...message, pageId: pageUrl })))
				localStorage.setItem('messages', JSON.stringify(messages))
				goto(pageUrl)
			} else {
				// Actualizar los mensajes en IndexedDB para la página actual
				const pageUrl = $page.url.pathname
				await db.messages.bulkAdd(messages.map((message) => ({ ...message, pageId: pageUrl })))
				localStorage.setItem('messages', JSON.stringify(messages))
			}
		} catch (error) {
			console.error('There was a problem with the fetch operation:', error)
		} finally {
			isLoading = false
		}
	}

	const handleSubmit = async (event: CustomEvent) => {
		event.preventDefault()
		await handleFetchData()
	}

	function handleSelectQuery(event: CustomEvent<{ query: string }>) {
		query = event.detail.query
		chatInputRef.submitForm()
	}
</script>

{#if isLoading}
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
								<!-- <ChatInput {isLoading} /> -->

								<!-- <ChatInput
									{isLoading}
									bind:query
									on:submit={handleSubmit}
									bind:this={chatInputRef}
								/> -->

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
