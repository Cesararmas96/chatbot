<script lang="ts">
	import BotMessage from '$lib/components/chat/BotMessage.svelte'
	import BotMessageShare from '$lib/components/chat/BotMessageShare.svelte'
	import QuestionMessage from '$lib/components/chat/QuestionMessage.svelte'
	import { Button } from 'flowbite-svelte'

	import { createEventDispatcher, onMount } from 'svelte'
	import { getApiData, postData } from '$lib/services/getData'
	import { storeShare } from '$lib/stores/share.js'
	import { DarkMode } from 'flowbite-svelte'
	import ContainerChatBoxShare from '$lib/components/chat/ContainerChatBoxShare.svelte'
	import { page } from '$app/stores' // Importa la variable `page`
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'

	let feedbackReasons: string[] = []
	export let data
	const { share } = data
	storeShare.set(share)
	let message = share
	let copied = false

	const date = new Date(message.at) // Convertir timestamp a Date object
	const options = {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		hour12: true
	}
	const formattedDate = date.toLocaleString('en-US', options)

	// Construir la URL dinámica
	const currentUrl = $page.url
	const newUrl = `${currentUrl.origin}${currentUrl.pathname}` // Suponiendo que `message.chatbot` es el valor a añadir

	function copyToClipboard() {
		navigator.clipboard
			.writeText(newUrl)
			.then(() => {
				copied = true
				sendSuccessNotification('Answer copied to the clickboard successfully')

				setTimeout(() => {
					copied = false
				}, 2000)
			})
			.catch((error) => {
				sendErrorNotification(error)
			})
	}

	// console.log(message)
</script>

<div class="">
	<div class="flex flex-row h-full w-full overflow-x-hidden">
		<div class="flex flex-col h-screen flex-auto p-2 ml-5 mr-5">
			<!-- <div class="flex justify-between px-2 py-2">
		  <DarkMode class="inline-block dark:hover:text-white hover:text-gray-900" />
		</div> -->
			<h2 class="text-xl font-bold ml-2 mt-5 mb-2">
				{message.question}
			</h2>
			<div class="ml-2">
				<a href={newUrl} target="_blank">{newUrl}</a>
				<button class="mr-4" on:click={copyToClipboard} title="Copy">
					<svg
						width="20"
						height="20"
						class="svg actions"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 448 512"
						><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
							d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z"
						/></svg
					>
				</button>
			</div>
			<div class="ml-2 mt-2 mb-5">
				<p><span class="font-bold">It was created with:</span> Bot</p>
				<p><span class="font-bold">Share: </span> {formattedDate}</p>
			</div>
			<ContainerChatBoxShare {message} />
			<a href={`${currentUrl.origin}/auth`} class="w-full flex justify-center mt-4 mb-3">
				<Button
					color="blue"
					class="w-1/6 rounded bg-blue-600 text-sm font-semibold text-white shadow-xl hover:bg-blue-700 focus:outline-none"
					type="submit">Login</Button
				>
			</a>
		</div>
	</div>
</div>
