<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { storeUser } from '$lib/stores/session.js'
	import { storeBots } from '$lib/stores/bots'
	import { storePromptLibrary } from '$lib/stores/promptlibrary'
	import { storeGood } from '$lib/stores/good.js'

	import { fetchChatData } from '$lib/services/chatService'
	import ChatInput from '$lib/components/chat/ChatInput.svelte'
	import ContainerChatBox from '$lib/components/chat/ContainerChatBox.svelte'
	// import SelectBots from "$lib/components/chat/SelectBots.svelte";
	// import SelectLlm from "$lib/components/chat/SelectLlm.svelte";
	// import Fab from "$lib/components/chat/Fab.svelte";
	// import FloatingActionButton from "$lib/components/chat/FloatingActionButton.svelte";
	// import SettingModal from "$lib/components/chat/SettingModal.svelte";
	import { DarkMode } from 'flowbite-svelte'
	import SelectBots from '$lib/components/chat/SelectBots.svelte'
	import SidebarBot from '$lib/components/SidebarBot.svelte'
	import Header from '$lib/components/chat/Header.svelte'

	export let data

	const { user, bots, promptLibrary, good } = data
	storeUser.set(user)
	storeBots.set(bots)
	storePromptLibrary.set(promptLibrary)
	storeGood.set(good)

	// let botss = bots.chatbot_id
	// console.log(botss)

	// console.log(promptLibrary)
	// console.log(good)

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

	onMount(() => {
		bot = $page.params.bot
		shared = $page.url.searchParams.get('shared') === 'true'
		hidebot = $page.url.searchParams.get('hidebot') === 'true'
		hidellm = $page.url.searchParams.get('hidellm') === 'true'
		const lastChatHistory = getChatHistory()
		if (lastChatHistory) {
			messages = [{ chat_history: lastChatHistory }]
		}

		// bots.forEach(({ chatbot_id, name }) => {
		// 	console.log('Chatbot ID:', chatbot_id, 'Name:', name)
		// })

		const currentBot = bots.find((b) => b.name.toLowerCase() === bot)

		if (currentBot) {
			chatbotId = currentBot.chatbot_id
			// console.log('Current chatbot_id:', chatbotId)
		} else {
			console.error('Bot not found')
		}

		console.log(chatbotId)
	})

	const handleFetchData = async (lastQuery = '') => {
		isLoading = true
		try {
			const { response, question, answer, chat_history } = await fetchChatData(
				bot,
				query || lastQuery
			)
			messages = [
				...messages,
				{ text: response, query: query, answer: answer, chat_history: chat_history }
			]
			// saveChatHistory(messages.map(message => message.chat_history))
			saveChatHistory(chat_history)
			query = ''
			console.log(messages)
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

	function handleSelectQuery(event) {
		query = event.detail.query
		console.log('Selected Query:', query), chatInputRef.submitForm()
	}
</script>

<div class="sm:ml-64">
	<Header />
	<div class="flex flex-row h-full w-full overflow-x-hidden">
		{#if !shared}
			<SidebarBot />
		{/if}
		<div class="flex flex-col h-screen flex-auto p-2">
			<div class="flex justify-between px-2 py-2">
				<SelectBots {bots} />
				<DarkMode class="inline-block dark:hover:text-white hover:text-gray-900" />
			</div>
			<ContainerChatBox
				{isLoading}
				{messages}
				{promptLibrary}
				{chatbotId}
				{handleRegenerate}
				on:selectQuery={handleSelectQuery}
			/>
			<ChatInput {isLoading} bind:query on:submit={handleSubmit} bind:this={chatInputRef} />
		</div>
	</div>
</div>

<!-- <FloatingActionButton on:click={toggleSettings} /> -->
<!-- <div class="flex justify-between px-2 py-2">
	<SelectBots/>
	<DarkMode class="inline-block dark:hover:text-white hover:text-gray-900" />
</div>
<ContainerChatBox {isLoading} {messages} {handleRegenerate} />
<ChatInput {isLoading} bind:query on:submit={handleSubmit} /> -->
<!-- {#if showSettings}
<SettingModal on:close={toggleSettings} />
{/if} -->
