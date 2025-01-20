<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { SendHorizontal, Loader } from 'lucide-svelte'
	import { Input } from '$lib/components/ui/input/index.js'
	import { page } from '$app/stores'

	export let isLoading = false // Estado de carga desde el padre
	const dispatch = createEventDispatcher()
	export let query = ''

	export function submitQuery() {
		if (!isLoading && query.trim() !== '') {
			dispatch('submit', { query })
		}
	}

	const handleSubmit = (event: Event) => {
		event.preventDefault()
		submitQuery()
	}

	let shared = $page.url.searchParams.get('shared') === 'true'
</script>

<form class="flex items-center mt-1" on:submit|preventDefault={handleSubmit}>
	<Input
		name="message"
		placeholder="Send a message"
		class="w-full 
			
			'bg-white border-gray-300 text-blue-900 pr-20 "
		disabled={isLoading}
		bind:value={query}
		autofocus
		required
	/>
	<div class="absolute right-4 flex items-center gap-2">
		{#if isLoading}
			<!-- Mostrar Loader mientras isLoading es true -->
			<Loader class="h-4 w-4 animate-spin" />
		{:else}
			<!-- Botón de tipo button para controlar el submit sin recargas -->
			<button
				type="button"
				size="icon"
				variant="ghost"
				on:click={handleSubmit}
				disabled={isLoading}
				class=" h-8 w-8
					
					bg-blue-600 hover:bg-blue-700 transition-colors rounded-sm flex justify-center items-center"
			>
				<SendHorizontal class="h-4 w-4 text-white" />
			</button>
		{/if}
	</div>
</form>
