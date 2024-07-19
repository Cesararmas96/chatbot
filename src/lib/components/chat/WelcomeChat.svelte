<script lang="ts">
	import { NameChatBot } from '../../helpers/commons'
	import { page } from '$app/stores'
	import { createEventDispatcher } from 'svelte'

	export let promptLibrary: any

	const dispatch = createEventDispatcher()

	let bot = $page.params.bot
	let botName = $page.url.searchParams.get('botName')

	function getNameChatBot(name: string, nameChatBotObj: typeof NameChatBot): string {
		return nameChatBotObj[name as keyof typeof NameChatBot] ?? ''
	}

	function handleItemClick(query: string) {
		dispatch('selectQuery', { query })
	}
</script>

<div class="flex flex-col justify-center items-center w-full h-full">
	<img src="/images/bots/{bot}.png" class="w-32 md:w-36" alt="{bot}-logo" />

	{#if !promptLibrary}
		<h2 class="font-bold md:text-lg dark:text-white text-sm">
			Welcome Back to {getNameChatBot(bot, NameChatBot) !== ''
				? getNameChatBot(bot, NameChatBot)
				: botName} Chatbot
		</h2>
		<p class="text-gray-500 md:text-base text-xs">How can I help you today?</p>
	{:else}
		<div class="flex mt-10">
			{#each promptLibrary as item}
				<button
					class="card promptlibrary {getNameChatBot(bot, NameChatBot).toLocaleLowerCase() !== ''
						? getNameChatBot(bot, NameChatBot).toLocaleLowerCase()
						: botName}  m-2 col-span-2 flex cursor-pointer overflow-hidden rounded-lg hover:-translate-y-1 hover:scale-100 hover:shadow-lg md:col-span-3 lg:col-span-4"
					on:click={() => handleItemClick(item.query)}
				>
					<div class="relative flex h-full w-48 flex-col p-3 hover:opacity-90">
						<div class="relative z-10 mb-3 self-start">
							<span
								class="flex h-7 w-7 items-center justify-center rounded-full border border-white"
							>
								<span class="align-center flex justify-center text-white">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="currentColor"
										width="20"
										height="20"
										viewBox="0 0 32 32"
										><path
											fill="currentColor"
											d="M11 24h10v2H11zm2 4h6v2h-6zm3-26A10 10 0 0 0 6 12a9.19 9.19 0 0 0 3.46 7.62c1 .93 1.54 1.46 1.54 2.38h2c0-1.84-1.11-2.87-2.19-3.86A7.2 7.2 0 0 1 8 12a8 8 0 0 1 16 0a7.2 7.2 0 0 1-2.82 6.14c-1.07 1-2.18 2-2.18 3.86h2c0-.92.53-1.45 1.54-2.39A9.18 9.18 0 0 0 26 12A10 10 0 0 0 16 2"
										/></svg
									>
								</span>
							</span>
						</div>
						<h2 class="relative z-10 text-left text-sm font-semibold">
							{item.title}
						</h2>
					</div>
				</button>
			{/each}
		</div>
	{/if}
</div>
