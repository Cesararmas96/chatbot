<script lang="ts">
	import { onMount, tick } from 'svelte'
	import { page } from '$app/stores'
	import { v4 as uuidv4 } from 'uuid'
	import { goto } from '$app/navigation'
	import { getApiData } from '$lib/services/getData.js'
	import { fetchChatData } from '$lib/services/chatService'
	import { sendErrorNotification } from '$lib/stores/toast'
	import { storeUser } from '$lib/stores'
	import ChatInput from '$lib/components/chat/ChatInput.svelte'

	import CardLibrary from '$lib/components/chat/CardLibrary.svelte'
	import * as Card from '$lib/components/ui/card/index.js'
	import { Button } from '$lib/components/ui/button/index.js'
	import { Menu, X } from 'lucide-svelte'
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
				console.log(botData)
				errorMessage = botData ? '' : `Bot with name ${botName} not found.`
			} else {
				errorMessage = `Bot with name ${botName} not found.`
			}
		} catch (error) {
			errorMessage = 'Error fetching bot data.'
			console.error(error)
		} finally {
			initialLoad = false // Marcar que la carga inicial ha terminado
		}
	})

	let isSidebarOpen = false

	const toggleSidebar = () => {
		isSidebarOpen = !isSidebarOpen
	}

	const handleFetchData = async () => {
		isLoading = true
		try {
			if (!botData || !botData.name) {
				throw new Error('Bot data or bot name is missing.')
			}

			// Pasa botData.name exactamente como está
			const { response, question, answer, chat_history, sid, at } = await fetchChatData(
				botData.name, // No se modifica el texto
				query
			)

			const newMessage = {
				text: response,
				query,
				answer,
				chat_history,
				sid,
				user_id: session.user_id,
				chatbot_id: botData?.chatbot_id,
				at
			}

			messages = [...messages, newMessage]
			query = '' // Limpiar el input solo si la respuesta es exitosa

			// Guardar el primer mensaje en IndexedDB y redirigir
			if (!uuid) {
				uuid = uuidv4()
				const pageUrl = `/${botData.name.toLowerCase()}/${uuid}`
				await db.messages.bulkAdd(messages.map((message) => ({ ...message, pageId: pageUrl })))
				localStorage.setItem('messages', JSON.stringify(messages))
				await goto(pageUrl) // Redirigir a la nueva página
			} else {
				const pageUrl = $page.url.pathname
				await db.messages.bulkAdd(messages.map((message) => ({ ...message, pageId: pageUrl })))
				localStorage.setItem('messages', JSON.stringify(messages))
			}
		} catch (error) {
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

	const handleSelectQuery = async (event) => {
		query = event.detail.query // Actualiza el query
		await tick() // Espera a que Svelte actualice el DOM y los bindings

		if (chatInputRef) {
			chatInputRef.submitQuery() // Llama al método público para enviar el formulario
		}
	}

	let showMessage = true

	function closeMessage() {
		showMessage = false
	}
</script>

<div class="flex-1 flex flex-col min-h-0 h-full p-5 bg-zinc-900">
	{#if showMessage && botData && botData.name && botData.name.toLowerCase() === 'askbuddy'}
		<div class="w-full" id="mensaje">
			<div class="relative">
				<div
					class="bg-yellow-50 dark:bg-gray-800 text-yellow-800 dark:text-yellow-300 rounded-lg border border-yellow-300 dark:border-yellow-800 divide-yellow-300 dark:divide-yellow-800 p-4 gap-3 text-sm animate__animated animate__fadeIn mb-2 ml-[5px] mr-[12px] px-4 py-2"
					role="alert"
				>
					<div class="flex flex-col justify-between">
						<div class="flex flex-col items-start justify-center">
							<div class="flex items-center gap-3 text-lg font-medium">
								<span class="dark:text-gray-300 text-sm">Disclaimer</span>
							</div>
							<p class="mb-2 mt-2 text-sm dark:text-gray-400">
								The MSO AskBuddy Bot is designed to support MSO employees by providing quick access
								to training materials, guides, and step-by-step resources that have been covered
								during your training. This bot will not duplicate or replace the information
								available on C2 (T-Mobile operations) or the TROC Hub. If you need further
								assistance, please contact your team lead or refer to the specific resources on the
								respective platforms.
							</p>
						</div>
						<div class="flex flex-row justify-end gap-1"></div>
					</div>
				</div>

				<!-- Botón para cerrar el mensaje usando el componente X de lucide-svelte -->
				<button
					class="absolute top-2 right-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mr-3 mt-1"
					on:click={closeMessage}
				>
					<X class="w-4 h-4" />
				</button>
			</div>
		</div>
	{/if}
	<Card.Root class="flex flex-col flex-1 bg-zinc-900 border-none">
		<Card.Content class="flex-1 flex flex-col justify-between">
			<div class="flex-1 flex flex-col items-center justify-center">
				<div class="w-full max-w-2xl">
					<header class="text-center mb-8">
						{#if botData}
							<div class="flex justify-center mt-2">
								<img
									src="/images/bots/{botData.name.toLowerCase()}.png"
									class="w-32 md:w-25"
									alt="{botData.name.toLowerCase()}-logo"
								/>
							</div>

							<h1 class="text-2xl font-bold text-white">{botData.name}</h1>
						{:else if initialLoad}
							<p class="text-gray-400">Loading bot data...</p>
						{:else}
							<p class="text-red-500">Bot data is not available. Please try again later.</p>
						{/if}
						<p class="text-normal text-gray-400">How can I help you today?</p>
					</header>
					{#if botData}
						<div
							class="flex-1 p-62 flex flex-col items-center justify-center w-full max-w-2xl mb-3"
						>
							<div
								class="overflow-y-auto w-full
                max-h-[calc(100vh-550px)]
                md:max-h-[calc(100vh-400px)]
                lg:max-h-[calc(100vh-470px)]"
							>
								<!-- Agrega un scroll con altura máxima -->
								<CardLibrary
									{session}
									chatbotId={botData.chatbot_id}
									on:selectQuery={handleSelectQuery}
									class=""
								/>
							</div>
						</div>
					{/if}
				</div>
			</div>
			<div class=" border-t border-gray-800 bottom-0 left-0 right-0">
				<div class="max-w-2xl mx-auto">
					<div class="relative pt-1">
						<ChatInput {isLoading} on:submit={handleSubmit} bind:this={chatInputRef} bind:query />
						<p class="text-xs text-gray-500 text-center">
							Chatbots can make mistakes. Verify important informations.
						</p>
					</div>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
