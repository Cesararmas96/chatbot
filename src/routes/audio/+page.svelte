<script>
	import { onMount } from 'svelte'
	import { Button } from '$lib/components/ui/button/index.js'
	import { Input } from '$lib/components/ui/input/index.js'
	import { Label } from '$lib/components/ui/label/index.js'
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js'
	import { Upload, Trash, FileAudio } from 'lucide-svelte'

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
	let isDragging = false // Para cambiar el estilo cuando se arrastra
	let selectedFile = null // Archivo seleccionado

	// Mantener la lista filtrada
	$: filteredAudios = processedAudios.filter((audio) =>
		audio.name.toLowerCase().includes(searchTerm.toLowerCase())
	)

	let dropzoneInput // Referencia al input de archivo

	// Evento de enviar el formulario
	const handleSubmit = (e) => {
		e.preventDefault()
		if (selectedFile) {
			const newAudioId = `audio-${Date.now()}`
			processedAudios = [
				...processedAudios,
				{ id: newAudioId, status: 'processing', name: selectedFile.name }
			]
			selectedFile = null // Resetear el archivo cargado después de enviar el formulario
		}
	}

	// Proceso para manejar la nueva carga de audio
	const handleNewProcess = () => {
		console.log('Starting new audio process')
	}

	// Para manejar la selección de archivos
	const handleFiles = (files) => {
		if (files.length > 0) {
			// Limitar a un solo archivo a la vez
			selectedFile = files[0]
		}
	}

	// Eliminar el archivo seleccionado
	const removeFile = (e) => {
		e.stopPropagation() // Detener la propagación del evento para que no abra el input de archivo
		selectedFile = null
		dropzoneInput.value = '' // Resetear el valor del input
	}

	// Al hacer clic en el área de la dropzone
	const handleClickDropzone = () => {
		dropzoneInput.click() // Activa el input de archivo oculto
	}

	// Evento de dragover para permitir el drop
	const handleDragOver = (event) => {
		event.preventDefault()
		isDragging = true
	}

	// Evento de salida del drag
	const handleDragLeave = () => {
		isDragging = false
	}

	// Evento de drop para manejar los archivos arrastrados
	const handleDrop = (event) => {
		event.preventDefault()
		isDragging = false
		const files = event.dataTransfer.files
		handleFiles(files) // Manejar archivos arrastrados
	}
</script>

<div class="flex-1 flex flex-col">
	<!-- Content Area -->
	<div class="flex-1 p-4 bg-zinc-900 overflow-y-auto">
		<form class="space-y-6" on:submit={handleSubmit}>
			<RadioGroup.Root bind:value={inputType} class="flex space-x-4">
				<div class="flex items-center space-x-2">
					<RadioGroup.Item value="file" id="file" />
					<Label htmlFor="file">Upload Audio</Label>
				</div>
				<div class="flex items-center space-x-2">
					<RadioGroup.Item value="url" id="url" />
					<Label htmlFor="url">Enter URL</Label>
				</div>
			</RadioGroup.Root>

			{#if inputType === 'file'}
				<!-- Dropzone -->
				<div
					class="dropzone {isDragging ? 'dragging' : ''}"
					on:click={handleClickDropzone}
					on:dragover={handleDragOver}
					on:dragleave={handleDragLeave}
					on:drop={handleDrop}
				>
					{#if selectedFile}
						<!-- Mostrar el archivo cargado -->
						<div class="file-info">
							<FileAudio class="w-6 h-6 text-gray-400" />
							<p class="ml-2">{selectedFile.name}</p>
							<Button on:click={removeFile} class="ml-4 bg-red-500 hover:bg-red-600">
								<Trash class="h-4 w-4 mr-2" /> Remove
							</Button>
						</div>
					{:else}
						<!-- Mostrar la zona de arrastrar si no hay archivo -->
						<Upload class="w-12 h-12 mb-4 text-gray-400" />
						<p class="mb-2 text-sm text-gray-400">
							<span class="font-semibold">Click to upload</span> or drag and drop
						</p>
						<p class="text-xs text-gray-400">MP3, WAV, or OGG (MAX. 10MB)</p>
					{/if}

					<!-- Input de archivo oculto -->
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
				<!-- Entrada de URL -->
				<Input type="url" placeholder="Enter audio URL here" class="bg-zinc-800 border-gray-600" />
			{/if}

			<Button
				type="submit"
				class="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
				disabled={!selectedFile}
			>
				Process Audio
			</Button>
		</form>
	</div>
</div>

<style>
	/* Estilos propios del componente que en Svelte se aplican de manera aislada al componente */
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

	/* Estilo cuando está arrastrando archivos */
	.dragging {
		background-color: #444;
	}

	.file-info {
		display: flex;
		align-items: center;
		color: white;
	}
</style>
