<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { storeUser } from '$lib/stores/session.js'
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
	import SidebarBot from "$lib/components/SidebarBot.svelte";
	import Header from "$lib/components/chat/Header.svelte";

	export let data
	const { user } = data
	storeUser.set(user)

	let isLoading = false
	let messages: any[] = []
	let query = ''
	let bot = ''
	let shared = false
	let hidebot = false
	let hidellm = false
	let llm = ''
	let showSettings = false

	onMount(() => {
		bot = $page.params.bot.toString()
		shared = $page.url.searchParams.get('shared') === 'true'
		hidebot = $page.url.searchParams.get('hidebot') === 'true'
		hidellm = $page.url.searchParams.get('hidellm') === 'true'
		llm = $page.url.searchParams.get('llm') || 'vertex'
	})

	const handleFetchData = async (lastQuery = '') => {
		isLoading = true
		try {
			const { answer, question } = await fetchChatData(bot, llm, query || lastQuery)
			messages = [...messages, { text: answer, query: question }]
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

	const handleSelectChange = (event: CustomEvent) => {
		llm = event.detail.value
	}

	const toggleSettings = () => {
		showSettings = !showSettings
	}

	const handleRegenerate = async (lastquery: string) => {
		await handleFetchData(lastquery)
	}
</script>


<div class="sm:ml-64 ">
	<Header />
	 <div class="flex flex-row h-full w-full overflow-x-hidden">
		{#if !shared}
		  <SidebarBot />
		{/if}
		<div class="flex flex-col h-screen  flex-auto p-2 " >
		 
			<div class="flex justify-between px-2 py-2">
				<SelectBots/>
				<DarkMode class="inline-block dark:hover:text-white hover:text-gray-900" />
			</div>
			<ContainerChatBox {isLoading} {messages} {handleRegenerate} />
			<ChatInput {isLoading} bind:query on:submit={handleSubmit} />
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
