<script lang="ts">
	import { marked, options } from 'marked'
	import { createEventDispatcher } from 'svelte'
	import BotMessageDislike from './BotMessageDislike.svelte'
	import BotMessageLike from './BotMessageLike.svelte'
	import { convert } from 'html-to-text'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import Typewriter, { cascade, concurrent } from 'svelte-typewriter'
	import { Input, Modal, Tooltip, Textarea, Label, Button } from 'flowbite-svelte'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { storeUser } from '$lib/stores'
	import { postData } from '$lib/services/getData.js'

	export let handleRegenerate
	export let message
	export let last
	export let good
	export let bad
	export let chatbotId

	let bot = $page.params.bot
	let botName = $page.url.searchParams.get('botName')
	let copied = false
	let dislike = false
	let like = false
	let clipboard = marked(message.text)
	let shareModal = false
	let reportModal = false
	let shareUrlInput = ''

	const dispatch = createEventDispatcher()
	const currentUrl = new URL($page.url.href).host
	clipboard = convert(clipboard, options)

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

	function copyToClipboard() {
		navigator.clipboard
			.writeText(clipboard)
			.then(() => {
				copied = true
				sendSuccessNotification('Answer copied to the clickboard successfully')

				setTimeout(() => {
					copied = false
				}, 2000)
			})
			.catch((error) => {
				sendErrorNotification(error)
			})
	}

	function copyToClipboardUrl() {
		const shareUrlInput = document.getElementById('shareUrl') as HTMLInputElement

		if (shareUrlInput) {
			shareUrlInput.select()
			document.execCommand('copy')
			sendSuccessNotification('URL copied to clipboard successfully')
		} else {
			sendErrorNotification('Failed to copy URL: Element not found')
		}
	}

	const handleDislike = () => {
		dislike = true
		like = false
		setTimeout(() => {
			dispatch('scrollToBottom')
		}, 100)
	}

	const handleLike = () => {
		like = true
		dislike = false
		setTimeout(() => {
			dispatch('scrollToBottom')
		}, 100)
	}

	// Montar typewriter
	let phrase = marked(message.text)
	// console.log(phrase)
	let typedChars = ''
	let index = 0

	// const typeChar = () => {
	// 	typedChars += phrase[index]
	// 	index += 1
	// }

	// const typing = () => setInterval(typeChar, 100)
	// typing()

	function addTargetBlank(html) {
		return html.replace(/<a href="(.*?)">/g, '<a class="sourceLink" href="$1" target="_blank">')
	}

	function removeAnswerHeader(content) {
		return content.replace('**Answer**:', '').trim()
	}

	const cleanedContent = removeAnswerHeader(message.text)

	const html = marked(cleanedContent)

	// const htmlWithTargetBlank = addTargetBlank(cleanedContent)

	// console.log(html)

	console.log(html)
	console.log(message.text)
</script>

