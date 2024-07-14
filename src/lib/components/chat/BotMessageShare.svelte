<script lang="ts">
	import { marked, options } from 'marked'
	import { createEventDispatcher } from 'svelte'
	import { convert } from 'html-to-text'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import Typewriter, { cascade, concurrent } from 'svelte-typewriter'
	import { page } from '$app/stores'
	let bot = $page.params.bot
	let botName = $page.url.searchParams.get('botName')

	const dispatch = createEventDispatcher()

	export let message

	let copied = false
	let clipboard = marked(message.text)

	clipboard = convert(clipboard, options)

	function copyToClipboard() {
		navigator.clipboard
			.writeText(clipboard)
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

	// Montar typewriter
	let phrase = marked(message.text)
	// console.log(phrase)
	let typedChars = ''
	let index = 0

	const typeChar = () => {
		typedChars += phrase[index]
		index += 1
	}

	const typing = () => setInterval(typeChar, 100)
	typing()
</script>

<div class="col-start-1 col-end-8 p-3 rounded-lg">
	<div class="flex flex-row">
		<div class="flex items-center justify-center h-10 w-10 rounded-full flex-shrink-0">
			<img src="/images/bots/{bot}.png" alt="logo" />
		</div>
		<div class="flex flex-col">
			<div
				class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl dark:bg-gray-600 dark:text-white"
			>
				<!-- <div use:concurrent={{ interval: 30 }} data-static> -->
				{@html marked(message.text)}
				<!-- </div> -->

				<!-- {@html (typedChars)} -->

				<div class="flex justify-end mt-5 mb-2">
					<button class="mr-4" on:click={copyToClipboard} title="Copy">
						<svg
							width="17"
							height="17"
							class="svg actions"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 448 512"
							><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
								d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z"
							/></svg
						>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.svg.actions {
		fill: rgb(85, 85, 85);
	}

	.svg.actions:hover {
		fill: rgb(47, 47, 47);
	}

	/* .active {
		fill: #025399 !important;
	} */
</style>
