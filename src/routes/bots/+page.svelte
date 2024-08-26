<script>
	import { onMount } from 'svelte'
	import { getApiData } from '$lib/services/getData'
	import * as Card from '$lib/components/ui/card/index.js'
	import { storeBots } from '$lib/stores/bots'

	export let data
	$storeBots = data.bots.sort((a, b) => a.name.localeCompare(b.name))
</script>

<ul class="grid grid-cols-2 gap-4 p-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
	{#each $storeBots as bot}
		<a href="/{bot.name.toLowerCase()}" class="dark:text-gray-200">
			<Card.Root class="flex flex-col justify-center items-center">
				<Card.Header>
					<Card.Title tag="h6">{bot.name}</Card.Title>
				</Card.Header>
				<Card.Content>
					<img
						src="/images/bots/{bot.name.toLowerCase()}.png"
						alt="img-{name}-logo"
						class="h-auto w-full rounded-md object-cover object-center img-logo"
					/>
				</Card.Content>
			</Card.Root>
		</a>
	{/each}
</ul>
