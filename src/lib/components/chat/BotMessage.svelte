<script lang="ts">
	import { marked, options } from 'marked'
	import { createEventDispatcher } from 'svelte'
	import BotMessageDislike from './BotMessageDislike.svelte'
	import BotMessageLike from './BotMessageLike.svelte'
	import { convert } from 'html-to-text'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import Typewriter, { cascade, concurrent } from 'svelte-typewriter'
	import { page } from '$app/stores'
	let bot = $page.params.bot
	let botName = $page.url.searchParams.get('botName')

	const dispatch = createEventDispatcher()

	export let handleRegenerate
	export let message
	export let last
	export let good
	export let bad

	let copied = false
	let dislike = false
	let like = false
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

	const handleDislike = () => {
		dislike = true
		like = false
		setTimeout(() => {
			dispatch('scrollToBottom')
		}, 100)
	}

	const handleLike = () => {
		like = true
		dislike = false
		setTimeout(() => {
			dispatch('scrollToBottom')
		}, 100)
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
					{#if last === 'true'}
						<button
							class="mr-4"
							on:click={() => handleRegenerate(message.query)}
							title="Regenerate"
						>
							<svg
								width="17"
								height="17"
								class="svg actions"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 448 512"
								><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
									d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H352c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V80c0-17.7-14.3-32-32-32s-32 14.3-32 32v35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V432c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H160c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"
								/></svg
							>
						</button>
					{/if}

					<span>
						<button title="Like" class="mr-4 button" on:click={handleLike}>
							<svg
								class="svg actions {like ? 'active' : ''}"
								width="17"
								height="17"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 512 512"
								><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
									d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.2s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16H286.5c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8H384c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32V448c0 17.7 14.3 32 32 32H96c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32H32z"
								/></svg
							>
						</button>
					</span>

					<button title="Dislike" class="mr-4" on:click={handleDislike}>
						<svg
							class="svg actions {dislike ? 'active' : ''}"
							width="17"
							height="17"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
							><path
								d="M323.8 477.2c-38.2 10.9-78.1-11.2-89-49.4l-5.7-20c-3.7-13-10.4-25-19.5-35l-51.3-56.4c-8.9-9.8-8.2-25 1.6-33.9s25-8.2 33.9 1.6l51.3 56.4c14.1 15.5 24.4 34 30.1 54.1l5.7 20c3.6 12.7 16.9 20.1 29.7 16.5s20.1-16.9 16.5-29.7l-5.7-20c-5.7-19.9-14.7-38.7-26.6-55.5c-5.2-7.3-5.8-16.9-1.7-24.9s12.3-13 21.3-13L448 288c8.8 0 16-7.2 16-16c0-6.8-4.3-12.7-10.4-15c-7.4-2.8-13-9-14.9-16.7s.1-15.8 5.3-21.7c2.5-2.8 4-6.5 4-10.6c0-7.8-5.6-14.3-13-15.7c-8.2-1.6-15.1-7.3-18-15.2s-1.6-16.7 3.6-23.3c2.1-2.7 3.4-6.1 3.4-9.9c0-6.7-4.2-12.6-10.2-14.9c-11.5-4.5-17.7-16.9-14.4-28.8c.4-1.3 .6-2.8 .6-4.3c0-8.8-7.2-16-16-16H286.5c-12.6 0-25 3.7-35.5 10.7l-61.7 41.1c-11 7.4-25.9 4.4-33.3-6.7s-4.4-25.9 6.7-33.3l61.7-41.1c18.4-12.3 40-18.8 62.1-18.8H384c34.7 0 62.9 27.6 64 62c14.6 11.7 24 29.7 24 50c0 4.5-.5 8.8-1.3 13c15.4 11.7 25.3 30.2 25.3 51c0 6.5-1 12.8-2.8 18.7C504.8 238.3 512 254.3 512 272c0 35.3-28.6 64-64 64l-92.3 0c4.7 10.4 8.7 21.2 11.8 32.2l5.7 20c10.9 38.2-11.2 78.1-49.4 89zM32 384c-17.7 0-32-14.3-32-32V128c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H32z"
							/></svg
						>
					</button>

					<button title="share" class="mr-4">
						<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
							><path
								fill="currentColor"
								d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81c1.66 0 3-1.34 3-3s-1.34-3-3-3s-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65c0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92M18 4c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1M6 13c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1m12 7.02c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1"
							/></svg
						>
						>
					</button>
				</div>
			</div>

			{#if like}
				<BotMessageLike {message} {good} on:close={() => (like = false)} />
			{:else if dislike}
				<BotMessageDislike {message} {bad} on:close={() => (dislike = false)} />
			{/if}
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

	.active {
		fill: #025399 !important;
	}
</style>
