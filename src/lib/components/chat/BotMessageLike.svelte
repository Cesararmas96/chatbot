<script lang="ts">
	import { Button, Input } from 'flowbite-svelte'
	import { createEventDispatcher } from 'svelte'
	import { page } from '$app/stores'
	import { enhance } from '$app/forms'
	export let chatbotid
	const dispatch = createEventDispatcher()
	let inputDisabled = true

	const bot = $page.params.bot
	let reason: string = ''
	let catalog: any
	let feedbackReasons: string[] = []
	export let good
	export let message
	export let chatbotId

	const handleCatalog = async (cat: string) => {
		catalog = cat
		document.getElementById('feedback_type').value = cat
	}
</script>

<form
	id="form"
	class="mt-4 flex w-4/5 flex-col items-center"
	method="POST"
	action="?/feedback"
	use:enhance
	on:submit={() => dispatch('close')}
>
	<input type="hidden" id="chatbotId" name="chatbotId" value={chatbotId} />
	<input type="hidden" name="sid" id="sid" value={message.sid} />
	<input type="hidden" name="feedback_type" id="feedback_type" value="" />
	<input type="hidden" name="like" id="like" value="true" />
	<input type="hidden" name="rating" id="rating" value="5" />

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
				name="feedback"
				class=""
			/>
		</div>
		<div>
			<Button type="submit" color="light" size="xs" disabled={catalog === undefined}>Submit</Button>
		</div>
	</div>
</form>
