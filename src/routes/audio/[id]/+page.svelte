<script>
	import { onMount } from 'svelte'
	import { Input } from '$lib/components/ui/input/index.js'
	import { Button } from '$lib/components/ui/button/index.js'
	import { Textarea } from '$lib/components/ui/textarea/index.js'
	import { Separator } from '$lib/components/ui/separator/index.js'
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js'
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar'
	import { Badge } from '$lib/components/ui/badge'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Download, Copy, LogOut, Settings, FileAudio } from 'lucide-svelte'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'

	let audioFile = {
		name: 'Interview_001.mp3',
		summary:
			'This is a summary of the processed audio file. It contains key points and main ideas extracted from the full transcription.',
		fullText:
			'This is the full transcription of the processed audio file. It contains all the spoken words and detailed content of the audio.',
		status: 'completed' // Puede ser 'pending' o 'completed'
	}

	const handleDownload = (content, fileName) => {
		const element = document.createElement('a')
		const file = new Blob([content], { type: 'text/plain' })
		element.href = URL.createObjectURL(file)
		element.download = fileName
		document.body.appendChild(element)
		element.click()
		document.body.removeChild(element)
	}

	const handleCopy = (content) => {
		navigator.clipboard
			.writeText(content)
			.then(() => {
				sendSuccessNotification('Content copied to clipboard!')
			})
			.catch((err) => {
				sendErrorNotification('Copy Failed: ', err)
			})
	}
</script>

<div class="flex-1 flex flex-col p-4 bg-zinc-900 overflow-y-auto">
	<div class="flex items-center justify-between mb-4">
		<h2 class="text-2xl font-bold">{audioFile.name}</h2>
		<Badge variant={audioFile.status === 'completed' ? 'success' : 'warning'}>
			{audioFile.status === 'completed' ? 'Completed' : 'Pending'}
		</Badge>
	</div>

	<!-- Summary Section -->
	<div class="mb-6">
		<h3 class="text-lg font-semibold mb-2">Summary</h3>
		<div class="relative">
			<Textarea
				bind:value={audioFile.summary}
				readonly
				class="w-full h-32 bg-zinc-800 border-gray-600 resize-none"
			/>
			<div class="absolute bottom-2 right-2 flex space-x-2">
				<Button on:click={() => handleDownload(audioFile.summary, `${audioFile.name}_summary.txt`)}>
					<Download class="h-4 w-4 mr-1" /> Download
				</Button>
				<Button on:click={() => handleCopy(audioFile.summary)}>
					<Copy class="h-4 w-4 mr-1" /> Copy
				</Button>
			</div>
		</div>
	</div>

	<!-- Full Text Section -->
	<div>
		<h3 class="text-lg font-semibold mb-2">Full Transcription</h3>
		<div class="relative">
			<Textarea
				bind:value={audioFile.fullText}
				readonly
				class="w-full h-64 bg-zinc-800 border-gray-600 resize-none"
			/>
			<div class="absolute bottom-2 right-2 flex space-x-2">
				<Button on:click={() => handleDownload(audioFile.fullText, `${audioFile.name}_full.txt`)}>
					<Download class="h-4 w-4 mr-1" /> Download
				</Button>
				<Button on:click={() => handleCopy(audioFile.fullText)}>
					<Copy class="h-4 w-4 mr-1" /> Copy
				</Button>
			</div>
		</div>
	</div>
</div>
