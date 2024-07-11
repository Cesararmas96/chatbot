<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'
	import { getApiData, postData } from '$lib/services/getData'
	let feedbackReasons: string[] = []

	onMount(async () => {
		const fetchData = async () => {
			const apiGoodFeedback = `${import.meta.env.VITE_API_AI_URL}/api/v1/chatbots/questions/3415773e-5656-44fe-a8ac-8b9b0f71c758`
			try {
				const response = await getApiData(
					apiGoodFeedback,
					'GET',
					{},
					{},
					{
						headers: {
							'Content-Type': 'application/json'
						}
					},
					null,
					true
				)
				const feedbackData = await response.json()
				feedbackReasons = feedbackData.feedback
				console.log(feedbackReasons)
			} catch (error) {
				throw new Error('Fetch operation failed: ' + error.message)
			}
		}

		fetchData()
	})
</script>

test
