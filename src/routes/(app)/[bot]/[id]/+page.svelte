<script lang="ts">
	import { onMount } from 'svelte'
	import { storeUser } from '$lib/stores/session.js'
	import { storeBots } from '$lib/stores/bots'
	import { storeGood } from '$lib/stores/good.js'
	import { storeBad } from '$lib/stores/bad.js'
	import { storeChatbotid } from '$lib/stores/chatbotid'
	import { fetchChatData } from '$lib/services/chatService'
	import { db } from '$lib/db'
	import Header from '$lib/components/chat/Header.svelte'
	import ContainerChatBox from '$lib/components/chat/ContainerChatBox.svelte'
	import SidebarBot from '$lib/components/SidebarBot.svelte'
	import { DarkMode } from 'flowbite-svelte'
	import ChatInput from '$lib/components/chat/ChatInput.svelte'
	import { page } from '$app/stores'
	import { sharedBot } from '$lib/stores/preferences.js'

	export let data
	let isLoading = false
	const { user, bots, good, bad, chatbotid } = data
	storeChatbotid.set(chatbotid)
	storeUser.set(user)
	storeBots.set(bots)
	storeGood.set(good)
	storeBad.set(bad)
	let messages: any[] = []
	let query = ''
	let bot = ''
	let chatInputRef: any
	let chatbotId = ''
	let user_id = user.user_id

	onMount(async () => {
		bot = $page.params.bot
		const currentBot = bots.find((b) => b.name.toLowerCase() === bot)
		if (currentBot) {
			chatbotId = currentBot.chatbot_id
		} else {
			console.error('Bot not found')
		}

		// Guardar usuario y bot en IndexedDB
		const userExists = await db.users.where('userId').equals(user.user_id).count()
		if (!userExists) {
			await db.users.add({ userId: user.user_id, name: user.name })
		}

		const botExists = await db.bots.where('botId').equals(chatbotId).count()
		if (!botExists) {
			await db.bots.add({ botId: chatbotId, userId: user.user_id })
		}

		// Obtener el pageId de la URL actual
		const pageUrl = $page.url.pathname
		const storedMessages = await db.messages.where('pageId').equals(pageUrl).toArray()

		if (storedMessages.length > 0) {
			messages = storedMessages.map((msg) => ({
				text: msg.text,
				query: msg.query,
				answer: msg.answer,
				chat_history: msg.chat_history,
				sid: msg.sid,
				user_id: msg.user_id,
				chatbot_id: msg.chatbot_id
			}))
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

			const pageUrl = $page.url.pathname
			await db.messages.add({ ...newMessage, pageId: pageUrl })
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

	function handleSelectQuery(event: CustomEvent<{ query: string }>) {
		query = event.detail.query
		chatInputRef.submitForm()
	}
</script>

<div class="sm:ml-64">
	{#if !$sharedBot}
		<Header />
	{/if}
	<div class="flex flex-row h-full overflow-x-hidden">
		{#if !$sharedBot}
			<SidebarBot {chatbotid} {user_id} />
		{/if}

		<div class="flex flex-col h-screen flex-auto p-2 w-20">
			{#if !$sharedBot}
				<div class="flex justify-end px-2 py-2">
					<DarkMode class="inline-block dark:hover:text-white hover:text-gray-900" />
				</div>
			{/if}

			<ContainerChatBox {isLoading} {messages} {chatbotId} {good} {bad} {handleRegenerate} />
			<ChatInput bind:query on:submit={handleSubmit} bind:this={chatInputRef} {isLoading} />
		</div>
	</div>
</div>
