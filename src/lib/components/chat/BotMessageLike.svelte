<script lang="ts">
	import { Button, Input } from 'flowbite-svelte'
	import { createEventDispatcher } from 'svelte'
	import { page } from '$app/stores'
	import { enhance } from '$app/forms'

	// export let message
	const dispatch = createEventDispatcher()
	let inputDisabled = true

	const bot = $page.params.bot
	let reason: string = ''
	let catalog: any
	let feedbackReasons: string[] = []
	export let good

	const handleCatalog = async (cat: string) => {
		catalog = cat
	}

	// let token =
	// 	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MjA5NzQ5ODIuNDk4NzYxLCJpYXQiOjE3MjA2MTQ5ODIsImlzcyI6Ik1vYmlsZWluc2lnaHQiLCJ1c2VyIjoxNTc3OSwidXNlcm5hbWUiOiJqbWVuZG96YTFAdHJvY2dsb2JhbC5jb20iLCJ1c2VyX2lkIjoxNTc3OSwiaWQiOiJqbWVuZG96YTFAdHJvY2dsb2JhbC5jb20ifQ.qbyTKhY5wOflzyZ503fHLXZ0vRHZiH20STVV5NALwAQ'

	// const handleLikeSubmit = async (event: any) => {
	// 	const payload = {
	// 		chatbot_id: 'a6fcfaef-fe01-4040-94f3-bb418054ab5b',
	// 		sid: '24292fac-b46d-447e-a4f7-f88d68e9c998',
	// 		feedback_type: 'Correct',
	// 		feedback: 'Good Enough',
	// 		_like: true,
	// 		rating: '5'
	// 	}

	// 	try {
	// 		const url = 'https://ai-dev.trocdigital.net/api/v1/bot_feedback'

	// 		const setFeedback = await postData(url, payload)

	// 		if (setFeedback && setFeedback.message) {
	// 			sendSuccessNotification(setFeedback.message)
	// 		} else {
	// 			sendErrorNotification('Failed')
	// 		}
	// 	} catch (error) {
	// 		sendErrorNotification('An unexpected error occurred')
	// 		console.error('There was a problem with the fetch operation:', error)
	// 	}

	// 	dispatch('close')
	// }

	// const handleLikeSubmit = async (event: any) => {
	// 	event.preventDefault() // Prevenir el comportamiento por defecto del evento
	// 	const payload = {
	// 		chatbot_id: 'a6fcfaef-fe01-4040-94f3-bb418054ab5b',
	// 		sid: '24292fac-b46d-447e-a4f7-f88d68e9c998',
	// 		feedback_type: 'Correct',
	// 		feedback: 'Good Enough',
	// 		_like: true,
	// 		rating: '5'
	// 	}

	// 	try {
	// 		const url = 'https://ai-dev.trocdigital.net/api/v1/bot_feedback'

	// 		const response = await fetch(url, {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				Origin: 'https://navai.dev.trocdigital.io'
	// 			},
	// 			body: JSON.stringify(payload)
	// 		})

	// 		if (!response.ok) {
	// 			throw new Error('Network response was not ok ' + response.statusText)
	// 		}

	// 		const setFeedback = await response.json()

	// 		if (setFeedback && setFeedback.message) {
	// 			sendSuccessNotification(setFeedback.message)
	// 		} else {
	// 			sendErrorNotification('Failed')
	// 		}
	// 	} catch (error) {
	// 		sendErrorNotification(error.message || 'An unexpected error occurred')
	// 		console.error('There was a problem with the fetch operation:', error)
	// 	}

	// 	dispatch('close')
	// }

	// import axios from 'axios'

	// const handleLikeSubmit = async (event: any) => {
	// 	event.preventDefault() // Prevenir el comportamiento por defecto del evento

	// 	const payload = {
	// 		chatbot_id: 'a6fcfaef-fe01-4040-94f3-bb418054ab5b',
	// 		sid: '24292fac-b46d-447e-a4f7-f88d68e9c998',
	// 		feedback_type: 'Correct',
	// 		feedback: 'Good Enough',
	// 		_like: true,
	// 		rating: '5'
	// 	}

	// 	try {
	// 		const url = 'https://ai-dev.trocdigital.net/api/v1/bot_feedback'

	// 		const response = await axios.post(url, payload, {
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				Origin: 'https://navai.dev.trocdigital.io'
	// 			}
	// 		})

	// 		const setFeedback = response.data

	// 		if (setFeedback && setFeedback.message) {
	// 			sendSuccessNotification(setFeedback.message)
	// 		} else {
	// 			sendErrorNotification('Failed')
	// 		}
	// 	} catch (error) {
	// 		sendErrorNotification(error.message || 'An unexpected error occurred')
	// 		console.error('There was a problem with the axios operation:', error)
	// 	}

	// 	dispatch('close')
	// }

	// const handleLikeSubmit = async (event: any) => {
	// 	event.preventDefault() // Prevenir el comportamiento por defecto del evento

	// 	const payload = {
	// 		chatbot_id: 'a6fcfaef-fe01-4040-94f3-bb418054ab5b',
	// 		sid: '24292fac-b46d-447e-a4f7-f88d68e9c998',
	// 		feedback_type: 'Correct',
	// 		feedback: 'Good Enough',
	// 		_like: true,
	// 		rating: '5'
	// 	}

	// 	try {
	// 		const url = 'https://ai-dev.trocdigital.net/api/v1/bot_feedback'

	// 		const response = await axios.post(url, payload, {
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				Origin: 'https://navai.dev.trocdigital.io',
	// 				Accept: 'application/json',
	// 				'X-Requested-With': 'XMLHttpRequest'
	// 			}
	// 		})

	// 		const setFeedback = response.data

	// 		if (setFeedback && setFeedback.message) {
	// 			sendSuccessNotification(setFeedback.message)
	// 		} else {
	// 			sendErrorNotification('Failed')
	// 		}
	// 	} catch (error) {
	// 		sendErrorNotification(error.message || 'An unexpected error occurred')
	// 		console.error('There was a problem with the axios operation:', error)
	// 	}

	// 	dispatch('close')
	// }
</script>

<form
	id="form"
	class="mt-4 flex w-4/5 flex-col items-center"
	method="POST"
	action="?/feedback"
	use:enhance
	on:submit={() => dispatch('close')}
>
	<input type="hidden" name="chatbot_id" value={bot} />
	<div class="relative mt-2 ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl flex flex-col gap-3">
		<div class="flex flex-row justify-between">
			<div>Why did you choose this rating? (optional)</div>
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<!-- svelte-ignore a11y-missing-attribute -->
				<a class="hover:cursor-pointer" on:click={() => dispatch('close')}>X</a>
			</div>
		</div>
		<div class="flex flex-row gap-2">
			{#each good.feedback as item}
				<Button
					color="light"
					class="px-3 py-1 text-xs {item === catalog ? 'border-2 border-green-500' : ''}"
					on:click={() => handleCatalog(item)}>{item}</Button
				>
			{/each}
		</div>
		<div>
			<Input
				type="text"
				id="feedback"
				bind:value={reason}
				placeholder="Provide additional feedback"
				size="md"
				class=""
			/>
		</div>
		<div>
			<Button type="submit" color="light" size="xs" disabled={catalog === undefined}>Submit</Button>
		</div>
	</div>
</form>
