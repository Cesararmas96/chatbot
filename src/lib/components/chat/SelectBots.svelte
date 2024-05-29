<script lang="ts">
	import { writable } from 'svelte/store'
	import { onMount, onDestroy } from 'svelte'
	import { NameChatBot } from '../../helpers/commons'
	import { page } from '$app/stores'

	let bot = $page.params.bot
	let botName = $page.url.searchParams.get('botName')

	const selectedBot = writable(bot)
	const showOptions = writable(false)

	function handleSelect(key: string) {
		selectedBot.set(key)
		showOptions.set(false)
		location.href = key // Redirect to the selected bot's page
	}

	function handleClickOutside(event: MouseEvent) {
		if (!(event.target as HTMLElement).closest('.custom-select')) {
			showOptions.set(false)
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside)
	})

	onDestroy(() => {
		document.removeEventListener('click', handleClickOutside)
	})
</script>

<div class="flex items-center">
	<div class="relative inline-block text-left custom-select">
		<div>
			<button
				type="button"
				class="inline-flex   justify-center w-full rounded-md px-4 py-2 bg-white text-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
				on:click={() => showOptions.update((n) => !n)}
			>
				{#if $selectedBot && NameChatBot[$selectedBot]}
					{NameChatBot[$selectedBot]} Chatbot
				{:else}
					Select a Chatbot
				{/if}
				<svg
					class="-mr- ml-2 h-5 w-5 mt-1"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>

		{#if $showOptions}
			<div
				class="absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 dark:bg-gray-600 "
			>
				<div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
					{#each Object.keys(NameChatBot) as key}
						<button
							class="block px-4 py-2 text-sm text-gray-700 dark:text-white black:hover:bg-gray-500 w-full text-left hover:bg-slate-400 hover:text-white"
							role="menuitem"
							on:click={() => handleSelect(key)}
						>
							{NameChatBot[key]} Chatbot
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
