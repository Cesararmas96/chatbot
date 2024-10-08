<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js'
	import { Input } from '$lib/components/ui/input/index.js'
	import { Label } from '$lib/components/ui/label/index.js'
	import { Upload, Trash, FileAudio, Link } from 'lucide-svelte'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import { formData } from '$lib/services/getData.js'
	import { jobsListStore } from '$lib/stores/jobsStore'
	import { storeUser } from '$lib/stores'
	import { getApiData } from '$lib/services/getData'
	import * as Card from '$lib/components/ui/card'
	import * as Tabs from '$lib/components/ui/tabs'
	import { Switch } from '$lib/components/ui/switch/index.js'
	import { Slider } from '$lib/components/ui/slider'
	export let data: any

	$storeUser = data.user
	const session = data.user ? data.user : $storeUser

	let selectedFile: File | null = null
	let isLoading = false
	let isSubmitted = false
	let dropzoneInput: HTMLInputElement | null = null
	let videoUrl = ''
	let activeTab = 'file' // Tab activo, empieza con el tab de file

	let createImagesFromVideo = false // Estado del checkbox
	let numSeconds = 0 // Valor por defecto del input number

	// Resetear el campo URL o archivo al cambiar de tab
	const resetFields = (tab: string) => {
		isSubmitted = false // Restablecer isSubmitted al cambiar de tab
		if (tab === 'file') {
			videoUrl = '' // Limpiar URL cuando se selecciona el tab de archivo
		} else {
			selectedFile = null // Limpiar archivo cuando se selecciona el tab de URL
			if (dropzoneInput) {
				dropzoneInput.value = '' // Limpiar visualmente el campo de archivo
			}
		}
	}

	const videoSubmit = async (event: Event) => {
		event.preventDefault()
		isLoading = true // Deshabilitar el botón antes del envío

		try {
			const payload: any = {
				translate: 'es' // Campo obligatorio
			}

			// Solo enviar el archivo si está seleccionado el tab de archivo
			if (activeTab === 'file' && selectedFile) {
				payload['file'] = selectedFile
			}
			// Solo enviar la URL si está seleccionado el tab de URL
			else if (activeTab === 'url' && videoUrl) {
				payload.video_url = videoUrl
			} else {
				sendErrorNotification('No valid input selected.')
				return
			}

			// Verificar si se seleccionó la opción de crear imágenes desde el video
			if (createImagesFromVideo) {
				payload['split_frames'] = true
				payload['num_seconds'] = numSeconds
			}

			console.log('Payload being submitted:', payload)
			await submitData(payload) // Llamada a la función para enviar los datos
		} catch (error) {
			sendErrorNotification('An error occurred during submission')
		} finally {
			isLoading = false
		}
	}

	const submitData = async (payload: any) => {
		const url = `${import.meta.env.VITE_API_AI_URL}/api/v1/upload_videossss`
		try {
			const response = await formData(url, payload, 'PUT')
			if (response.ok) {
				sendSuccessNotification(
					`${activeTab === 'file' ? 'Video file' : 'Video URL'} submitted successfully`
				)
				isSubmitted = true
				selectedFile = null
				videoUrl = ''
				createImagesFromVideo = false // Resetear el estado del switch
				numSeconds = 0 // Resetear el valor del slider
				if (dropzoneInput) {
					dropzoneInput.value = ''
				}
				await fetchJobs() // Llamada a la función para obtener la lista de trabajos
			} else {
				sendErrorNotification(response.message || 'Failed to submit')
			}
		} catch (error) {
			sendErrorNotification('An error occurred while submitting')
		}
	}

	const fetchJobs = async () => {
		isLoading = true
		try {
			const fetchedJobs = await getApiData(
				'https://ai.trocdigital.net/api/v1/upload_videos',
				'GET',
				{} as any,
				{} as any,
				{
					headers: {
						Authorization: `Bearer ${session.token}`,
						'Content-Type': 'application/json'
					}
				}
			)
			jobsListStore.set(fetchedJobs.jobs)
		} catch (error) {
			sendErrorNotification('Error fetching jobs')
		} finally {
			isLoading = false
		}
	}

	const handleFiles = (files: FileList) => {
		isSubmitted = false // Restablecer isSubmitted al seleccionar un archivo nuevo
		if (files.length > 0) {
			const file = files[0]
			const validExtensions = ['video/mp4', 'video/x-msvideo']
			if (!validExtensions.includes(file.type)) {
				sendErrorNotification('Only MP4 or AVI files are allowed.')
				selectedFile = null
				return
			}

			const maxSizeInBytes = 500 * 1024 * 1024
			if (file.size > maxSizeInBytes) {
				sendErrorNotification('File size must be less than 500MB.')
				selectedFile = null
				return
			}

			selectedFile = file
		} else {
			selectedFile = null
		}
	}

	const handleDrop = (event: DragEvent) => {
		event.preventDefault()
		handleFiles(event.dataTransfer.files)
	}

	const removeFile = (e) => {
		e.stopPropagation()
		selectedFile = null
		isSubmitted = false // Restablecer isSubmitted al eliminar un archivo
		if (dropzoneInput) {
			dropzoneInput.value = ''
		}
	}
