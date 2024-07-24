<script lang="ts">
	import { onMount } from 'svelte'
	import { storeGood } from '$lib/stores/good.js'
	import { storeBad } from '$lib/stores/bad.js'
	import { storeUser } from '$lib/stores/session.js'
	import { storeBots } from '$lib/stores/bots'
	import { page } from '$app/stores'
	import Header from '$lib/components/chat/Header.svelte'
	import ContainerChatBox from '$lib/components/chat/ContainerChatBox.svelte'
	import SidebarBot from '$lib/components/SidebarBot.svelte'
	import { DarkMode } from 'flowbite-svelte'
	import ChatInput from '$lib/components/chat/ChatInput.svelte'
	import { fetchChatData } from '$lib/services/chatService'

	export let data
	let isLoading = false

	const { user, bots, good, bad } = data
	storeUser.set(user)
	storeBots.set(bots)
	storeGood.set(good)
	storeBad.set(bad)
	let messages: any[] = []
	let query = ''
	let bot = ''
	let chatInputRef: any
	let chatbotId = ''

	onMount(() => {
		bot = $page.params.bot
		// shared = $page.url.searchParams.get('shared') === 'true'
		// hidebot = $page.url.searchParams.get('hidebot') === 'true'
		// hidellm = $page.url.searchParams.get('hidellm') === 'true'
		// const lastChatHistory = getChatHistory()
		// if (lastChatHistory) {
		// 	messages = [{ chat_history: lastChatHistory }]
		// }

		const currentBot = bots.find((b) => b.name.toLowerCase() === bot)

		if (currentBot) {
			chatbotId = currentBot.chatbot_id
		} else {
			console.error('Bot not found')
		}

		messages = JSON.parse(localStorage.getItem('messages') || '[]')
		// good = localStorage.getItem('good') || good
		// bad = localStorage.getItem('bad') || ''
		// const handleRegenerateString = localStorage.getItem('handleRegenerate') || ''
		// handleRegenerate = new Function('return ' + handleRegenerateString)()
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
			// saveChatHistory(messages.map(message => message.chat_history))
			saveChatHistory(chat_history)
			query = ''
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
	console.log(messages)
</script>

<div class="sm:ml-64">
	<Header />
	<div class="flex flex-row h-full overflow-x-hidden">
		<SidebarBot />
		<div class="flex flex-col h-screen flex-auto p-2 w-20">
			<div class="flex justify-between px-2 py-2">
				<DarkMode class="inline-block dark:hover:text-white hover:text-gray-900" />
			</div>

			<ContainerChatBox {isLoading} {messages} {chatbotId} {good} {bad} {handleRegenerate} />
			<ChatInput bind:query on:submit={handleSubmit} bind:this={chatInputRef} {isLoading} />
		</div>
	</div>
</div>
