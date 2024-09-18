<script>
	import { onMount } from 'svelte'
	import { getApiData } from '$lib/services/getData'
	import * as Card from '$lib/components/ui/card/index.js'
	import { Badge } from '$lib/components/ui/badge/index.js'
	import { Bot, Circle } from 'lucide-svelte'

	// Loading state variables
	let isLoading = false
	let bots = []

	// User authentication token
	export let data
	const { user } = data
	let token = user.token

	// Function to handle click events on links
	function handleClick(event) {
		isLoading = true // Set loading state when a link is clicked
	}

	// Function to fetch bots data from the API
	const fetchBots = async () => {
		isLoading = true // Set loading state during data fetching
		const apiUrl = `${import.meta.env.VITE_API_AI_URL}/api/v1/bots`
		try {
			const fetchedBots = await getApiData(
				apiUrl,
				'GET',
				{},
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				},
				null,
				true
			)

			bots = fetchedBots.sort((a, b) => a.name.localeCompare(b.name))
		} catch (error) {
			console.error('There was a problem with the fetch operation:', error)
		} finally {
			isLoading = false // Reset loading state after fetching
		}
	}

	// Fetch bots data when the component is mounted
	onMount(() => {
		fetchBots()
	})
</script>

<!-- Show loader if data is still loading -->
<!-- {#if isLoading}
	<div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
		<div class="loader"></div>
	</div>
{/if} -->

<!-- Display list of bots -->
<ul class="grid grid-cols-2 gap-4 p-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
	{#each bots as bot}
		<a href="/{bot.name.toLowerCase()}" class="dark:text-gray-200" on:click={handleClick}>
			<Card.Root class="overflow-hidden transition-all hover:shadow-md bg-white dark:bg-gray-700">
				<Card.Header class="pb-2">
					<div class="flex items-center space-x-4">
						<div class="w-12 h-12">
							<img
								src={`/images/bots/${bot.name.toLowerCase() ? bot.name.toLowerCase() : 'default'}.png`}
								alt={bot.name}
							/>
						</div>
						<div>
							<Card.Title class="text-lg">{bot.name}</Card.Title>
							<Badge variant="outline" class="mt-1">
								<Circle class="w-3 h-3 mr-1" />
								<span class="text-xs">{bot.enabled === 'true' ? 'Disable' : 'Active'}</span>
							</Badge>
						</div>
					</div>
				</Card.Header>
				<Card.Content>
					<p class="text-sm text-muted-foreground mb-4">
						{bot.description}
					</p>
					<Badge variant="outline" class="flex items-center w-fit">
						<Bot class="w-3 h-3 mr-1" />
						{bot.bot_type}
					</Badge>
				</Card.Content>
			</Card.Root>
		</a>
	{/each}
</ul>