</script>

<!-- Interfaz de usuario con Tabs -->
<div class="flex-1 flex flex-col p-4 bg-zinc-900 overflow-y-auto">
	<div>
		<Card.Root>
			<Card.Header>
				<Card.Title class="pt-4 pl-4">Video Processor</Card.Title>
			</Card.Header>

			<Card.Content>
				<div class="flex-1 flex flex-col">
					<div class="flex-1 pl-4 pr-4 pb-4 overflow-y-auto">
						<form class="space-y-6" on:submit={videoSubmit}>
							<!-- Reemplazar RadioGroup por Tabs -->
							<Tabs.Root value="file" class="w-full" on:valueChange={resetFields}>
								<Tabs.List class="mb-4">
									<Tabs.Trigger
										value="file"
										on:click={() => (activeTab = 'file')}
										class="flex items-center"
									>
										<Upload class="mr-2 h-4 w-4" /> Video</Tabs.Trigger
									>
									<Tabs.Trigger
										value="url"
										on:click={() => (activeTab = 'url')}
										class="flex items-center"><Link class="mr-2 h-4 w-4" /> Enter URL</Tabs.Trigger
									>
								</Tabs.List>

								<!-- Tab para subir archivo de video -->
								<Tabs.Content value="file">
									<div
										class="dropzone"
										on:click={() => dropzoneInput?.click()}
										on:dragover|preventDefault
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
								</Tabs.Content>

								<!-- Tab para ingresar URL del video -->
								<Tabs.Content value="url">
									<Input
										type="url"
										placeholder="Enter Video URL here"
										class="border-gray-600"
										bind:value={videoUrl}
										on:input={() => (isSubmitted = false)}
									/>
								</Tabs.Content>
							</Tabs.Root>

							<!-- Checkbox para crear imágenes desde el video -->
							<div class="flex items-center space-x-2">
								<Switch
									id="createImages"
									aria-readonly
									includeInput
									bind:checked={createImagesFromVideo}
								/>
								<Label for="createImages" class="cursor-pointer"
									>Create images frames from video</Label
								>
							</div>

							<!-- Slider para ingresar los segundos entre frames -->
							{#if createImagesFromVideo}
								<div class="space-y-2">
									<Label for="seconds-between-frames">Seconds between frames</Label>
									<div class="flex items-center space-x-4">
										<!-- Slider para seleccionar los segundos entre frames -->
										<Slider
											id="seconds-between-frames"
											min={1}
											max={100}
											step={1}
											value={[numSeconds]}
											onValueChange={([value]) => (numSeconds = value)}
											class="flex-grow"
										/>

										<!-- Input numérico que refleja el valor del slider -->
										<Input
											type="number"
											bind:value={numSeconds}
											class="w-20"
											min="1"
											max="100"
											step="1"
										/>
									</div>
								</div>
							{/if}

							<!-- Botón de submit -->
							<Button
								type="submit"
								class="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
								disabled={isLoading || (!selectedFile && !videoUrl) || isSubmitted}
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
			</Card.Content>
		</Card.Root>
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

	.file-info {
		display: flex;
		align-items: center;
		color: white;
	}
</style>