<div class="col-start-1 md:col-end-8 col-end-13 p-3 rounded-lg">
	<div class="flex flex-row">
		<div class="flex items-center justify-center h-10 w-10 rounded-full flex-shrink-0">
			<img src="/images/bots/{bot}.png" alt="logo" />
		</div>
		<div class="flex flex-col">
			<div
				class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl dark:bg-gray-600 dark:text-white"
			>
				<!-- {message.sid} -->
				<!-- <div use:concurrent={{ interval: 30 }} data-static> -->
				<div class="response">
					{@html html}
					<!-- {message.text} -->
				</div>
				<!-- </div> -->

				<!-- {@html (typedChars)} -->

				<div class="flex justify-end mt-5 mb-2">
					<button id="share" class="mr-3" on:click={() => (shareModal = true)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							class=" dark:fill-white fill-gray"
							viewBox="0 0 32 32"
						>
							<path
								d="M23 20a5 5 0 0 0-3.89 1.89l-7.31-4.57a4.46 4.46 0 0 0 0-2.64l7.31-4.57A5 5 0 1 0 18 7a4.8 4.8 0 0 0 .2 1.32l-7.31 4.57a5 5 0 1 0 0 6.22l7.31 4.57A4.8 4.8 0 0 0 18 25a5 5 0 1 0 5-5m0-16a3 3 0 1 1-3 3a3 3 0 0 1 3-3M7 19a3 3 0 1 1 3-3a3 3 0 0 1-3 3m16 9a3 3 0 1 1 3-3a3 3 0 0 1-3 3"
							/>
						</svg>
					</button>
					<Tooltip triggeredBy="#share">Share</Tooltip>

					<button class="mr-3" on:click={copyToClipboard} id="copy">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class=" dark:fill-white fill-black"
							width="16"
							height="16"
							viewBox="0 0 32 32"
						>
							<path
								d="M28 10v18H10V10zm0-2H10a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2"
							/>
							<path d="M4 18H2V4a2 2 0 0 1 2-2h14v2H4Z" />
						</svg>
					</button>
					<Tooltip triggeredBy="#copy">Copy</Tooltip>

					{#if last === 'true'}
						<button class="mr-3" on:click={() => handleRegenerate(message.query)} id="regenerate">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class=" dark:fill-white fill-black"
								width="16"
								height="16"
								viewBox="0 0 32 32"
							>
								<path
									d="M26 18A10 10 0 1 1 16 8h6.182l-3.584 3.585L20 13l6-6l-6-6l-1.402 1.414L22.185 6H16a12 12 0 1 0 12 12Z"
								/>
							</svg>
						</button>
						<Tooltip triggeredBy="#regenerate">Regenerate</Tooltip>
					{/if}

					<button id="like" class="mr-3 button" on:click={handleLike}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class=" {like ? 'active' : ''} dark:fill-white fill-black"
							width="16"
							height="16"
							viewBox="0 0 32 32"
						>
							<path
								d="M26 12h-6V6a3.003 3.003 0 0 0-3-3h-2.133a2.01 2.01 0 0 0-1.98 1.717l-.845 5.917L8.465 16H2v14h21a7.01 7.01 0 0 0 7-7v-7a4.005 4.005 0 0 0-4-4M8 28H4V18h4Zm20-5a5.006 5.006 0 0 1-5 5H10V17.303l3.958-5.937l.91-6.366H17a1 1 0 0 1 1 1v8h8a2.003 2.003 0 0 1 2 2Z"
							/>
						</svg>
					</button>

					<Tooltip triggeredBy="#like">Like</Tooltip>

					<button id="dislike" class="mr-3" on:click={handleDislike}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="dark:fill-white fill-black {dislike ? 'active' : ''}"
							width="16"
							height="16"
							viewBox="0 0 32 32"
							><path
								d="M30 16V9a7.01 7.01 0 0 0-7-7H2v14h6.465l3.577 5.366l.846 5.917A2.01 2.01 0 0 0 14.868 29H17a3.003 3.003 0 0 0 3-3v-6h6a4.005 4.005 0 0 0 4-4M8 14H4V4h4Zm20 2a2.003 2.003 0 0 1-2 2h-8v8a1 1 0 0 1-1 1h-2.133l-.91-6.366L10 14.697V4h13a5.006 5.006 0 0 1 5 5Z"
							/></svg
						>
					</button>

					<Tooltip triggeredBy="#dislike">Dislike</Tooltip>

					<button class="mr-3" id="report" on:click={() => (reportModal = true)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							class=" dark:fill-white fill-black"
							height="16"
							viewBox="0 0 32 32"
							><path d="M6 30H4V2h24l-5.8 9l5.8 9H6Zm0-12h18.33l-4.53-7l4.53-7H6Z" /></svg
						>
					</button>
					<Tooltip triggeredBy="#report">Report</Tooltip>

					<Modal title="Report a problem" bind:open={reportModal} autoclose={false} class="w-full">
						<form on:submit={reportSubmit}>
							<input type="hidden" id="email" value={$storeUser.email} />
							<div class="mb-3">
								<Label for="subject" class="mb-2">Subject</Label>
								<Input type="text" id="subject" placeholder="Subject" required />
							</div>
							<div class="mb-4">
								<Label for="body" class="mb-2">Body</Label>
								<Textarea id="body" placeholder="Your message" rows="4" name="message" />
							</div>
							<div class="text-center">
								<Button
									type="button"
									class="btn-cancel {bot}"
									color="alternative"
									on:click={() => (reportModal = false)}>Cancel</Button
								>
								<Button type="submit" class="btn {bot}">Submit</Button>
							</div>
						</form>
					</Modal>

					<Modal title="Share the question and answer" bind:open={shareModal} autoclose>
						<Input
							type="text"
							id="shareUrl"
							name="shareUrl"
							required
							value={`${currentUrl}/share/${message.sid}`}
						>
							<button id="copyurl" slot="right" type="button" on:click={copyToClipboardUrl}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="dark:fill-white fill-black"
									width="16"
									height="16"
									viewBox="0 0 32 32"
									><path
										d="M28 10v18H10V10zm0-2H10a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2"
									/><path d="M4 18H2V4a2 2 0 0 1 2-2h14v2H4Z" /></svg
								>
							</button>
						</Input>
						<svelte:fragment slot="footer"></svelte:fragment>
					</Modal>
				</div>
			</div>

			{#if like}
				<BotMessageLike {good} {message} {chatbotId} on:close={() => (like = false)} />
			{:else if dislike}
				<BotMessageDislike {message} {bad} {chatbotId} on:close={() => (dislike = false)} />
			{/if}
		</div>
	</div>
</div>
