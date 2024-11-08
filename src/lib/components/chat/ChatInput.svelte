<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { SendHorizontal, Loader } from 'lucide-svelte'
	import { Input } from '$lib/components/ui/input/index.js'

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
</script>

<form class="flex items-center" on:submit|preventDefault={handleSubmit}>
	<Input
		name="message"
		placeholder="Send a message"
		class="w-full bg-gray-800 border-gray-700 text-white  pr-20 "
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
				class=" h-8 w-8 bg-purple-600 hover:bg-purple-700 transition-colors rounded-sm flex justify-center items-center"
			>
				<SendHorizontal class="h-4 w-4 text-white" />
			</button>
		{/if}
	</div>
</form>
