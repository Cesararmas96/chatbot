<script lang="ts">
	import { onMount } from 'svelte'
	import { createEventDispatcher } from 'svelte'
	import { Lightbulb } from 'lucide-svelte'

	import * as Card from '$lib/components/ui/card/index.js'

	import { getApiData } from '$lib/services/getData.js'
	import { sendErrorNotification } from '$lib/stores/toast'
	import LoaderCustom from '../common/LoaderCustom.svelte'

	export let chatbotId
	export let session

	let isLoading = true
	let errorMessage = ''
	let prompts = [] // Inicializamos con un array vacío

	const dispatch = createEventDispatcher()

	function handleItemClick(query: string) {
		dispatch('selectQuery', { query })
	}
	// Función que busca los datos del prompt library
	const fetchLibrary = async () => {
		const apiUrl = `${import.meta.env.VITE_API_AI_URL}/api/v1/prompt_library?chatbot_id=${chatbotId}`

		try {
			const fetchedBot = await getApiData(
				apiUrl,
				'GET',
				{},
				{},
				{
					headers: {
						Authorization: `Bearer ${session.token}`,
						'Content-Type': 'application/json'
					}
				}
			)

			if (Array.isArray(fetchedBot) && fetchedBot.length > 0) {
				prompts = [...fetchedBot] // Esto debería desencadenar el cambio en Svelte
			} else {
				errorMessage = `No prompts found for chatbot ${chatbotId}.`
				sendErrorNotification(errorMessage)
			}
		} catch (error) {
			errorMessage = 'An error occurred while fetching the prompt library.'
			sendErrorNotification('Error fetching data:', error) // Muestra el error en la consola
		} finally {
			isLoading = false
		}
	}

	onMount(() => {
		if (chatbotId) {
			fetchLibrary()
		} else {
			errorMessage = 'No chatbotId provided.'
			isLoading = false
			sendErrorNotification(errorMessage) // Para verificar si cae en el error de no chatbotId
		}
	})
</script>

{#if isLoading}
	<LoaderCustom />
{:else if prompts.length > 0}
	<div class="grid gap-4 max-w-2xl mx-auto">
		{#each prompts as prompt (prompt.prompt_id)}
			<button
				on:click={() => handleItemClick(prompt.query)}
				class="group flex items-center gap-3 p-3 md:p-4 rounded-xl border text-white bg-gray-700 hover:text-white border-gray-800 hover:bg-gray-900 transition-all duration-200 text-left w-full"
			>
				<div
					class="w-8 h-8 rounded-lg bg-purple-600/10 flex items-center justify-center group-hover:bg-purple-600/20 transition-colors"
				>
					<Lightbulb class="w-4 h-4 text-purple-400" />
				</div>
				<span class="flex-1 text-sm md:text-base">{prompt.title}</span>
			</button>
		{/each}
	</div>
{:else}
	<p>No prompts available</p>
{/if}
