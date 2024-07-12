<script lang="ts">
	import { NameChatBot } from '../../helpers/commons'
	import { page } from '$app/stores'
	import { createEventDispatcher } from 'svelte'

	export let promptLibrary: any
	export let chatbotId: any
	const dispatch = createEventDispatcher()
	let bot = $page.params.bot
	let botName = $page.url.searchParams.get('botName')

	function getNameChatBot(name: string, nameChatBotObj: typeof NameChatBot): string {
		return nameChatBotObj[name as keyof typeof NameChatBot] ?? ''
	}

	function handleItemClick(query) {
		dispatch('selectQuery', { query })
	}

	console.log(promptLibrary)
</script>

<div class="flex flex-col justify-center items-center w-full h-full">
	<img src="/images/bots/{bot}.png" class="w-32 md:w-36" alt="{bot}-logo" />

	<!-- <h2 class="font-bold md:text-lg dark:text-white text-sm">
			Welcome Back to {getNameChatBot(bot, NameChatBot) !== ''
				? getNameChatBot(bot, NameChatBot)
				: botName} Chatbot
		</h2>
		<p class="text-gray-500 md:text-base text-xs">How can I help you today?</p> -->
	<div class="flex mt-10">
		{#each promptLibrary as item}
			{#if item.chatbot_id === chatbotId}
				<div
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
									<!-- <Icon icon={module?.attributes?.icon} size="15" /> -->
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
										><path
											fill="currentColor"
											d="M12 22q-.825 0-1.412-.587T10 20h4q0 .825-.587 1.413T12 22m-4-3v-2h8v2zm.25-3q-1.725-1.025-2.738-2.75T4.5 9.5q0-3.125 2.188-5.312T12 2t5.313 2.188T19.5 9.5q0 2.025-1.012 3.75T15.75 16zm.6-2h6.3q1.125-.8 1.738-1.975T17.5 9.5q0-2.3-1.6-3.9T12 4T8.1 5.6T6.5 9.5q0 1.35.613 2.525T8.85 14M12 14"
										/></svg
									>
								</span>
							</span>
						</div>
						<h2 class="relative z-10 text-left text-sm font-semibold">
							{item.title}
						</h2>
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>
