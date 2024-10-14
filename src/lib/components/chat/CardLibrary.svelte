<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import * as Card from '$lib/components/ui/card/index.js'
	import { Lightbulb } from 'lucide-svelte'
	export let item

	const dispatch = createEventDispatcher()

	function handleItemClick(query: string) {
		dispatch('selectQuery', { query })
	}
</script>

<button on:click={() => handleItemClick(item.query)}>
	<Card.Root class="bg-[#1E1E1E] border-gray-800 hover:bg-[#2A2A2A] transition-colors">
		<Card.Content class="p-4 flex flex-col items-center justify-between">
			<Lightbulb class="mb-2" />
			<h3 class="font-semibold">{item.title}</h3>
		</Card.Content>
	</Card.Root>
</button>
