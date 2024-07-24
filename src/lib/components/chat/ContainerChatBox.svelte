<script lang="ts">
	import BotMessage from './BotMessage.svelte'
	import LoadingMessageBot from './LoadingMessageBot.svelte'
	import LoadingMessage from './LoadingMessage.svelte'
	import QuestionMessage from './QuestionMessage.svelte'
	import WelcomeChat from './WelcomeChat.svelte'
	import { afterUpdate, onDestroy } from 'svelte'
	import { createEventDispatcher } from 'svelte'
	import { page } from '$app/stores'

	const dispatch = createEventDispatcher()

	export let handleRegenerate
	export let messages
	export let isLoading
	export let chatbotId
	export let good
	export let bad

	let bot = $page.params.bot
	let element: HTMLDivElement

	// Scroll al fondo después de cada actualización
	afterUpdate(() => {
		if (element) {
			scrollToBottom(element)
		}
	})

	function scrollToBottom(node: HTMLDivElement) {
		node.scroll({ top: node.scrollHeight, behavior: 'smooth' })
	}

	// function handleSelectQuery(event) {
	// 	dispatch('selectQuery', { query: event.detail.query })
	// }
</script>

<div
	class="flex flex-auto overflow-x-auto rounded-2xl bg-gray-100 chatbox dark:bg-gray-800 ml-2 mr-2"
>
	{#if messages && messages.length > 0}
		<div id="chat" class="w-full flex flex-col h-full">
			<div class="grid grid-cols-12 gap-y-2 overflow-auto" bind:this={element}>
				{#each messages as message, index}
					<QuestionMessage {message} />
					<BotMessage
						{message}
						{good}
						{bad}
						{chatbotId}
						on:scrollToBottom={() => scrollToBottom(element)}
						{handleRegenerate}
						last={index === messages.length - 1 ? 'true' : 'false'}
					/>
				{/each}

				{#if isLoading}
					<LoadingMessage />
					<LoadingMessageBot />
				{/if}
			</div>
		</div>
		<!-- {:else}
		<div class="flex flex-auto flex-col lg:justify-center">
			<div class="flex justify-center mt-2">
				<img src="/images/bots/{bot}.png" class="w-32 md:w-36" alt="{bot}-logo" />
			</div>
			<div class="">
				<WelcomeChat on:selectQuery={handleSelectQuery} {promptLibrary} />
			</div>
		</div> -->
	{/if}
</div>
