<script lang="ts">
	import { onMount } from 'svelte'
	import moment from 'moment'
	import Dexie from 'dexie'

	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'

	import * as Avatar from '$lib/components/ui/avatar/index.js'
	import { Input } from '$lib/components/ui/input/index.js'
	import { Button } from '$lib/components/ui/button/index.js'
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Separator } from '$lib/components/ui/separator/index.js'

	import LoaderCustom from './common/LoaderCustom.svelte'
	import { sendSuccessNotification } from '$lib/stores/toast'

	import {
		Home,
		LogOut,
		MoreVertical,
		MessageSquare,
		Trash2,
		Plus,
		Search,
		Menu,
		Loader
	} from 'lucide-svelte'

	let searchTerm = ''
	export let chatbotid
	export let session
	export let isSidebarOpen
	export let toggleSidebar

	let user_id = session.user_id
	let isLoading = false
	let botName = $page.params.bot

	// Configuración de la base de datos Dexie
	const db = new Dexie('ChatDB')
	db.version(1).stores({
		users: '++id, &userId, name',
		bots: '++id, &botId, userId',
		messages: '++id, pageId, text, query, answer, chat_history, sid, chatbot_id, user_id'
	})

	let pageData = []

	// Función para obtener mensajes asociados a un chatbot y usuario
	async function fetchPageIds(chatbotid, user_id) {
		isLoading = true
		try {
			const allMessages = await db.messages.toArray()

			const pageDataArray = allMessages.filter(
				(message) => message.chatbot_id === chatbotid && message.user_id === user_id
			)

			if (pageDataArray.length === 0) {
				console.warn('No se encontraron mensajes que coincidan con el filtro')
			}

			pageData = Array.from(new Map(pageDataArray.map((item) => [item.pageId, item])).values())
		} catch (error) {
			console.error('Error fetching pageIds:', error)
		} finally {
			isLoading = false
		}
	}

	// Filtrar resultados según el término de búsqueda
	$: filteredPageData = pageData.filter((data) =>
		data.query.toLowerCase().includes(searchTerm.toLowerCase())
	)

	onMount(() => {
		fetchPageIds(chatbotid, user_id)
	})

	// Función para eliminar un pageId
	async function deletePageId(pageId: string) {
		try {
			await db.messages.where('pageId').equals(pageId).delete()
			sendSuccessNotification('Chat deleted successfully')
			await fetchPageIds(chatbotid, user_id)
		} catch (error) {
			console.error('Error deleting pageId:', error)
		}
	}

	// Formatear fechas para mostrar en el sidebar
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

	// Navegación a la página específica de chat
	function navigateToPage(pageId) {
		goto(`/${botName}/${pageId}`)
	}
</script>

<div
	class={`w-full md:w-64 bg-zinc-900 p-4 flex flex-col transform md:transform-none ${isSidebarOpen ? 'block' : 'hidden md:flex'} z-10 transition-transform duration-300 ease-in-out md:static fixed inset-0`}
>

	<div class="flex items-center justify-between mb-4">
		<div class="flex items-center w-full">
			<a href="/home" class="flex justify-center items-center">
				<img src="/troc.png" alt="" class="w-12 h-12" />
				<h1 class="text-xl font-bold ml-2">T-ROC Chatbots</h1>
			</a>
			<Button on:click={toggleSidebar} class="bg-zinc-800 p-2 md:hidden ml-auto">
				<Menu class="h-6 w-6 text-white" />
			</Button>
		</div>
	</div>

	<Button class="mb-4 bg-white text-gray-900 hover:bg-gray-200">
		<Plus class="mr-2 h-4 w-4" />
		New Chat
	</Button>

	<div class="mb-4">
		<div class="relative">
			<Search class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
			<Input
				placeholder="Search chats..."
				class="pl-8 bg-gray-800 border-gray-700 text-white"
				bind:value={searchTerm}
			/>
		</div>
	</div>

	<nav class="space-y-6 flex-grow overflow-hidden">
		<div>
			<h2 class="text-sm font-semibold mb-2">List Chats</h2>
			<ScrollArea
				class="relative h-[calc(100vh-380px)] md:h-[calc(100vh-280px)] rounded-md border border-zinc-800"
			>
				{#if isLoading}
					<LoaderCustom />
				{:else if filteredPageData.length == 0}
					<p class="absolute inset-0 flex justify-center items-center text-center text-gray-400">
						No chat found.
					</p>
				{:else}
					{#each filteredPageData.slice().reverse() as data}
						{#if isDifferentDate(data.at)}
							<div class="px-2 py-2 text-sm font-semibold text-gray-400">{formatDate(data.at)}</div>
						{/if}
						<div class="hover:bg-gray-800 rounded-lg flex items-center justify-between group">
							<a
								href={`/${botName}/${data.pageId}`}
								class="flex items-center w-full text-white dark:text-white group"
							>
								<div class="flex items-center space-x-3 overflow-hidden p-2 rounded-lg">
									<MessageSquare size={18} />
									<span class="text-sm truncate">
										{data.query.length > 25 ? `${data.query.slice(0, 25)}...` : data.query}
									</span>
								</div>
							</a>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<Button
										variant="ghost"
										size="icon"
										class="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
									>
										<MoreVertical size={18} />
									</Button>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="end" class="w-32">
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
							{session.first_name[0]}{session.last_name[0]}
						</Avatar.Fallback>
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
