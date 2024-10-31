<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { v4 as uuidv4 } from 'uuid'
	import { goto } from '$app/navigation'
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
	import { db } from '$lib/db' // Importa tu base de datos IndexedDB

	let botData = null
	let errorMessage = ''
	let isLoading = false // Estado de carga
	let initialLoad = true // Estado de carga inicial de la página
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

			// Guardar el primer mensaje en IndexedDB y redirigir
			if (!uuid) {
				uuid = uuidv4()
				const pageUrl = `/${botName}/${uuid}`
				await db.messages.bulkAdd(messages.map((message) => ({ ...message, pageId: pageUrl })))
				console.log('Mensajes guardados en IndexedDB:', messages)
				localStorage.setItem('messages', JSON.stringify(messages))
				await goto(pageUrl) // Redirigir a la nueva página
			} else {
				const pageUrl = $page.url.pathname
				await db.messages.bulkAdd(messages.map((message) => ({ ...message, pageId: pageUrl })))
				localStorage.setItem('messages', JSON.stringify(messages))
			}
		} catch (error) {
			console.error('Fetch operation failed:', error)
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

<!-- Mostrar la UI -->
{#if initialLoad}
	<LoaderCustom />
{:else if errorMessage}
	<p class="error">{errorMessage}</p>
{:else if botData && botData.chatbot_id}
	<div class="flex flex-col md:flex-row h-screen bg-black text-white">
		<!-- Sidebar y secciones de UI -->
		<SidebarBot chatbotid={botData.chatbot_id} {isSidebarOpen} {toggleSidebar} {session} />
		<div class="flex-1 flex flex-col min-h-0 h-full p-5 bg-zinc-900">
			<Card.Root class="flex flex-col flex-1">
				<Card.Content class="flex-1 flex flex-col justify-between">
					<div class="flex-1 flex flex-col items-center justify-center">
						<div class="w-full max-w-2xl">
							<header class="text-center mb-8">
								<h1 class="text-2xl font-bold">{botData.name}</h1>
								<p class="text-xl text-gray-400">How can I help you today?</p>
							</header>
							<CardLibrary {session} chatbotId={botData.chatbot_id} />
						</div>
					</div>
					<div class="p-6">
						<div class="max-w-2xl mx-auto">
							<div class="relative">
								<ChatInput
									{isLoading}
									on:submit={handleSubmit}
									bind:this={chatInputRef}
									bind:query
								/>
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
