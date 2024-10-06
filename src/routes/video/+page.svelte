<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js'
	import { Input } from '$lib/components/ui/input/index.js'
	import { Label } from '$lib/components/ui/label/index.js'
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js'
	import { Upload, Trash, FileAudio, Link, CheckCircle } from 'lucide-svelte'
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import { putData, formData } from '$lib/services/getData.js'
	import { jobsListStore } from '$lib/stores/jobsStore'
	import { storeUser } from '$lib/stores'
	import { getApiData } from '$lib/services/getData'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'

	export let data: any

	$storeUser = data.user
	const session = data.user ? data.user : $storeUser

	let inputType = 'file'
	let isDragging = false
	let selectedFile: File | null = null
	let isLoading = false
	let isSubmitted = false
	// let showAlertDialog = false
	let dropzoneInput: HTMLInputElement | null = null
	let videoUrl = ''

	$: console.log('Selected file:', selectedFile) // Log para verificar el archivo seleccionado
	$: console.log('Is loading:', isLoading) // Log para verificar el estado de carga

	// Función para manejar el submit del archivo o URL
	const videoSubmit = async (event: Event) => {
		event.preventDefault()
		console.log('Submit triggered')
		isLoading = true // Deshabilitar el botón antes del envío
		try {
			// Crear el payload para el submit
			const payload: any = {
				translate: 'es' // Campo obligatorio para ambos tipos de envío
			}

			// Verificar si se está enviando un archivo o una URL
			if (inputType === 'file' && selectedFile) {
				payload['file'] = selectedFile
				console.log('Submitting file:', selectedFile)
				await submitData(payload) // Llamada a la función para enviar los datos
			} else if (inputType === 'url' && videoUrl) {
				payload.video_url = videoUrl // Añadir la URL al payload
				console.log('Submitting URL:', videoUrl)
				await submitData(payload) // Llamada a la función para enviar los datos
			} else {
				sendErrorNotification('No valid input selected.')
			}
		} catch (error) {
			console.error('Error during submission:', error)
			sendErrorNotification('An error occurred during submission')
		} finally {
			isLoading = false // Rehabilitar el botón después de finalizar el envío
		}
	}

	// Función para manejar archivos seleccionados

	// Función para manejar el submit de los datos
	const submitData = async (payload: any) => {
		const url = `${import.meta.env.VITE_API_AI_URL}/api/v1/upload_videos`
		try {
			const response = await formData(url, payload, 'PUT')
			if (response.ok) {
				sendSuccessNotification(
					`${inputType === 'file' ? 'Video file' : 'Video URL'} submitted successfully`
				)

				isSubmitted = true
				selectedFile = null
				videoUrl = ''
				if (dropzoneInput) {
					dropzoneInput.value = ''
				}

				console.log('Fetching updated jobs after submit') // Log para verificar que se va a obtener la lista actualizada
				await fetchJobs() // Llamada a la función para obtener la lista de trabajos
			} else {
				console.error('Error in response:', response) // Verificar errores en la respuesta
				sendErrorNotification(response.message || 'Failed to submit')
			}
		} catch (error) {
			console.error('Error during data submission:', error)
			sendErrorNotification('An error occurred while submitting')
		}
	}

	// Función para obtener trabajos actualizados
	const fetchJobs = async () => {
		isLoading = true
		try {
			const fetchedJobs = await getApiData(
				'https://ai.trocdigital.net/api/v1/upload_videos',
				'GET',
				{},
				{},
				{
					headers: {
						Authorization: `Bearer ${session.token}`,
						'Content-Type': 'application/json'
					}
				}
			)
			jobsListStore.set(fetchedJobs.jobs) // Guardamos los trabajos en el store
		} catch (error) {
			let errorMessage = 'Error fetching jobs' // Mensaje por defecto
			if (error.response && error.response.status === 500) {
				errorMessage = `Error 500: Internal Server Error while fetching jobs`
			} else if (error.message) {
				errorMessage = `Error: ${error.message}` // Captura el mensaje general de error
			}

			sendErrorNotification(errorMessage) // Envía el mensaje de error al toast
			console.error(errorMessage) // Muestra el mensaje en la consola
		} finally {
			isLoading = false
		}
	}
	const handleFiles = (files: FileList) => {
		if (files.length > 0) {
			const file = files[0]

			// Validar la extensión (MP4 y AVI)
			const validExtensions = ['video/mp4', 'video/x-msvideo']
			if (!validExtensions.includes(file.type)) {
				sendErrorNotification('Only MP4 or AVI files are allowed.')
				selectedFile = null
				return
			}

			// Validar el tamaño del archivo (máximo 500MB)
			const maxSizeInBytes = 500 * 1024 * 1024 // 500MB
			if (file.size > maxSizeInBytes) {
				sendErrorNotification('File size must be less than 500MB.')
				selectedFile = null
				return
			}

			// Si pasa las validaciones, asignar el archivo
			selectedFile = file
		} else {
			selectedFile = null
		}
	}

	// Función para manejar el drag-and-drop
	const handleDrop = (event: DragEvent) => {
		event.preventDefault()
		isDragging = false
		handleFiles(event.dataTransfer.files)
	}
	const removeFile = (e) => {
		e.stopPropagation()
		selectedFile = null
		dropzoneInput.value = ''
	}
	// Función para cerrar el diálogo
	const handleContinue = () => {
		// showAlertDialog = false
		isSubmitted = false
	}
