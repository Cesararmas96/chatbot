<script lang="ts">
	import { afterUpdate, onDestroy } from 'svelte'
	import { createEventDispatcher } from 'svelte'
	import BotMessageShare from './BotMessageShare.svelte'
	import QuestionMessageShare from './QuestionMessageShare.svelte'
	const dispatch = createEventDispatcher()
	export let message
	let element: HTMLDivElement

	// Scroll al fondo después de cada actualización
	afterUpdate(() => {
		if (element) {
			scrollToBottom(element)
		}
	})

	function scrollToBottom(node: HTMLDivElement) {
		node.scroll({ top: node.scrollHeight, behavior: 'smooth' })
	}
</script>

<div
	class="flex flex-auto overflow-x-auto rounded-2xl bg-gray-100 chatbox dark:bg-gray-800 ml-2 mr-2"
>
	<div id="chat" class="w-full flex flex-col h-full">
		<div class="grid grid-cols-12 gap-y-2 overflow-auto" bind:this={element}>
			<QuestionMessageShare {message} />
			<BotMessageShare {message} />
		</div>
	</div>
</div>
