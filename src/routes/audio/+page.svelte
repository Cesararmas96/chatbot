<script>
	import { Button } from '$lib/components/ui/button/index.js'
	import { Input } from '$lib/components/ui/input/index.js'
	import { Label } from '$lib/components/ui/label/index.js'
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js'
	import { Upload, Trash, FileAudio, Link, CheckCircle } from 'lucide-svelte'
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js'

	let inputType = 'file'
	let searchTerm = ''
	let processedAudios = [
		{ id: 'audio-1', status: 'completed', name: 'Interview_001.mp3' },
		{ id: 'audio-2', status: 'processing', name: 'Lecture_002.wav' },
		{ id: 'audio-3', status: 'failed', name: 'Podcast_003.ogg' },
		{ id: 'audio-4', status: 'completed', name: 'Meeting_004.mp3' },
		{ id: 'audio-5', status: 'processing', name: 'Voicenote_005.wav' }
	]

	let filteredAudios = [...processedAudios]
	let isDragging = false
	let selectedFile = null
	let isLoading = false
	let isSubmitted = false // Variable para controlar el estado de submit
	let showAlertDialog = false // Controlar la visibilidad del AlertDialog

	$: filteredAudios = processedAudios.filter((audio) =>
		audio.name.toLowerCase().includes(searchTerm.toLowerCase())
	)

	let dropzoneInput

	const handleSubmit = (e) => {
		e.preventDefault()
		isLoading = true
		if (selectedFile) {
			setTimeout(() => {
				const newAudioId = `audio-${Date.now()}`
				processedAudios = [
					...processedAudios,
					{ id: newAudioId, status: 'processing', name: selectedFile.name }
				]
				selectedFile = null
				isLoading = false
				isSubmitted = true // Actualizar el estado cuando se complete el submit
				showAlertDialog = true // Mostrar el AlertDialog automáticamente
			}, 2000)
		}
	}
	const handleFiles = (files) => {
		if (files.length > 0) {
			selectedFile = files[0]
		}
	}

	const removeFile = (e) => {
		e.stopPropagation()
		selectedFile = null
		dropzoneInput.value = ''
	}

	const handleClickDropzone = () => {
		dropzoneInput.click()
	}

	const handleDragOver = (event) => {
		event.preventDefault()
		isDragging = true
	}

	const handleDragLeave = () => {
		isDragging = false
	}

	const handleDrop = (event) => {
		event.preventDefault()
		isDragging = false
		const files = event.dataTransfer.files
		handleFiles(files)
	}

	// Función para cerrar el diálogo y permitir un nuevo proceso
	const handleContinue = () => {
		showAlertDialog = false // Cerrar el diálogo
		isSubmitted = false // Reiniciar el proceso para permitir otro submit
	}
</script>

<div class="flex-1 flex flex-col">
	<div class="flex-1 p-4 bg-zinc-900 overflow-y-auto">
		<form class="space-y-6" on:submit={handleSubmit}>
			<RadioGroup.Root bind:value={inputType} class="flex space-x-4">
				<div class="flex items-center space-x-2 cursor-pointer">
					<RadioGroup.Item value="file" id="file" />
					<Upload class="w-5 h-5 text-gray-400 cursor-pointer" />
					<Label for="file" class="cursor-pointer">Upload Audio</Label>
				</div>
				<div class="flex items-center space-x-2">
					<RadioGroup.Item value="url" id="url" />
					<Link class="w-5 h-5 text-gray-400 cursor-pointer" />
					<Label for="url" class="cursor-pointer">Enter URL</Label>
				</div>
			</RadioGroup.Root>

			{#if inputType === 'file'}
				<div
					class="dropzone {isDragging ? 'dragging' : ''}"
					on:click={handleClickDropzone}
					on:dragover={handleDragOver}
					on:dragleave={handleDragLeave}
					on:drop={handleDrop}
				>
					{#if selectedFile}
						<div class="file-info">
							<FileAudio class="w-6 h-6 text-gray-400" />
							<p class="ml-2">{selectedFile.name}</p>
							<Button on:click={removeFile} class="ml-4 bg-red-500 hover:bg-red-600">
								<Trash class="h-4 w-4 mr-2" /> Remove
							</Button>
						</div>
					{:else}
						<Upload class="w-12 h-12 mb-4 text-gray-400" />
						<p class="mb-2 text-sm text-gray-400">
							<span class="font-semibold">Click to upload</span> or drag and drop
						</p>
						<p class="text-xs text-gray-400">MP3, WAV, or OGG (MAX. 10MB)</p>
					{/if}
					<input
						type="file"
						accept="audio/*"
						bind:this={dropzoneInput}
						class="hidden"
						on:change={(e) => handleFiles(e.target.files)}
						disabled={selectedFile !== null}
					/>
				</div>
			{:else}
				<Input type="url" placeholder="Enter audio URL here" class="bg-zinc-800 border-gray-600" />
			{/if}

			{#if !isSubmitted}
				<Button
					type="submit"
					class="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
					disabled={!selectedFile || isLoading}
				>
					{#if isLoading}
						<span>Processing...</span>
					{:else}
						<span>Process Audio</span>
					{/if}
				</Button>
			{/if}
		</form>

		{#if showAlertDialog}
			<!-- Mostrar AlertDialog automáticamente cuando showAlertDialog es true -->
			<AlertDialog.Root open={showAlertDialog}>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<CheckCircle class="w-16 h-16 text-green-500 mx-auto" />
						<AlertDialog.Title class="text-xl font-semibold text-center"
							>Audio Submitted Successfully!</AlertDialog.Title
						>
						<AlertDialog.Description class="text-center text-gray-400"
							>Your audio has been sent for processing.</AlertDialog.Description
						>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Action on:click={handleContinue}>Continue</AlertDialog.Action>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
		{/if}
	</div>
</div>

<style>
	.dropzone {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border: 2px dashed #ccc;
		border-radius: 8px;
		padding: 20px;
		height: 200px;
		background-color: #1a1a1a;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.dropzone:hover {
		background-color: #333;
	}

	.dragging {
		background-color: #444;
	}

	.file-info {
		display: flex;
		align-items: center;
		color: white;
	}
</style>