</script>

<!-- Interfaz de usuario -->
<div class="flex-1 flex flex-col">
	<div class="flex-1 p-4 bg-zinc-900 overflow-y-auto">
		<form class="space-y-6" on:submit={videoSubmit}>
			<RadioGroup.Root bind:value={inputType} class="flex space-x-4">
				<!-- Opción de archivo -->
				<div class="flex items-center space-x-2 cursor-pointer">
					<RadioGroup.Item value="file" id="file" />
					<Upload class="w-5 h-5 text-gray-400 cursor-pointer" />
					<Label for="file" class="cursor-pointer">Upload Video</Label>
				</div>

				<!-- Opción de URL -->
				<div class="flex items-center space-x-2">
					<RadioGroup.Item value="url" id="url" />
					<Link class="w-5 h-5 text-gray-400 cursor-pointer" />
					<Label for="url" class="cursor-pointer">Enter URL</Label>
				</div>
			</RadioGroup.Root>

			<RadioGroup.Root>
			<div class="flex items-center space-x-2">
				<RadioGroup.Item value="images" id="images" />
				<!-- <Images class="w-5 h-5 text-gray-400 cursor-pointer" /> -->
				<Label for="url" class="cursor-pointer">Create images frames from video</Label>
			</div>
			</RadioGroup.Root>

			<!-- Área de carga de archivos -->
			{#if inputType === 'file'}
				<div
					class="dropzone {isDragging ? 'dragging' : ''}"
					on:click={() => dropzoneInput?.click()}
					on:dragover|preventDefault
					on:dragleave={() => (isDragging = false)}
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
						<p class="text-xs text-gray-400">MP4 or AVI (MAX. 500MB)</p>
					{/if}
					<input
						type="file"
						accept="video/mp4,video/x-msvideo"
						bind:this={dropzoneInput}
						class="hidden"
						on:change={(e) => handleFiles(e.target.files)}
						disabled={!!selectedFile}
					/>
				</div>
			{:else}
				<Input
					type="url"
					placeholder="Enter Video URL here"
					class="bg-zinc-800 border-gray-600"
					bind:value={videoUrl}
				/>
			{/if}

			<!-- Botón de submit -->
			<Button
				type="submit"
				class="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
				disabled={isLoading ||
					(inputType === 'file' && !selectedFile) ||
					(inputType === 'url' && !videoUrl) ||
					isSubmitted}
			>
				{#if isLoading}
					<span>Processing...</span>
				{:else}
					<span>Process Video</span>
				{/if}
			</Button>
		</form>
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
