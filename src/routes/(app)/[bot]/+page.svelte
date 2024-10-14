<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'
	import { v4 as uuidv4 } from 'uuid'
	import { storeUser } from '$lib/stores/session.js'
	import { storeBots } from '$lib/stores/bots'
	import { storePromptLibrary } from '$lib/stores/promptlibrary'
	import { storeGood } from '$lib/stores/good'
	import { storeBad } from '$lib/stores/bad'
	import { storeChatbotid } from '$lib/stores/chatbotid'
	import { fetchChatData } from '$lib/services/chatService'
	import ChatInput from '$lib/components/chat/ChatInput.svelte'
	import { DarkMode } from 'flowbite-svelte'
	import SidebarBot from '$lib/components/SidebarBot.svelte'
	import Header from '$lib/components/chat/Header.svelte'
	import WelcomeChat from '$lib/components/chat/WelcomeChat.svelte'
	import { db } from '$lib/db'
	import { sharedBot } from '$lib/stores/preferences.js'

	import { Input } from '$lib/components/ui/input/index.js'
	import * as Card from '$lib/components/ui/card/index.js'
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js'
	import * as Avatar from '$lib/components/ui/avatar/index.js'
	import { Button } from '$lib/components/ui/button/index.js'
	import {
		Home,
		LogOut,
		MoreVertical,
		MessageSquare,
		Trash2,
		Plus,
		Search,
		Mic,
		ChevronUp,
		Menu
	} from 'lucide-svelte'

	export let data

	const { user, bots, promptLibrary, good, bad, chatbotid } = data
	storeUser.set(user)
	storeBots.set(bots)
	storePromptLibrary.set(promptLibrary)
	storeGood.set(good)
	storeBad.set(bad)
	storeChatbotid.set(chatbotid)

	let isLoading = false
	let messages: any[] = []
	let query = ''
	let bot = ''
	let shared = $page.url.searchParams.get('shared') === 'true'
	let showSettings = false
	let chatInputRef: any
	let uuid = ''
	let user_id = user.user_id
	let chatbotId

	sharedBot.set(shared)

	onMount(() => {
		bot = $page.params.bot
		const currentBot = bots.find((b) => b.name.toLowerCase() === bot)
		if (currentBot) {
			chatbotId = currentBot.chatbot_id
		} else {
			console.error('Bot not found')
		}
	})

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

	// Estado para manejar si el sidebar está visible
	let isSidebarOpen = false

	// Función para alternar la visibilidad del sidebar
	const toggleSidebar = () => {
		isSidebarOpen = !isSidebarOpen
	}
</script>

<!-- <div class:sm:ml-64={!shared}>
	<Header />
	<div class="flex flex-row h-full overflow-x-hidden">
		{#if !shared}
			<SidebarBot {chatbotid} {user_id} />
		{/if}
		<div class="flex flex-col h-screen flex-auto p-2 w-20">
			{#if !shared}
				<div class="flex justify-end px-2 py-2">
					<SelectBots {bots} />
					<DarkMode class="inline-block dark:hover:text-white hover:text-gray-900 " />
				</div>
			{/if}
			<div
				class="flex flex-auto overflow-x-auto rounded-2xl bg-gray-100 chatbox dark:bg-gray-800 ml-2 mr-2"
			>
				<div class="flex flex-auto flex-col lg:justify-center">
					<div class="flex justify-center mt-2">
						<img src="/images/bots/{bot}.png" class="w-32 md:w-36" alt="{bot}-logo" />
					</div>
					<div class="">
						<WelcomeChat on:selectQuery={handleSelectQuery} {promptLibrary} />
					</div>
				</div>
			</div>

			<ChatInput {isLoading} bind:query on:submit={handleSubmit} bind:this={chatInputRef} />
		</div>
	</div>
</div> -->
<div class="flex flex-col md:flex-row h-screen bg-black text-white">
	<!-- Mobile header with button to toggle sidebar -->
	<div class="md:hidden p-4 bg-zinc-900 flex justify-between items-center">
		<a href="/video" class="flex items-center">
			<img src="/troc.png" alt="" class="w-12 h-12" />
			<h1 class="text-xl font-bold ml-2">T-ROC Chatbots</h1>
		</a>
		<Button on:click={toggleSidebar} class="bg-zinc-800 p-2">
			<Menu class="h-6 w-6 text-white" />
		</Button>
	</div>

	<!-- Sidebar section -->
	<SidebarBot {chatbotid} {user_id} {isSidebarOpen} {toggleSidebar} />

	<!-- Main content section -->
	<div class="flex-1 flex flex-col min-h-0 h-full p-5 bg-zinc-900">
		<Card.Root class="flex flex-col flex-1">
			<Card.Content class="flex-1 flex flex-col justify-between">
				<div class="flex-1 flex flex-col items-center justify-center">
					<div class="w-full max-w-2xl">
						<header class="text-center mb-8">
							<div class="flex items-center justify-center gap-3 mb-2">
								<Avatar.Root class="h-10 w-10">
									<Avatar.Image src="/placeholder-avatar.jpg" alt="AI" />
									<Avatar.Fallback>AI</Avatar.Fallback>
								</Avatar.Root>
								<h1 class="text-2xl font-bold">OpenAI / GPT 4</h1>
							</div>
							<p class="text-xl text-gray-400">How can I help you today?</p>
						</header>
						<div class="mb-8">
							<h2 class="text-sm font-semibold text-gray-400 mb-3 text-center">Suggested</h2>
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{#each promptLibrary as item}
									<Card.Root
										class="bg-[#1E1E1E] border-gray-800 hover:bg-[#2A2A2A] transition-colors"
									>
										<Card.Content class="p-4 flex items-center justify-between">
											<div>
												<h3 class="font-semibold">{item.title}</h3>
											</div>
										</Card.Content>
									</Card.Root>
								{/each}
							</div>
						</div>
					</div>
				</div>
				<div class="p-6">
					<div class="max-w-2xl mx-auto">
						<div class="relative">
							<form class="flex items-center">
								<Button type="button" size="icon" variant="ghost" class="absolute left-4">
									<Plus class="h-4 w-4" />
								</Button>
								<Input
									name="message"
									placeholder="Send a message"
									class="w-full bg-[#1E1E1E] border-gray-800 pl-12 pr-20"
								/>
								<div class="absolute right-4 flex items-center gap-2">
									<Button type="button" size="icon" variant="ghost">
										<Mic class="h-4 w-4" />
									</Button>
									<Button type="submit" size="icon" variant="ghost">
										<ChevronUp class="h-4 w-4" />
									</Button>
								</div>
							</form>
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
