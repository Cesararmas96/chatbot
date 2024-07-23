<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { storeUser } from '$lib/stores/session.js'
	import { storeBots } from '$lib/stores/bots'
	import { storePromptLibrary } from '$lib/stores/promptlibrary'
	import { storeGood } from '$lib/stores/good.js'
	import { storeBad } from '$lib/stores/bad.js'
	import { storefeedback } from '$lib/stores/feedback.js'

	import { fetchChatData } from '$lib/services/chatService'
	import ChatInput from '$lib/components/chat/ChatInput.svelte'
	import ContainerChatBox from '$lib/components/chat/ContainerChatBox.svelte'
	import { DarkMode } from 'flowbite-svelte'
	import SelectBots from '$lib/components/chat/SelectBots.svelte'
	import SidebarBot from '$lib/components/SidebarBot.svelte'
	import Header from '$lib/components/chat/Header.svelte'

	// uid
	import { goto } from '$app/navigation'
	import { v4 as uuidv4 } from 'uuid'

	import { addChat, getChat, updateChat } from '$lib/db.js'

	export let data

	const { user, bots, promptLibrary, good, bad, feedback } = data
	storeUser.set(user)
	storeBots.set(bots)
	storePromptLibrary.set(promptLibrary)
	storeGood.set(good)
	storeBad.set(bad)
	storefeedback.set(feedback)
	let isLoading = false
	let messages: any[] = []
	let query = ''
	let bot = ''
	let shared = false
	let hidebot = false
	let hidellm = false
	let llm = ''
	let showSettings = false
	let chatInputRef: any
	let chatbotId = ''
	let chatId: number

	onMount(async () => {
		bot = $page.params.bot
		shared = $page.url.searchParams.get('shared') === 'true'
		hidebot = $page.url.searchParams.get('hidebot') === 'true'
		hidellm = $page.url.searchParams.get('hidellm') === 'true'
		const lastChatHistory = getChatHistory()
		if (lastChatHistory) {
			messages = [{ chat_history: lastChatHistory }]
		}

		const currentBot = bots.find((b) => b.name.toLowerCase() === bot)
		if (currentBot) {
			chatbotId = currentBot.chatbot_id
		} else {
			console.error('Bot not found')
		}

		const newChat = {
			chatbot_id: chatbotId,
			user_id: user.id,
			messages: []
		}

		chatId = await addChat(newChat)
	})

	const handleFetchData = async (lastQuery = '') => {
		isLoading = true
		try {
			const { response, question, answer, chat_history, sid } = await fetchChatData(
				bot,
				query || lastQuery
			)

			messages = [
				...messages,
				{ text: response, query: query, answer: answer, chat_history: chat_history, sid: sid }
			]

			const chatToUpdate = await getChat(chatId)
			chatToUpdate.question = question
			chatToUpdate.response = response
			chatToUpdate.sid = sid
			chatToUpdate.chatbot_id = chatbotId
			chatToUpdate.user_id = user.id

			await updateChat(chatId, chatToUpdate)

			saveChatHistory(chat_history)
			query = ''

			// Navegar a una nueva URL con el UID del chat
			const newUid = sid // Usa el SID como nuevo UID en la URL
			goto(`/bosebot/${uuidv4()}`)
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

	const handleSelectChange = (event: CustomEvent) => {
		llm = event.detail.value
	}

	const toggleSettings = () => {
		showSettings = !showSettings
	}

	const handleRegenerate = async (lastquery: string) => {
		await handleFetchData(lastquery)
	}

	const saveChatHistory = (chatHistory: any) => {
		localStorage.setItem('chatHistory', JSON.stringify(chatHistory))
	}

	const getChatHistory = (): any => {
		const history = localStorage.getItem('chatHistory')
		return history ? JSON.parse(history) : null
	}

	function handleSelectQuery(event: CustomEvent<{ query: string }>) {
		query = event.detail.query
		chatInputRef.submitForm()
	}
</script>

<div class="sm:ml-64">
	<Header />
	<div class="flex flex-row h-full overflow-x-hidden">
		{#if !shared}
			<SidebarBot />
		{/if}
		<div class="flex flex-col h-screen flex-auto p-2 w-20">
			<div class="flex justify-between px-2 py-2">
				<SelectBots {bots} />
				<DarkMode class="inline-block dark:hover:text-white hover:text-gray-900" />
			</div>

			<ContainerChatBox
				{isLoading}
				{messages}
				{promptLibrary}
				{chatbotId}
				{good}
				{bad}
				{handleRegenerate}
				on:selectQuery={handleSelectQuery}
			/>
			<ChatInput {isLoading} bind:query on:submit={handleSubmit} bind:this={chatInputRef} />
		</div>
	</div>
</div>
