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
	import { storeChatbotname } from '$lib/stores/chatbotname'
	import { fetchChatData } from '$lib/services/chatService'
	import ChatInput from '$lib/components/chat/ChatInput.svelte'
	import { DarkMode } from 'flowbite-svelte'
	import SelectBots from '$lib/components/chat/SelectBots.svelte'
	import SidebarBot from '$lib/components/SidebarBot.svelte'
	import Header from '$lib/components/chat/Header.svelte'
	import WelcomeChat from '$lib/components/chat/WelcomeChat.svelte'
	import { db } from '$lib/db'

	export let data

	const { user, bots, promptLibrary, good, bad, chatbotid, chatbotname } = data
	storeUser.set(user)
	storeBots.set(bots)
	storePromptLibrary.set(promptLibrary)
	storeGood.set(good)
	storeBad.set(bad)
	storeChatbotid.set(chatbotid)
	storeChatbotname.set(chatbotname)
	console.log(chatbotname)

	let isLoading = false
	let messages: any[] = []
	let query = ''
	let bot = ''
	let nombre = ''
	let shared = false
	let showSettings = false
	let chatInputRef: any
	let uuid = ''
	let user_id = user.user_id
	let chatbotId
	onMount(() => {
		let nombre = $page.params.bot
		sessionStorage.setItem('chatbotname', data.chatbotname)

		const currentBot = bots.find((b) => b.name.toLowerCase() === bot)
		if (currentBot) {
			chatbotId = currentBot.chatbot_id
		} else {
			console.error('Bot not found')
		}
	})

	console.log(chatbotname)

	const handleFetchData = async (lastQuery = '') => {
		isLoading = true
		try {
			const { response, question, answer, chat_history, sid, at } = await fetchChatData(
				chatbotname,
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

	console.log(promptLibrary)
</script>

<div class="sm:ml-64">
	<Header />
	<div class="flex flex-row h-full overflow-x-hidden">
		{#if !shared}
			<SidebarBot {chatbotid} {user_id} />
		{/if}
		<div class="flex flex-col h-screen flex-auto p-2 w-20">
			<div class="flex justify-end px-2 py-2">
				<!-- <SelectBots {bots} /> -->
				<DarkMode class="inline-block dark:hover:text-white hover:text-gray-900 " />
			</div>

			<div
				class="flex flex-auto overflow-x-auto rounded-2xl bg-gray-100 chatbox dark:bg-gray-800 ml-2 mr-2"
			>
				<div class="flex flex-auto flex-col lg:justify-center">
					<div class="flex justify-center mt-2">
						<img
							src={`/images/bots/${nombre.toLowerCase() ? nombre.toLowerCase() : 'default'}.png`}
							class="w-32 md:w-36"
							alt="{nombre}-logo"
						/>
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
