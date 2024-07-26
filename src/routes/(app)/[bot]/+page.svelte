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
	import SelectBots from '$lib/components/chat/SelectBots.svelte'
	import SidebarBot from '$lib/components/SidebarBot.svelte'
	import Header from '$lib/components/chat/Header.svelte'
	import WelcomeChat from '$lib/components/chat/WelcomeChat.svelte'

	export let data

	const { user, bots, promptLibrary, good, bad, chatbotid } = data
	storeUser.set(user)
	storeBots.set(bots)
	storePromptLibrary.set(promptLibrary)
	storeGood.set(good)
	storeBad.set(bad)
	storeChatbotid.set(chatbotid)
	// storefeedback.set(feedback)

	let isLoading = false
	let messages: any[] = []
	let query = ''
	let bot = ''
	let shared = false
	let showSettings = false
	let chatInputRef: any
	let uuid = ''
	let user_id = user.user_id
	let chatbotId
	console.log(`est${chatbotid}`)
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
			const { response, question, answer, chat_history, sid } = await fetchChatData(
				bot,
				query || lastQuery
			)
			messages = [
				...messages,
				{ text: response, query: query, answer: answer, chat_history: chat_history, sid: sid }
			]
			query = ''
			if (!uuid) {
				uuid = uuidv4()
				// Guardar los datos en localStorage
				localStorage.setItem('messages', JSON.stringify(messages))
				// localStorage.setItem('chatbotId', chatbotId)
				// localStorage.setItem('good', good)
				// localStorage.setItem('bad', bad)
				goto(`/${bot}/${uuid}`)
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

<div class="sm:ml-64">
	<Header />
	<div class="flex flex-row h-full overflow-x-hidden">
		{#if !shared}
			<SidebarBot {chatbotid} {user_id} />
		{/if}
		<div class="flex flex-col h-screen flex-auto p-2 w-20">
			<div class="flex justify-between px-2 py-2">
				<SelectBots {bots} />
				<DarkMode class="inline-block dark:hover:text-white hover:text-gray-900" />
			</div>

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
</div>
