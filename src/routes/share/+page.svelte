<script lang="ts">
	import BotMessage from '$lib/components/chat/BotMessage.svelte'
	import BotMessageShare from '$lib/components/chat/BotMessageShare.svelte'
	import QuestionMessage from '$lib/components/chat/QuestionMessage.svelte'

	// import { createEventDispatcher, onMount } from 'svelte'
	// import { getApiData, postData } from '$lib/services/getData'
	// let feedbackReasons: string[] = []

	// onMount(async () => {
	// 	const fetchData = async () => {
	// 		const apiGoodFeedback = `${import.meta.env.VITE_API_AI_URL}/api/v1/chatbots/questions/3415773e-5656-44fe-a8ac-8b9b0f71c758`
	// 		try {
	// 			const response = await getApiData(
	// 				apiGoodFeedback,
	// 				'GET',
	// 				{},
	// 				{},
	// 				{
	// 					headers: {
	// 						'Content-Type': 'application/json'
	// 					}
	// 				},
	// 				null,
	// 				true
	// 			)
	// 			const feedbackData = await response.json()
	// 			feedbackReasons = feedbackData.feedback
	// 			console.log(feedbackReasons)
	// 		} catch (error) {
	// 			throw new Error('Fetch operation failed: ' + error.message)
	// 		}
	// 	}

	// 	fetchData()
	// })

	let messages = [
		{
			question: 'asdasdsad',
			query: 'sdsd',
			answer: 'asdasdsad',
			response: 'asdasdsad'
		}
	]
</script>

<div id="chat" class="w-full flex flex-col h-full">
	<div class="grid grid-cols-12 gap-y-2 overflow-auto">
		{#each messages as message, index}
			<QuestionMessage {message} />
			<BotMessageShare {message} />
		{/each}
	</div>
</div>
