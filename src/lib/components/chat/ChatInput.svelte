<script lang="ts">
	import { createEventDispatcher, onMount, afterUpdate } from 'svelte'
	import { Plus, Mic, ChevronUp, SendHorizontal } from 'lucide-svelte'
	import { Button } from '$lib/components/ui/button/index.js'
	import { Input } from '$lib/components/ui/input/index.js'

	export let isLoading
	export let query = ''
	const dispatch = createEventDispatcher()

	let answerInput: HTMLInputElement

	const handleSubmit = (event: Event) => {
		event.preventDefault()
		dispatch('submit')
		setFocus()
	}

	onMount(() => {
		setFocus()
	})

	function setFocus() {
		if (answerInput && !isLoading) {
			answerInput.focus()
		}
	}

	export function submitForm() {
		dispatch('submit')
	}

	afterUpdate(() => {
		setFocus() // Asegura el foco después de cualquier actualización
	})
</script>

<!-- <form on:submit={handleSubmit} class="mr-2 ml-2">
	<div class="flex flex-row items-center h-16 rounded-xl w-full md:auto">
		<div class="flex-grow">
			<div class="relative">
				<input
					placeholder="Send a message."
					type="text"
					disabled={isLoading}
					bind:this={answerInput}
					bind:value={query}
					class="dark:text-white text-sm md:text-base dark:bg-gray-800 flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-10 h-10 {isLoading
						? 'bg-gray-200 cursor-not-allowed opacity-50'
						: ''}"
					on:load={() => setFocus()}
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
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 32 32">
						<path
							fill="currentColor"
							d="m27.45 15.11l-22-11a1 1 0 0 0-1.08.12a1 1 0 0 0-.33 1L7 16L4 26.74A1 1 0 0 0 5 28a1 1 0 0 0 .45-.11l22-11a1 1 0 0 0 0-1.78m-20.9 10L8.76 17H18v-2H8.76L6.55 6.89L24.76 16Z"
						/>
					</svg>
				</span>
			</button>
		</div>
	</div>
</form> -->

<form class="flex items-center" on:submit={handleSubmit}>
	<!-- <Plus class="h-4 w-4" /> -->
	<Input
		disabled={isLoading}
		bind:this={answerInput}
		bind:value={query}
		on:load={() => setFocus()}
		name="message"
		placeholder="Send a message"
		class="w-full bg-[#1E1E1E] border-gray-800  pr-20"
	/>
	<div class="absolute right-4 flex items-center gap-2">
		<Button type="submit" size="icon" variant="ghost" disabled={isLoading}>
			<SendHorizontal class="h-4 w-4" />
		</Button>
	</div>
</form>
