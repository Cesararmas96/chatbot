<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js'
	import { Input } from '$lib/components/ui/input/index.js'
	import { Label } from '$lib/components/ui/label/index.js'
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js'
	import { Upload, Trash, FileAudio, Link, CheckCircle } from 'lucide-svelte'
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import { putData } from '$lib/services/getData.js'

	import { storeUser } from '$lib/stores'
	export let data: any

	$storeUser = data.user
	const session = data.user ? data.user : $storeUser

	let inputType = 'file'
	let isDragging = false
	let selectedFile: File | null = null
	let isLoading = false
	let isSubmitted = false
	let showAlertDialog = false
	let dropzoneInput: HTMLInputElement | null = null
	let videoUrl = ''
	$: console.log(selectedFile)
	// Función para manejar el submit del archivo o URL
	const videoSubmit = async (event: Event) => {
		event.preventDefault()

		// Crear el payload para el submit
		const payload: any = {
			translate: 'es' // Campo obligatorio para ambos tipos de envío
		}

		// Verificar si se está enviando un archivo o una URL
		if (inputType === 'file' && selectedFile) {
			console.log(selectedFile)
			payload['file'] = selectedFile
			// const reader = new FileReader()

			// // Leer el archivo y enviar los datos como parte del payload
			// reader.onload = async () => {
			// 	payload.file = reader.result // Añadir el archivo leído al payload (en formato base64)
			await submitData(payload) // Llamada a la función para enviar los datos
			// }

			// reader.readAsDataURL(selectedFile)
		} else if (inputType === 'url' && videoUrl) {
			payload.video_url = videoUrl // Añadir la URL al payload
			await submitData(payload) // Llamada a la función para enviar los datos
		} else {
			sendErrorNotification('No valid input selected.')
			isLoading = false
		}
	}

	// Función para enviar los datos usando putData
	const submitData = async (payload: any) => {
		const url = `${import.meta.env.VITE_API_AI_URL}/api/v1/upload_videos`

		const formData = new FormData()

		for (const key in payload) {
			if (payload.hasOwnProperty(key)) {
				formData.append(key, payload[key])
			}
		}

		try {
			// Enviar los datos al backend usando putData
			console.log(payload)
			const headers = new Headers({ authorization: `Bearer ${$storeUser?.token}` })

			const setReport = await fetch(url, {
				method: 'PUT',
				headers,
				body: formData
			})

			// Verificar la respuesta y mostrar notificaciones
			if (setReport) {
				sendSuccessNotification(
					`${inputType === 'file' ? 'Video file' : 'Video URL'} submitted successfully`
				)
				showAlertDialog = true
				isSubmitted = true
			} else {
				sendErrorNotification('Failed to submit')
			}
		} catch (error) {
			console.error(error)
			sendErrorNotification('An error occurred while submitting')
		} finally {
			isLoading = false
		}
	}

	// Función para manejar archivos seleccionados
	// Función para manejar archivos seleccionados y validar
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
		showAlertDialog = false
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
			{#if !isSubmitted}
				<Button
					type="submit"
					class="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
					disabled={isLoading ||
						(inputType === 'file' && !selectedFile) ||
						(inputType === 'url' && !videoUrl)}
				>
					{#if isLoading}
						<span>Processing...</span>
					{:else}
						<span>Process Video</span>
					{/if}
				</Button>
			{/if}
		</form>

		<!-- Diálogo de éxito -->
		{#if showAlertDialog}
			<AlertDialog.Root open={showAlertDialog}>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<CheckCircle class="w-16 h-16 text-green-500 mx-auto" />
						<AlertDialog.Title class="text-xl font-semibold text-center"
							>Video Submitted Successfully!</AlertDialog.Title
						>
						<AlertDialog.Description class="text-center text-gray-400"
							>Your video has been sent for processing.</AlertDialog.Description
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
