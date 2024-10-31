<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { SendHorizontal, Loader } from 'lucide-svelte'
	import { Input } from '$lib/components/ui/input/index.js'

	export let isLoading = false // Estado de carga desde el padre
	const dispatch = createEventDispatcher()
	let query = ''

	// Manejador de envío de formulario con prevención de recarga
	const handleSubmit = (event: Event) => {
		event.preventDefault() // Prevenir el comportamiento de recarga
		if (!isLoading && query.trim() !== '') {
			// Solo dispara el evento si hay texto en el input
			dispatch('submit', { query }) // Enviar el query actual al padre
		}
	}
</script>

<form class="flex items-center" on:submit|preventDefault={handleSubmit}>
	<Input
		name="message"
		placeholder="Send a message"
		class="w-full border-gray-800 pr-20"
		disabled={isLoading}
		bind:value={query}
		autofocus
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
			>
				<SendHorizontal class="h-4 w-4" />
			</button>
		{/if}
	</div>
</form>
