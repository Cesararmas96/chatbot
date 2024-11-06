<script lang="ts">
	import { storeUser } from '$lib/stores'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import { postData } from '$lib/services/getData.js'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { Button } from '$lib/components/ui/button/index.js'
	import { Textarea } from '$lib/components/ui/textarea/index.js'
	import { page } from '$app/stores'

	let bot = $page.params.bot

	const reportSubmit = async (event: any) => {
		event.preventDefault()
		const email = $storeUser.email
		const subjectInput = document.getElementById('subject')
		const bodyTextarea = document.getElementById('body')
		const payload = {
			subject: subjectInput,
			body: bodyTextarea,
			customer: email
		}

		// console.log(payload)

		try {
			const url = `${import.meta.env.VITE_API_URL}/support/api/v1/anon_ticket`
			const setReport = await postData(url, payload)
			// console.log('Response from API:', setReport)

			if (setReport) {
				sendSuccessNotification('Report submitted successfully')
			} else {
				sendErrorNotification('Failed to submit report')
			}
		} catch (error) {
			console.log(error)
			sendErrorNotification('An error occurred while submitting the report')
		}
	}
</script>

<form on:submit={reportSubmit}>
	<input type="hidden" id="email" value={$storeUser.email} />
	<div class="mb-3">
		<Label for="subject" class="mb-2">Summarize your message</Label>
		<Input type="text" id="subject" class="mt-1" placeholder="Subject" required />
	</div>
	<div class="mb-4">
		<Label for="body" class="mb-2">Message Details</Label>
		<Textarea
			id="body"
			class="mt-1"
			placeholder="Please share the details of your message here. We value your input and are here to help!"
			rows="4"
			name="message"
		/>
	</div>
	<div class="">
		<!-- <Button type="submit" class="btn {bot}">Submit</Button> -->
		<Button type="submit">Submit</Button>
	</div>
</form>
