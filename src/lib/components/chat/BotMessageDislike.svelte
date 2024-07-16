<script lang="ts">
	import { Button, Input } from 'flowbite-svelte'
	import { createEventDispatcher } from 'svelte'
	import { page } from '$app/stores'
	import { enhance } from '$app/forms'
	export let chatbotid
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
	export let bad
	export let message
	export let chatbotId
	const handleCatalog = async (cat: string) => {
		catalog = cat
		document.getElementById('feedback_type').value = cat
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		dispatch('close')
		sendInfoNotification('Bot Feedback Submitted, Thank you for your feedback!.')
	}
</script>

<form
	id="form"
	class="mt-4 flex w-4/5 flex-col items-center"
	method="POST"
	action="?/feedbackDislike"
	use:enhance
	on:submit={handleSubmit}
>
	<div class="flex flex-row">
		<!-- <div class="flex items-center justify-center h-10 w-10 rounded-full flex-shrink-0">
			<img src="/images/bots/{bot}.png" alt="logo" />
		</div> -->
		<input type="hidden" name="chatbotId" value={chatbotId} />
		<input type="hidden" name="sid" id="sid" value={message.sid} />
		<input type="hidden" name="feedback_type" id="feedback_type" value="" />
		<input type="hidden" name="dislike" id="dislike" value="true" />
		<input type="hidden" name="rating" id="rating" value="0" />

		<div
			class="relative mt-2 ml-5 text-sm bg-white py-2 px-4 shadow rounded-xl flex flex-col gap-3"
		>
			<div class="flex flex-row justify-between">
				<div>Why did you choose this rating? (optional)</div>
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<!-- svelte-ignore a11y-missing-attribute -->
					<a class="hover:cursor-pointer" on:click={() => dispatch('close')}
						><svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							class="svg actions"
							viewBox="0 0 24 24"
							><path
								d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
							/></svg
						></a
					>
				</div>
			</div>
			<div class="flex flex-row gap-2">
				{#each bad.feedback as item}
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
					name="feedback"
					class=""
					required
				/>
			</div>
			<div>
				<Button type="submit" color="light" size="xs" disabled={catalog === undefined}
					>Submit</Button
				>
			</div>
		</div>
	</div>
</form>
