<script lang="ts">
	import { NameChatBot } from '../../helpers/commons'
	import { page } from '$app/stores'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()
	let bot = $page.params.bot
	let botName = $page.url.searchParams.get('botName')

	function getNameChatBot(name: string, nameChatBotObj: typeof NameChatBot): string {
		return nameChatBotObj[name as keyof typeof NameChatBot] ?? ''
	}

	let library = [
		{
			prompt_id: '03ff97d0-b3bf-4718-bd68-231cb8196f29',
			chatbot_id: '97449bd3-42da-474e-82d6-d1fd42c7adaf',
			title: 'Info about T-ROC and relatives',
			query: 'is T-ROC hiring relatives?',
			description: null,
			prompt_category: 'explain',
			prompt_tags: [],
			created_at: '2024-07-11 15:25:33.372212+00:00',
			created_by: 35,
			updated_at: '2024-07-11 15:25:33.372231+00:00'
		},
		{
			prompt_id: 'a243a5a0-f2d1-45ca-b830-c9458baba350',
			chatbot_id: '97449bd3-42da-474e-82d6-d1fd42c7adaf',
			title: 'Performance Evaluation at T-ROC',
			query: 'How is performance evaluated at T-ROC?',
			description: null,
			prompt_category: 'explain',
			prompt_tags: [],
			created_at: '2024-07-11 16:09:45.468667+00:00',
			created_by: 35,
			updated_at: '2024-07-11 16:09:45.468685+00:00'
		},
		{
			prompt_id: 'a59312cb-d914-4a05-a7b9-570c98af0d82',
			chatbot_id: '97449bd3-42da-474e-82d6-d1fd42c7adaf',
			title: 'Opportunities for Advancement at T-ROC',
			query: 'Are there opportunities for advancement at T-ROC?',
			description: null,
			prompt_category: 'explain',
			prompt_tags: [],
			created_at: '2024-07-11 16:12:10.302410+00:00',
			created_by: 35,
			updated_at: '2024-07-11 16:12:10.302429+00:00'
		},
		{
			prompt_id: 'a107ecae-05a5-4b33-b6b2-861951398c11',
			chatbot_id: '97449bd3-42da-474e-82d6-d1fd42c7adaf',
			title: 'Work Hours Expectations at T-ROC',
			query: 'What are the expectations in terms of work hours at T-ROC?',
			description: null,
			prompt_category: 'explain',
			prompt_tags: [],
			created_at: '2024-07-11 16:13:01.903169+00:00',
			created_by: 35,
			updated_at: '2024-07-11 16:13:01.903188+00:00'
		},
		{
			prompt_id: '4d053902-c382-4c73-8c25-365e7a8abfe2',
			chatbot_id: '97449bd3-42da-474e-82d6-d1fd42c7adaf',
			title: 'Process for Requesting Time Off at T-ROC',
			query: 'What is the process for requesting time off at T-ROC?',
			description: null,
			prompt_category: 'explain',
			prompt_tags: [],
			created_at: '2024-07-11 16:13:40.824093+00:00',
			created_by: 35,
			updated_at: '2024-07-11 16:13:40.824114+00:00'
		}
	]

	function handleItemClick(query) {
		dispatch('selectQuery', { query })
	}
</script>

<div class="flex flex-col justify-center items-center w-full h-full">
	<img src="/images/bots/{bot}.png" class="w-32 md:w-36" alt="{bot}-logo" />
	<!-- <h2 class="font-bold md:text-lg dark:text-white text-sm">
		Welcome Back to {getNameChatBot(bot, NameChatBot) !== ''
			? getNameChatBot(bot, NameChatBot)
			: botName} Chatbot
	</h2> -->
	<!-- <p class="text-gray-500 md:text-base text-xs">How can I help you today?</p> -->

	<div class="flex">
		{#each library as item}
			<div
				class="card m-2 col-span-2 flex cursor-pointer overflow-hidden rounded-lg hover:-translate-y-1 hover:scale-100 hover:shadow-lg md:col-span-3 lg:col-span-4"
				on:click={() => handleItemClick(item.query)}
			>
				<div
					class="relative flex h-full w-48 flex-col p-3 hover:opacity-90 bg-blue-400 border-blue-800"
				>
					<div class="relative z-10 mb-3 self-start">
						<span class="flex h-7 w-7 items-center justify-center rounded-full border border-white">
							<span class="align-center flex justify-center text-white">
								<!-- <Icon icon={module?.attributes?.icon} size="15" /> -->
							</span>
						</span>
					</div>
					<h2 class="relative z-10 text-left text-sm font-semibold">
						{item.title}
					</h2>
				</div>
			</div>
		{/each}
	</div>
</div>
