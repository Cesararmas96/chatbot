<script lang="ts">
	import { convert } from 'html-to-text'
	import { marked, options } from 'marked'
	import { createEventDispatcher } from 'svelte'
	import { Button } from '$lib/components/ui/button/index.js'
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js'
	import { Input } from '$lib/components/ui/input'
	import { Clipboard, Share2, RefreshCw, ThumbsUp, ThumbsDown, Flag, X } from 'lucide-svelte'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import MessageLike from './MessageLike.svelte'
	import MessageDislike from './MessageDislike.svelte'

	export let message: { text: string; sid: string }
	export let currentUrl: string
	export let bot: string
	export let token

	export let onRegenerate: (message: { text: string; sid: string; query?: string }) => void

	const dispatch = createEventDispatcher()
	let clipboard = marked(message.text)
	clipboard = convert(clipboard, options)
	let copied = false

	let dislike = false
	let like = false

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

	function copyToClipboard() {
		const plainText = convert(marked(message.text), {
			wordwrap: 130 // Opcional: ajusta la longitud de línea según lo necesites.
		})

		navigator.clipboard
			.writeText(plainText)
			.then(() => {
				copied = true
				sendSuccessNotification('Answer copied to the clipboard successfully')
				setTimeout(() => {
					copied = false
				}, 2000)
			})
			.catch((error) => {
				console.error(error)
				sendErrorNotification('Failed to copy to clipboard')
			})
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
</script>

<div class="message-container flex flex-col gap-3">
	<div class="flex">
		<div class="h-10 w-10 flex-shrink-0 mr-3">
			<img
				src={`/images/bots/${bot.toLowerCase() ? bot.toLowerCase() : 'default'}.png`}
				alt="{bot}-logo"
				class="h-10 w-10"
			/>
		</div>
		<div class="message">
			{@html marked(message.text)}
		</div>
	</div>
	<div class="flex mt-2 mb-2 ml-12">
		<AlertDialog.Root>
			<AlertDialog.Trigger asChild let:builder>
				<Button class="" builders={[builder]} variant="ghost">
					<Share2 class="h-4 w-4" />
				</Button>
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Share the question and answer</AlertDialog.Title>
					<AlertDialog.Description>
						<div class="relative w-full">
							<Input
								type="text"
								id="shareUrl"
								name="shareUrl"
								required
								value={`${currentUrl}/share/${message.sid}`}
								class="pr-10"
							/>
							<button id="copyurl" type="button" on:click={copyToClipboardUrl}>
								<Clipboard
									class="absolute right-3 top-1/3 transform -translate-y-1/2 h-4 w-4 text-gray-500"
								/>
							</button>
						</div>
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>

		<Button class="mr-3" variant="ghost" on:click={copyToClipboard} id="copy">
			<Clipboard class="h-4 w-4" />
		</Button>

		<Button class="mr-3" variant="ghost" on:click={() => onRegenerate(message)}>
			<RefreshCw class="h-4 w-4" />
		</Button>

		<AlertDialog.Root>
			<AlertDialog.Trigger asChild let:builder>
				<Button class="" builders={[builder]} variant="ghost"><ThumbsUp class="h-4 w-4" /></Button>
			</AlertDialog.Trigger>

			<AlertDialog.Content>
				<AlertDialog.Header>
					<div class="flex justify-between items-center">
						<AlertDialog.Title>Provide Feedback</AlertDialog.Title>
						<AlertDialog.Cancel class="border-none m-0 self-end"
							><X class="h-4 w-4" /></AlertDialog.Cancel
						>
					</div>
					<AlertDialog.Description>
						<MessageLike
							{token}
							{message}
							chatbotId={message.chatbot_id}
							on:close={() => (like = false)}
						/>
					</AlertDialog.Description>
				</AlertDialog.Header>
			</AlertDialog.Content>
		</AlertDialog.Root>

		<AlertDialog.Root>
			<AlertDialog.Trigger asChild let:builder>
				<Button class="" builders={[builder]} variant="ghost"><ThumbsDown class="h-4 w-4" /></Button
				>
			</AlertDialog.Trigger>

			<AlertDialog.Content>
				<AlertDialog.Header>
					<div class="flex justify-between items-center">
						<AlertDialog.Title>Provide Feedback</AlertDialog.Title>
						<AlertDialog.Cancel class="border-none m-0 self-end"
							><X class="h-4 w-4" /></AlertDialog.Cancel
						>
					</div>
					<AlertDialog.Description>
						<MessageDislike
							{token}
							{message}
							chatbotId={message.chatbot_id}
							on:close={() => (like = false)}
						/>
					</AlertDialog.Description>
				</AlertDialog.Header>
			</AlertDialog.Content>
		</AlertDialog.Root>

		<button class="mr-3">
			<Flag class="h-4 w-4" />
		</button>
	</div>
</div>

<style>
	/* Agrega estilos necesarios aquí */
</style>
