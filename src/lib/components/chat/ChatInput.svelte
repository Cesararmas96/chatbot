<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { SendHorizontal } from 'lucide-svelte'
	import { Input } from '$lib/components/ui/input/index.js'

	export let isLoading = false
	const dispatch = createEventDispatcher()
	let query = ''

	// Modificamos el handleSubmit para incluir el query en el evento
	const handleSubmit = (event: Event) => {
		event.preventDefault()
		dispatch('submit', { query }) // Asegura que query se pase en el evento
		query = '' // Limpiar el input después de enviar
	}
</script>

<form class="flex items-center" on:submit={handleSubmit}>
	<Input
		name="message"
		placeholder="Send a message"
		class="w-full border-gray-800 pr-20"
		disabled={isLoading}
		bind:value={query}
		autofocus
	/>
	<div class="absolute right-4 flex items-center gap-2">
		<button type="submit" size="icon" variant="ghost" disabled={isLoading}>
			<SendHorizontal class="h-4 w-4" />
		</button>
	</div>
</form>
