<script lang="ts">
	import Card from '$lib/components/home/Card.svelte'
	import { storeBots } from '$lib/stores/bots'

	export let data
	$storeBots = data.bots.sort((a, b) => a.name.localeCompare(b.name))
</script>

<ul class="grid grid-cols-2 gap-4 p-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
	<div
		class="flex justify-center animate__animated animate__zoomIn card cursor-pointer p-6 hover:-translate-y-1 hover:scale-100 hover:shadow-lg border border-gray-500 dark:bg-gray-700 rounded-md"
	>
		<a href="/bots/new" class="dark:text-gray-200">
			<img
				src="/images/bots/add.png"
				alt="img-add-logo"
				class="h-auto w-full rounded-md object-cover object-center img-logo"
			/>

			<div class="mb-2 mt-6">
				<h3 class="tracki text-center text-lg font-semibold uppercase">Create Bot</h3>
			</div>
		</a>
	</div>
	{#each $storeBots as bot}
		<Card namebot={bot.name} name={bot.name} />
	{/each}
</ul>
