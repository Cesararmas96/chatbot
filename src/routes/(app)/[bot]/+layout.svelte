<script lang="ts">
	import { writable } from 'svelte/store'

	import { onMount } from 'svelte'
	import moment from 'moment'
	import Dexie from 'dexie'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { Button } from '$lib/components/ui/button/index.js'
	import { Input } from '$lib/components/ui/input/index.js'
	import { Label } from '$lib/components/ui/label/index.js'
	import * as Avatar from '$lib/components/ui/avatar/index.js'
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js'
	import { Separator } from '$lib/components/ui/separator/index.js'
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js'
	import {
		Upload,
		FileAudio,
		Plus,
		LogOut,
		Home,
		Search,
		Loader,
		Pencil,
		Menu,
		MoreVertical,
		MessageSquare,
		Trash2
	} from 'lucide-svelte'

	import { enhance } from '$app/forms'
	import { getApiData } from '$lib/services/getData'
	import { jobsListStore } from '$lib/stores/jobsStore.ts'
	import { storeUser } from '$lib/stores'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import LoaderCustom from '$lib/components/common/LoaderCustom.svelte'
	export let data: any

	$storeUser = data.user
	const session = data.user ? data.user : $storeUser

	let inputType = 'file'
	let searchTerm = ''
	let jobsList = []
	let chatbotid
	let user_id = session.user_id
	let isLoading = false
	let botName = $page.params.bot
	let filteredPageData = [] // Asegúrate de declarar esta variable
	let pageData = []
	let errorMessage = ''
	let botData = null
	let initialLoad = true

	// Configuración de la base de datos Dexie
	const db = new Dexie('ChatDB')
	db.version(1).stores({
		users: '++id, &userId, name',
		bots: '++id, &botId, userId',
		messages: '++id, pageId, text, query, answer, chat_history, sid, chatbot_id, user_id'
	})

	onMount(async () => {
		if (!botName) {
			errorMessage = 'Bot name is missing in the URL'
			console.error('Error: Bot name is missing in the URL')
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
				// chatbotid = matchedBot.id
				// console.log('chatbotid asignado:', chatbotid)

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
				errorMessage = botData ? '' : `Bot con nombre ${botName} no encontrado.`
				if (botData) {
					chatbotid = botData.chatbot_id // Asigna chatbotid desde botData.chatbot_id
				}
			} else {
				errorMessage = `Bot con nombre ${botName} no encontrado.`
				console.warn(errorMessage)
			}
		} catch (error) {
			errorMessage = 'Error getting data from bot.'
			console.error('API call failed:', error)
		} finally {
			initialLoad = false
		}

		if (chatbotid) {
			await fetchPageIds(chatbotid, user_id)
		} else {
			console.warn('chatbotid is not defined. fetchPageIds will not be called.')
		}
	})

	async function fetchPageIds(chatbotid: string, user_id: string) {
		isLoading = true
		try {
			const allMessages = await db.messages.toArray()

			const pageDataArray = allMessages.filter(
				(message) => message.chatbot_id === chatbotid && message.user_id === user_id
			)

			if (pageDataArray.length === 0) {
				console.warn('No messages were found that match the filter')
			}

			// Ordena por fecha de forma descendente (más reciente primero)
			pageData = Array.from(
				new Map(pageDataArray.map((item) => [item.pageId, item])).values()
			).sort((a, b) => new Date(b.at) - new Date(a.at))

			// Actualizar `filteredPageData` después de ordenar
			filteredPageData = pageData.filter((data) =>
				data.query.toLowerCase().includes(searchTerm.toLowerCase())
			)
		} catch (error) {
			console.error('Error getting pageIds:', error)
		} finally {
			isLoading = false
		}
	}

	$: filteredPageData = pageData.filter((data) =>
		data.query.toLowerCase().includes(searchTerm.toLowerCase())
	)
	async function deletePageId(pageId: string) {
		try {
			if (!chatbotid) {
				console.warn('The chatbot ID is not defined.')
				return
			}
			await db.messages
				.where('pageId')
				.equals(pageId)
				.and((msg) => msg.chatbot_id === chatbotid)
				.delete()
			sendSuccessNotification('Chat deleted successfully')
			console.log('Calling fetchPageIds after deletion.')
			await fetchPageIds(chatbotid, user_id)
		} catch (error) {
			console.error('Error deleting pageId:', error)
		}
	}

	function formatDate(created_at) {
		const today = moment().startOf('day')
		const yesterday = moment().subtract(1, 'days').startOf('day')

		if (moment(created_at).isSame(today, 'day')) {
			return 'Today'
		} else if (moment(created_at).isSame(yesterday, 'day')) {
			return 'Yesterday'
		} else {
			return moment(created_at).format('DD MMM YYYY')
		}
	}

	let lastDate = ''

	function isDifferentDate(date) {
		const formattedDate = formatDate(date)
		if (formattedDate !== lastDate) {
			lastDate = formattedDate
			return true
		}
		return false
	}

	function navigateToPage(pageId) {
		if (!chatbotid) {
			console.warn('Chatbot ID is not defined. Unable to navigate.')
			return
		}
		goto(`/${botName}/${pageId}`)
	}

	let isSidebarOpen = false

	const toggleSidebar = () => {
		isSidebarOpen = !isSidebarOpen
	}

	// feature changer data.query
	let isEditingId = null // Almacena el ID de la página en edición
	let editQuery = '' // Almacena el valor temporal de `data.query` mientras se edita

	function startEditing(pageId, currentQuery) {
		isEditingId = pageId
		editQuery = currentQuery // Carga el valor actual de `query` en el campo de edición
	}

	async function saveEdit(pageId) {
		try {
			const updatedAt = new Date().toISOString()
			// Actualizar en Dexie
			await db.messages.where('pageId').equals(pageId).modify({ query: editQuery, at: updatedAt })

			// Actualizar el valor en `pageData` y `filteredPageData`
			const messageIndex = pageData.findIndex((msg) => msg.pageId === pageId)
			if (messageIndex !== -1) {
				pageData[messageIndex].query = editQuery
				pageData[messageIndex].at = updatedAt
			}

			// Reiniciar los estados de edición
			isEditingId = null
			editQuery = ''
			sendSuccessNotification('Name updated successfully')
		} catch (error) {
			console.error('Error updating name:', error)
		}

		pageData = pageData.sort((a, b) => new Date(b.at) - new Date(a.at))
		filteredPageData = filteredPageData.sort((a, b) => new Date(b.at) - new Date(a.at))
	}
