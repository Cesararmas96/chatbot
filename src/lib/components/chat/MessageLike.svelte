<script lang="ts">
	import { getApiData } from '$lib/services/getData.js'
	// import { Button, Input } from 'flowbite-svelte'
	import { Input } from '$lib/components/ui/input'
	import { Button } from '$lib/components/ui/button/index.js'

	import { createEventDispatcher, onMount } from 'svelte'
	import { page } from '$app/stores'
	import { enhance } from '$app/forms'
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js'
	import { Label } from '$lib/components/ui/label'

	const dispatch = createEventDispatcher()
	let inputDisabled = true

	import {
		sendErrorNotification,
		sendSuccessNotification,
		sendInfoNotification
	} from '$lib/stores/toast'

	const bot = $page.params.bot
	let reason: string = ''
	let catalog: any
	let feedbackReasons: string[] = []
	export let token
	export let message
	export let chatbotId

	let errorMessage = ''
	let goods: string[] = [] // Inicializamos como un array de strings
	let isLoading = true

	const handleCatalog = (cat: string) => {
		catalog = cat
		document.getElementById('feedback_type')!.value = cat
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		dispatch('close')
		sendInfoNotification('Bot Feedback Submitted, Thank you for your feedback!.')
	}

	const fetchGood = async () => {
		const apiUrl = `${import.meta.env.VITE_API_AI_URL}/api/v1/feedback_types/Good`

		try {
			const fetchedBot = await getApiData(
				apiUrl,
				'GET',
				{},
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				}
			)

			// Verificar y asignar el contenido de la propiedad `feedback`
			if (fetchedBot && Array.isArray(fetchedBot.feedback) && fetchedBot.feedback.length > 0) {
				goods = [...fetchedBot.feedback] // Asignamos el contenido de `feedback`
			} else {
				errorMessage = `No good feedback message found`
				sendErrorNotification(errorMessage)
			}
		} catch (error) {
			errorMessage = 'An error occurred while fetching the good library.'
			sendErrorNotification('Error fetching data:', error)
			console.error(error) // Asegúrate de mostrar el error en la consola
		} finally {
			isLoading = false
		}
	}

	onMount(() => {
		if (chatbotId) {
			fetchGood()
		} else {
			errorMessage = 'No chatbotId provided.'
			isLoading = false
			sendErrorNotification(errorMessage) // Para verificar si cae en el error de no chatbotId
		}
	})
</script>

<form id="form" method="POST" action="?/feedback" use:enhance on:submit={handleSubmit}>
	<input type="hidden" name="chatbotId" value={chatbotId} />
	<input type="hidden" name="sid" id="sid" value={message.sid} />
	<input type="hidden" name="feedback_type" id="feedback_type" value="" />
	<input type="hidden" name="like" id="like" value="true" />
	<input type="hidden" name="rating" id="rating" value="5" />

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-missing-attribute -->

	<div class="mt-2 mb-2">
		<p class="text-sm font-semibold">Why did you choose this rating? (optional)</p>
	</div>

	<div class="mb-4">
		{#each goods as item}
			<Button
				variant="outline"
				class="text-xs mr-3 mb-2 {item === catalog ? 'border-2 border-green-500' : ''}"
				on:click={() => handleCatalog(item)}
			>
				{item}
			</Button>
		{/each}
	</div>
	<div class="mb-4">
		<Label for="email">Provide additional feedback</Label>

		<Input
			type="text"
			id="feedback"
			bind:value={reason}
			placeholder="Share your thoughts or feedback here"
			name="feedback"
			class="mt-1"
			required
		/>
	</div>
	<div>
		<Button type="submit" disabled={catalog === undefined}>Submit</Button>
	</div>
</form>
