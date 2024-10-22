<script lang="ts">
	import { onMount } from 'svelte'
	import { createEventDispatcher } from 'svelte'
	import { Lightbulb } from 'lucide-svelte'

	import * as Card from '$lib/components/ui/card/index.js'

	import { getApiData } from '$lib/services/getData.js'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import LoaderCustom from '../common/LoaderCustom.svelte'

	export let chatbotId
	export let session

	console.log(session.token)

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

<!-- Mensaje de carga -->
{#if isLoading}
	<LoaderCustom />

	<!-- Mostrar prompts -->
{:else if prompts.length > 0}
	{#each prompts as prompt (prompt.prompt_id)}
		<button on:click={() => handleItemClick(prompt.query)}>
			<Card.Root class="bg-[#1E1E1E] border-gray-800 hover:bg-[#2A2A2A] transition-colors">
				<Card.Content class="p-4 flex flex-col items-center justify-between">
					<Lightbulb class="mb-2" />
					<h3 class="font-semibold">{prompt.title}</h3>
				</Card.Content>
			</Card.Root>
		</button>
	{/each}

	<!-- Si no hay prompts disponibles -->
{:else}
	no
{/if}
