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
	import { X } from 'lucide-svelte'

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

	let showMessage = true

	function closeMessage() {
		showMessage = false
	}
</script>

<div class:sm:ml-64={!shared}>
	<Header />
	<div class="flex flex-row h-full overflow-x-hidden">
		{#if !shared}
			<SidebarBot {chatbotid} {user_id} />
		{/if}
		<div class="flex flex-col h-screen flex-auto p-2 w-20">
			{#if !shared}
				<div class="flex justify-end px-2 py-2">
					<DarkMode class="inline-block dark:hover:text-white hover:text-gray-900" />
				</div>
			{/if}

			{#if showMessage && bot === 'askbuddy'}
				<div class="w-full" id="mensaje">
					<div class="relative">
						<div
							class="bg-yellow-50 dark:bg-gray-800 text-yellow-800 dark:text-yellow-300 rounded-lg border border-yellow-300 dark:border-yellow-800 divide-yellow-300 dark:divide-yellow-800 p-4 gap-3 text-sm animate__animated animate__fadeIn mb-2 ml-[5px] mr-[12px] px-4 py-2"
							role="alert"
						>
							<div class="flex flex-col justify-between">
								<div class="flex flex-col items-start justify-center">
									<div class="flex items-center gap-3 text-lg font-medium">
										<span class="dark:text-gray-300">Disclaimer</span>
									</div>
									<p class="mb-2 mt-2 text-base dark:text-gray-400">
										The MSO AskBuddy Bot is designed to support MSO employees by providing quick
										access to training materials, guides, and step-by-step resources that have been
										covered during your training. This bot will not duplicate or replace the
										information available on C2 (T-Mobile operations) or the TROC Hub. If you need
										further assistance, please contact your team lead or refer to the specific
										resources on the respective platforms.
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

			<div id="widget-content-bottom-7a0f1182-7d3b-49a2-b1a5-6ac187209930"></div>

			<div
				class="flex flex-auto overflow-x-auto rounded-2xl bg-gray-100 chatbox dark:bg-gray-800 ml-2 mr-2"
			>
				<div class="flex flex-auto flex-col lg:justify-center items-center">
					<div class="flex justify-center mt-2">
						<img src="/images/bots/{bot}.png" class="w-32 md:w-36" alt="{bot}-logo" />
					</div>

					<div class="flex justify-center">
						<WelcomeChat on:selectQuery={handleSelectQuery} {promptLibrary} />
					</div>
				</div>
			</div>

			<ChatInput {isLoading} bind:query on:submit={handleSubmit} bind:this={chatInputRef} />
		</div>
	</div>
</div>
