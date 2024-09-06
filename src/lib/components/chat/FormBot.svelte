<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { writable } from 'svelte/store'
	import { ApiChatBot } from '$lib/helpers/commons'
	import { getApiData } from '$lib/services/getData.js'
	import { storeUser } from '$lib/stores/session.js'

	import { isLoading, queryMessage } from '$lib/stores/loading'
	let loadingState = ''
	isLoading.subscribe((value) => {
		loadingState = value
	})

	let query = ''
	queryMessage.subscribe((value) => {
		query = value
	})

	//   export let data;
	const { user } = data

	storeUser.set(user)

	// let isLoading = writable(false);
	const bot = $page.params.bot.toString()
	let token = user?.token
	let messages: any[] = []

	const dispatch = createEventDispatcher()

	const handleSubmit = (event: Event) => {
		event.preventDefault()
		dispatch('submit')
	}

	const fetchData = async (lastquery = '') => {
		isLoading.update(true)

		const apiUrl = `${import.meta.env.VITE_API_AI_URL}/${ApiChatBot[bot as keyof typeof ApiChatBot]}?use_llm=${llm}`
		try {
			const { answer, question } = await getApiData(
				apiUrl,
				'POST',
				{ query: $query || lastquery },
				{},
				{
					headers: {
						'Content-Type': 'application/json'
					}
				},
				null,
				true
			)

			messages = [...messages, { text: answer, query: question }]
			query.set('')
		} catch (error) {
			console.error('There was a problem with the fetch operation:', error)
		} finally {
			// isLoading.set(false);
		}
	}

	const handleRegenerate = async (lastquery: string) => {
		await fetchData(lastquery)
	}

	//   const handleSubmit = async () => {
	//     await fetchData();
	//   };
</script>

<!-- <form on:submit={handleSubmit}> -->
<form>
	<div class="flex flex-row items-center h-16 rounded-xl w-full">
		<div class="flex-grow">
			<div class="relative">
				<input
					placeholder="Send a mesddddsage."
					type="text"
					disabled={loadingState}
					bind:value={$query}
					class="dark:text-white dark:bg-gray-800 flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-10 h-10 {loadingState
						? 'bg-gray-200 cursor-not-allowed opacity-50'
						: ''}"
				/>

				<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					{#if loadingState}
						<i class="fa-solid fa-spinner animate-spin text-gray-400"></i>
					{:else}
						<i class="fas fa-search text-gray-400"></i>
					{/if}
				</div>
			</div>
		</div>
		<div class="ml-4">
			<button
				disabled={loadingState}
				type="submit"
				class="flex items-center justify-center bg-pink-600 hover:bg-pink-700 rounded-full text-white px-3 py-3 flex-shrink-0 {loadingState
					? 'bg-gray-200 cursor-not-allowed opacity-50'
					: ''}"
			>
				<span>
					<svg
						class="w-4 h-4 transform rotate-45 -mt-px"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
						></path>
					</svg>
				</span>
			</button>
		</div>
	</div>
</form>