</script>

<!-- Contenedor general -->
<div class="flex flex-col md:flex-row h-screen bg-black text-white">
	<!-- Botón para mostrar/ocultar el sidebar en versión móvil -->
	<div class="md:hidden p-4 bg-zinc-900 flex justify-between items-center">
		<a href="/{botName}" class="flex items-center">
			<img src="/troc.png" alt="" class="w-12 h-12" />
			<h1 class="text-xl font-bold ml-2">T-ROC Chatbots</h1>
		</a>
		<Button on:click={toggleSidebar} class="bg-zinc-800 p-2">
			<Menu class="h-6 w-6 text-white" />
		</Button>
	</div>

	<!-- Sidebar -->
	<div
		class={`w-full md:w-[350px] bg-zinc-900 p-4 flex flex-col transform md:transform-none ${isSidebarOpen ? 'block' : 'hidden md:flex'} z-10 transition-transform duration-300 ease-in-out md:static fixed inset-0`}
	>
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center w-full">
				<a href="/{botName}" class="flex justify-center items-center">
					<img src="/troc.png" alt="" class="w-12 h-12" />
					<h1 class="text-xl font-bold ml-2">T-ROC Chatbots</h1>
				</a>

				<!-- Botón alineado a la derecha -->
				<Button on:click={toggleSidebar} class="bg-zinc-800 p-2 md:hidden ml-auto">
					<Menu class="h-6 w-6 text-white" />
				</Button>
			</div>
		</div>

		<Button
			href="/{botName}"
			class="mb-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
		>
			<Plus class="h-4 w-4 mr-2" /> New Chat
		</Button>

		<div class="relative mb-4">
			<Search class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
			<Input
				placeholder="Search chats..."
				class="pl-8 bg-gray-800 border-gray-700 text-white"
				bind:value={searchTerm}
			/>
		</div>

		<nav class="space-y-6 flex-grow overflow-hidden">
			<div>
				<h2 class="text-sm font-semibold mb-2">List Chats</h2>
				<ScrollArea
					class="relative h-[calc(100vh-380px)] md:h-[calc(100vh-280px)] rounded-md border border-zinc-800 "
				>
					{#if isLoading}
						<LoaderCustom />

						loader
					{:else if filteredPageData.length == 0}
						<p class="absolute inset-0 flex justify-center items-center text-center text-gray-400">
							No chat found.
						</p>
					{:else}
						{#each filteredPageData.slice() as data}
							{#if isDifferentDate(data.at)}
								<div class="px-2 py-2 text-sm font-semibold text-gray-400">
									{formatDate(data.at)}
								</div>
							{/if}
							<div
								class="mx-1 hover:bg-gray-800 rounded-lg flex items-center justify-between group"
							>
								{#if isEditingId === data.pageId}
									<!-- Input en modo de edición -->
									<input
										type="text"
										bind:value={editQuery}
										class="bg-gray-800 text-white p-2 rounded-lg w-full"
										on:keydown={(e) => e.key === 'Enter' && saveEdit(data.pageId)}
									/>
								{:else}
									<!-- Vista normal del query -->
									<a
										href={`/${data.pageId}`}
										class="flex items-center w-full text-white dark:text-white group"
									>
										<div class="flex items-center space-x-3 overflow-hidden p-2 rounded-lg">
											<MessageSquare size={18} />
											<span class="text-sm truncate">
												{data.query.length > 25 ? `${data.query.slice(0, 25)}...` : data.query}
											</span>
										</div>
									</a>
								{/if}
								<DropdownMenu.Root>
									<DropdownMenu.Trigger>
										<Button variant="ghost" class="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
											<MoreVertical class="h-4 w-4" />
										</Button>
									</DropdownMenu.Trigger>
									<DropdownMenu.Content align="end" class="w-32">
										<DropdownMenu.Item on:click={() => startEditing(data.pageId, data.query)}>
											<Pencil class="mr-2 h-4 w-4" />
											<span>Change name</span>
										</DropdownMenu.Item>
										<DropdownMenu.Item on:click={() => deletePageId(data.pageId)}>
											<Trash2 class="mr-2 h-4 w-4" />
											<span>Delete</span>
										</DropdownMenu.Item>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</div>
						{/each}
					{/if}
				</ScrollArea>
			</div>
		</nav>

		<Separator class="my-4" />

		<div class="mt-auto">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<div class="flex items-center space-x-2 cursor-pointer hover:bg-zinc-800 p-2 rounded-lg">
						<Avatar.Root>
							<Avatar.Fallback class="bg-gray-600">
								{session.first_name[0] + session.last_name[0]}</Avatar.Fallback
							>
						</Avatar.Root>
						<div class="flex-grow">
							<p class="text-sm font-medium text-left">{session.first_name} {session.last_name}</p>
							<p class="text-xs text-gray-400">{session.email}</p>
						</div>
					</div>
				</DropdownMenu.Trigger>

				<DropdownMenu.Content class="w-56">
					<DropdownMenu.Group>
						<DropdownMenu.Item href="/bots" class="cursor-pointer">
							<Home class="mr-2 h-4 w-4" />
							<span>Home</span>
						</DropdownMenu.Item>

						<DropdownMenu.Item class="cursor-pointer">
							<LogOut class="mr-2 h-4 w-4" />
							<form action="/logout" method="POST" use:enhance>
								<button type="submit">
									<span>Logout</span>
								</button>
							</form>
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>

	<!-- Main Content -->
	<slot />
</div>
