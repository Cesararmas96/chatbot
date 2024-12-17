<script lang="ts">
	import { convert } from 'html-to-text'
	import { onMount } from 'svelte'
	import { marked, options } from 'marked'
	import { createEventDispatcher } from 'svelte'
	import { Button } from '$lib/components/ui/button/index.js'
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js'
	import { Input } from '$lib/components/ui/input'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import {
		Clipboard,
		Share2,
		RefreshCw,
		ThumbsUp,
		ThumbsDown,
		Flag,
		X,
		ChevronDown,
		Check
	} from 'lucide-svelte'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import MessageLike from './MessageLike.svelte'
	import MessageDislike from './MessageDislike.svelte'
	import ReportSubmit from './ReportSubmit.svelte'
	import * as Tooltip from '$lib/components/ui/tooltip'

	export let message: { text: string; sid: string }
	export let currentUrl: string
	export let bot: string
	export let token

	export let onRegenerate: (message: { text: string; sid: string; query?: string }) => void
	export let isLastMessage: boolean

	export let selectedLlm = null // Por defecto, no hay LLM seleccionado
	export let llmOptions = ['Model A', 'Model B', 'Model C'] // Opciones disponibles

	const dispatch = createEventDispatcher()
	let clipboard = marked(message.text)
	clipboard = convert(clipboard, options)
	let copied = false

	let dislike = false
	let like = false

	let displayedText = ''
	let fullText = addTargetBlank(marked(message.text))
	let isInTag = false

	onMount(() => {
		if (isLastMessage) {
			let i = 0
			displayedText = '' // Reinicia el texto mostrado al montar el componente

			const typingInterval = setInterval(() => {
				if (i < fullText.length) {
					const currentChar = fullText[i]

					// Verificar si estamos entrando o saliendo de una etiqueta HTML
					if (currentChar === '<') {
						isInTag = true // Inicia la etiqueta
					}
					if (isInTag) {
						displayedText += currentChar // Añade el carácter para mantener la etiqueta completa
						if (currentChar === '>') {
							isInTag = false // Finaliza la etiqueta
						}
					} else {
						displayedText += currentChar // Añade solo los caracteres fuera de las etiquetas
					}

					i++
				} else {
					clearInterval(typingInterval) // Detener el temporizador cuando termine de mostrar el texto
				}
			}, 5) // Ajusta la velocidad del efecto de escritura (15 ms por carácter)
		} else {
			displayedText = fullText // Muestra el texto completo si no es el último mensaje
		}
	})

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

	function addTargetBlank(html) {
		return html.replace(/<a href="(.*?)">/g, '<a class="sourceLink" href="$1" target="_blank">')
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
		<div class="message response">
			{@html displayedText}
		</div>
	</div>
	<div class="flex mb-2 ml-12 acciones">
		<AlertDialog.Root>
			<AlertDialog.Trigger asChild let:builder>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button class="w-8 h-8 p-0" builders={[builder]} variant="ghost">
							<Share2 class="h-4 w-4" />
						</Button></Tooltip.Trigger
					>
					<Tooltip.Content>
						<p>Share</p>
					</Tooltip.Content>
				</Tooltip.Root>
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

		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button class="w-8 h-8 p-0" variant="ghost" on:click={copyToClipboard} id="copy">
					<Clipboard class="h-4 w-4" />
				</Button></Tooltip.Trigger
			>
			<Tooltip.Content>
				<p>Copy</p>
			</Tooltip.Content>
		</Tooltip.Root>

		<AlertDialog.Root>
			<AlertDialog.Trigger asChild let:builder>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button class="w-8 h-8 p-0" builders={[builder]} variant="ghost"
							><ThumbsUp class="h-4 w-4" /></Button
						>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Like</p>
					</Tooltip.Content>
				</Tooltip.Root>
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
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button class="w-8 h-8 p-0" builders={[builder]} variant="ghost"
							><ThumbsDown class="h-4 w-4" /></Button
						>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Dislike</p>
					</Tooltip.Content>
				</Tooltip.Root>
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

		<AlertDialog.Root>
			<AlertDialog.Trigger asChild let:builder>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button class="w-8 h-8 p-0" builders={[builder]} variant="ghost"
							><Flag class="h-4 w-4" /></Button
						>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Report</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<div class="flex justify-between items-center">
						<AlertDialog.Title>Report a problem</AlertDialog.Title>
						<AlertDialog.Cancel class="border-none m-0 self-end"
							><X class="h-4 w-4" /></AlertDialog.Cancel
						>
					</div>
					<AlertDialog.Description>
						<ReportSubmit />
					</AlertDialog.Description>
				</AlertDialog.Header>
			</AlertDialog.Content>
		</AlertDialog.Root>
		{#if isLastMessage}
			<!-- <Tooltip.Root>
				<Tooltip.Trigger>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<Button variant="ghost" class="flex items-center relative group p-2 w-auto h-auto">
								<RefreshCw class="h-4 w-4" />

								<ChevronDown class="ml-1 h-4 w-4" />
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content>
							<DropdownMenu.Group>
								<DropdownMenu.Label>
									<span class="opacity-95">Change model</span>
								</DropdownMenu.Label>
								<DropdownMenu.Separator />

								{#each llmOptions as llm}
									<DropdownMenu.Item
										class="cursor-pointer flex flex-col items-start gap-1"
										on:click={() => handleChangeLlm(llm.name)}
									>
										<div class="flex items-center w-full gap-2">
											<span class="font-bold">{llm.name}</span>
											{#if selectedLlm === llm.name}
												<Check class="h-4 w-4 " />
											{/if}
										</div>
										<div class="text-sm text-gray-500">{llm.description}</div>
									</DropdownMenu.Item>
								{/each}
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Refresh with {selectedLlm}</p>
				</Tooltip.Content>
			</Tooltip.Root> -->
		{/if}
	</div>
</div>
