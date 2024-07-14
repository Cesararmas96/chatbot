<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	export let isLoading
	export let query = ''
	const dispatch = createEventDispatcher()

	const handleSubmit = (event: Event) => {
		event.preventDefault()
		dispatch('submit')
	}

	export function submitForm() {
		dispatch('submit')
	}
</script>

<form on:submit={handleSubmit} class="mr-2 ml-2">
	<div class="flex flex-row items-center h-16 rounded-xl w-full">
		<div class="flex-grow">
			<div class="relative">
				<input
					placeholder="Send a message."
					type="text"
					disabled={isLoading}
					bind:value={query}
					class="dark:text-white text-sm md:text-base dark:bg-gray-800 flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-10 h-10 {isLoading
						? 'bg-gray-200 cursor-not-allowed opacity-50'
						: ''}"
				/>
				<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					{#if isLoading}
						<i class="fa-solid fa-spinner animate-spin text-gray-400"></i>
					{:else}
						<i class="fas fa-search text-gray-400"></i>
					{/if}
				</div>
			</div>
		</div>
		<div class="ml-4">
			<button
				disabled={isLoading}
				type="submit"
				class="flex items-center justify-center bg-pink-600 hover:bg-pink-700 rounded-full text-white px-3 py-3 flex-shrink-0 {isLoading
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
