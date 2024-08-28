<script>
	import { onMount } from 'svelte'
	import { getApiData } from '$lib/services/getData'
	import * as Card from '$lib/components/ui/card/index.js'
	import { Badge } from '$lib/components/ui/badge/index.js'
	import { storeBots } from '$lib/stores/bots'
	import { Bot } from 'lucide-svelte'
	import { Circle } from 'lucide-svelte'
	export let data

	$storeBots = data.bots.sort((a, b) => a.name.localeCompare(b.name))

	import axios from 'axios'

	let datos = []
	let loading = false
	let error = null

	const token =
		'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MjUxMjg1MzEuMzYyMzc1LCJpYXQiOjE3MjQ3Njg1MzEsImlzcyI6Ik1vYmlsZWluc2lnaHQiLCJ1c2VyIjozNjA4NSwidXNlcm5hbWUiOiJjYXJtYXNAdHJvY2dsb2JhbC5jb20iLCJ1c2VyX2lkIjozNjA4NSwiaWQiOiJjYXJtYXNAdHJvY2dsb2JhbC5jb20iLCJzZXNzaW9uX2lkIjoiZGY1NjgxODYxMjY2NDExZTk3NjZmNzViMGRiOTM5N2IifQ.vkRJDWo9LsgNzbqsowzqjYmgrHN-YOtXpg2ESwO6V50' // Reemplaza con tu token real
	const url = 'https://ai.trocdigital.net/api/v1/bots' // Reemplaza con la URL de tu API

	const fetchData = async () => {
		loading = true
		error = null

		try {
			const response = await axios.get(url, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
			datos = response.datos
		} catch (err) {
			error = err.message
		} finally {
			loading = false
		}
	}

	// Llama a la función fetchData al cargar la componente
	$: fetchData()
</script>

{#if loading}
	<p>Cargando datos...</p>
{:else if error}
	<p>Error al cargar datos: {error}</p>
{:else}
	{#each datos as item}
		<p>{item.name}</p>
	{/each}
{/if}

<ul class="grid grid-cols-2 gap-4 p-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
	{#each $storeBots as bot}
		<a href="/{bot.name.toLowerCase()}" class="dark:text-gray-200">
			<Card.Root class="overflow-hidden transition-all hover:shadow-md bg-white">
				<Card.Header class="pb-2">
					<div class="flex items-center space-x-4">
						<div class="w-12 h-12">
							<img
								src={`/images/bots/${bot.name ? bot.name.toLowerCase() : 'default'}.png`}
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
