<script lang="ts">
	import { marked } from 'marked'
	import { onMount } from 'svelte'
	import { Button } from '$lib/components/ui/button/index.js'
	import * as Card from '$lib/components/ui/card'
	import { Badge } from '$lib/components/ui/badge'
	import {
		Copy,
		FileTextIcon,
		FileAudio,
		FileIcon,
		AlertCircle,
		Headphones,
		FolderArchive
	} from 'lucide-svelte'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import { getApiData } from '$lib/services/getData'
	import { page } from '$app/stores'

	import { storeUser } from '$lib/stores'

	import { Lightbox } from 'svelte-lightbox'

	import JSZip from 'jszip' // Importa JSZip
	import saveAs from 'file-saver' // Importa FileSaver para la descarga

	export let data: any

	$storeUser = data.user
	const session = data.user ? data.user : $storeUser

	let audioFile = {
		status: '',
		video_path: '',
		error: '',
		video: {
			url: '',
			source: '',
			filename: '',
			type: '',
			source_type: '',
			transcript: '',
			summary: '',
			vtt: '',
			summary_file: '',
			audio: '',
			zip: ''
		}
	}

	let isLoading = true
	let errorMessage = ''

	$: audioId = $page.params.id

	console.log(audioId)

	const fetchAudioData = async () => {
		const apiUrl = `${import.meta.env.VITE_API_AI_URL}/api/v1/upload_videos/${audioId}`

		try {
			const fetchedAudio = await getApiData(
				apiUrl,
				'GET',
				{},
				{},
				{
					headers: {
						Authorization: `Bearer ${session.token}`,
						'Content-Type': 'application/json'
					}
				},
				null,
				true
			)

			if (fetchedAudio) {
				// Asignar los datos recibidos al objeto audioFile, y asegurarse de que todos los campos opcionales existan
				audioFile = {
					...audioFile,
					status: fetchedAudio.status || 'pending',
					video_path: fetchedAudio.video_path || 'Unknown Name',
					error: fetchedAudio.error || '',
					video: fetchedAudio.video
						? {
								// Verifica si fetchedAudio.video existe antes de acceder a sus propiedades
								...audioFile.video, // Mantener los datos actuales
								...fetchedAudio.video, // Reemplazar con los nuevos datos si existen
								frames: fetchedAudio.video.frames || [] // Proveer un arreglo vacío si no hay frames
							}
						: {
								// Si no existe fetchedAudio.video, provee un objeto vacío con los campos esperados
								url: '',
								source: '',
								filename: '',
								type: '',
								source_type: '',
								transcript: '',
								summary: '',
								vtt: '',
								summary_file: '',
								audio: '',
								zip: ''
							}
				}
			} else {
				// Si no se encuentra el audio, asignar un mensaje de error
				errorMessage = `Audio with ID ${audioId} not found.`
			}
		} catch (error) {
			console.error('Error fetching audio:', error)
			errorMessage = 'An error occurred while fetching the audio data.'
		} finally {
			isLoading = false
		}
	}

	$: if (audioId) {
		isLoading = true
		errorMessage = ''
		audioFile = {
			status: '',
			video_path: '',
			error: '',
			video: {
				url: '',
				source: '',
				filename: '',
				type: '',
				source_type: '',
				transcript: '',
				summary: '',
				vtt: '',
				summary_file: '',
				audio: '',
				zip: ''
			}
		} // Reinicia audioFile antes de la nueva llamada

		fetchAudioData() // Volver a cargar los datos con el nuevo ID
	}

	onMount(() => {
		fetchAudioData()
	})

	const handleDownloadFile = async (fileUrl, fileName, fileExtension) => {
		try {
			// Realiza una solicitud para obtener el archivo
			const response = await fetch(fileUrl)
			if (!response.ok) throw new Error('Error fetching the file')

			// Obtiene el blob del archivo
			const blob = await response.blob()

			// Crea un objeto URL para el blob
			const downloadUrl = URL.createObjectURL(blob)

			// Crea un elemento <a> dinámicamente y establece los atributos para forzar la descarga
			const element = document.createElement('a')
			element.href = downloadUrl
			element.download = `${fileName}.${fileExtension}` // Nombre del archivo con extensión
			document.body.appendChild(element)
			element.click() // Desencadena la descarga
			document.body.removeChild(element) // Elimina el elemento <a> del DOM
			URL.revokeObjectURL(downloadUrl) // Libera el URL del blob
		} catch (error) {
			sendErrorNotification(`Failed to download the ${fileExtension} file.`)
		}
	}

	const handleDownloadTranscript = () => {
		const transcriptUrl = audioFile.video.transcript
		const fileName = audioFile.video_path.replace('/tmp/', '').replace(/\.(mp4|avi)$/, '')
		handleDownloadFile(transcriptUrl, fileName, 'txt')
	}

	const handleDownloadVTT = () => {
		const vttUrl = audioFile.video.vtt
		const fileName = audioFile.video_path.replace('/tmp/', '').replace(/\.(mp4|avi)$/, '')
		handleDownloadFile(vttUrl, fileName, 'vtt')
	}

	const handleDownloadSummary = () => {
		const summaryUrl = audioFile.video.summary_file
		const fileName = audioFile.video_path.replace('/tmp/', '').replace(/\.(mp4|avi)$/, '')
		handleDownloadFile(summaryUrl, fileName, 'summary')
	}

	const handleDownloadAudio = () => {
		const audioUrl = audioFile.video.audio
		const fileName = audioFile.video_path.replace('/tmp/', '').replace(/\.(mp4|avi)$/, '')
		handleDownloadFile(audioUrl, fileName, 'mp3')
	}

	const handleDownloadZip = () => {
		const audioZip = audioFile.video.zip
		const fileName = audioFile.video_path.replace('/tmp/', '').replace(/\.(mp4|avi)$/, '')
		handleDownloadFile(audioZip, fileName, 'zip')
	}

	const handleDownloadVideo = () => {
		const audioVideo = audioFile.video.video
		const fileName = audioFile.video_path.replace('/tmp/', '').replace(/\.(mp4|avi)$/, '')
		handleDownloadFile(audioVideo, fileName, 'mp4')
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

	let selectedFrames = new Set()
	let showCheckboxes = false

	// Añadir o quitar un frame seleccionado
	const toggleFrameSelection = (frame) => {
		if (selectedFrames.has(frame)) {
			selectedFrames.delete(frame)
		} else {
			selectedFrames.add(frame)
		}
	}

	const toggleShowCheckboxes = () => {
		showCheckboxes = !showCheckboxes
	}

	// Descargar imágenes seleccionadas como un archivo ZIP
	const downloadSelectedFramesAsZip = async () => {
		if (selectedFrames.size === 0) {
			sendErrorNotification('No frames selected.')
			return // No hay frames seleccionados
		}

		const zip = new JSZip()
		const folder = zip.folder('frames')

		// Convertir Set a Array para usar con Promise.all
		const framesArray = Array.from(selectedFrames)

		try {
			// Realizar todas las solicitudes fetch en paralelo usando Promise.all
			const fetchPromises = framesArray.map(async (frame) => {
				const response = await fetch(`${import.meta.env.VITE_API_AI_URL}/gcs/files/${frame}`)
				if (!response.ok) throw new Error(`Failed to fetch ${frame}`)
				const blob = await response.blob()
				folder.file(frame.split('/').pop(), blob) // Guardar la imagen en el ZIP
			})

			// Esperar que todas las promesas de fetch se resuelvan
			await Promise.all(fetchPromises)

			// Generar el archivo ZIP
			const content = await zip.generateAsync({ type: 'blob' })
			saveAs(content, 'selected-frames.zip') // Descarga el archivo ZIP
		} catch (error) {
			sendErrorNotification('Error creating ZIP file:', error)
		}
	}

	let currentPage = 1 // Página actual
	const itemsPerPage = 30 // 6 columnas x 5 filas = 30 imágenes por página
	// Función para obtener las imágenes de la página actual
	const getCurrentPageItems = () => {
		const start = (currentPage - 1) * itemsPerPage
		const end = start + itemsPerPage
		return audioFile.video.frames.slice(start, end)
	}

	// Función para cambiar de página
	const changePage = (page) => {
		currentPage = page
	}
</script>

<div class="flex-1 flex flex-col p-4 bg-zinc-900 overflow-y-auto">
	{#if isLoading}
		<div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
			<div class="loader"></div>
		</div>
	{:else if errorMessage}
		<div class="flex items-center justify-center h-[100%]">
			<Card.Root class="w-full max-w-md">
				<Card.Header>
					<Card.Title
						class="flex items-center justify-center text-2xl font-bold text-red-600 dark:text-red-400"
					>
						<AlertCircle class="w-8 h-8 mr-2" />
						Audio Not Found
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-center text-gray-600 dark:text-gray-300 mb-6">
						The audio file you're looking for is either invalid or not found. Please check the ID
						and try again.
					</p>
					<div class="flex justify-center">
						<a href="/video">
							<Button variant="outline">
								<FileAudio class="w-4 h-4 mr-2" />
								Back to Home
							</Button>
						</a>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	{:else if audioFile.status === 'done' && audioFile.error}
		<div class="flex items-center justify-center h-[100%]">
			<Card.Root class="w-full max-w-md">
				<Card.Header>
					<Card.Title
						class="flex flex-col justify-center items-center  text-2xl font-bold text-red-600 dark:text-red-400"
					>
						<AlertCircle class=" w-12 h-12 mr-2" />
						Error Processing Audio
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-center text-gray-600 dark:text-gray-300 mb-6">
						There was an error processing the audio file: {audioFile.error}.
					</p>
				</Card.Content>
			</Card.Root>
		</div>
	{:else if audioFile.status === 'processing'}
		<div class="flex items-center justify-center h-[100%]">
			<Card.Root class="w-full max-w-md">
				<Card.Header>
					<Card.Title
						class="flex flex-col justify-center items-center  text-2xl font-bold text-yellow-600 dark:text-yellow-400"
					>
						<AlertCircle class=" w-12 h-12 mr-2" />
						<h2 class="text-center mt-2">Audio is currently being processed</h2>
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-center text-gray-600 dark:text-gray-300 mb-6">
						The audio file is still being processed. Please check back later.
					</p>
				</Card.Content>
			</Card.Root>
		</div>
	{:else if audioFile.status === 'done'}
		<div>
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-2xl font-bold">{audioFile.video_path.replace('/var/tmp/', '')}</h2>
				<Badge class="bg-green-400" variant="success">Done</Badge>
			</div>

			<Card.Root class="border-gray-700">
				<Card.Header class="flex">
					<Card.Title>Source File</Card.Title>
				</Card.Header>
				<Card.Content>
					{#if audioFile.video.video.endsWith('.mp4') || audioFile.video.video.endsWith('.avi')}
						<video controls class="w-[350px] rounded-md">
							<source
								src={audioFile.video.video}
								type={audioFile.video.video.endsWith('.mp4') ? 'video/mp4' : 'video/x-msvideo'}
							/>
							{#if audioFile.video.vtt}
								<track
									kind="captions"
									src={audioFile.video.vtt}
									srclang="en"
									label="English"
									default
								/>
							{/if}
							Sorry, your browser doesn't support embedded videos.
						</video>
					{/if}
				</Card.Content>
			</Card.Root>

			<Card.Root class="mt-6 border-gray-700">
				<Card.Header class="flex">
					<Card.Title>Summary</Card.Title>
				</Card.Header>
				<Card.Content>
					{#if audioFile.video.summary}
						<div class="summary">{@html marked(audioFile.video.summary)}</div>
						<div class="mt-4">
							<Button
								variant="outline"
								size="sm"
								on:click={() => handleCopy(audioFile.video.summary)}
							>
								<Copy class="h-4 w-4 mr-1" /> Copy
							</Button>
							{#if audioFile.video.summary_file}
								<Button variant="outline" size="sm" on:click={handleDownloadSummary}>
									<FileTextIcon class="mr-2 h-4 w-4" />
									Download
								</Button>
							{/if}
						</div>
					{:else}
						<p>No summary available.</p>
					{/if}
				</Card.Content>
			</Card.Root>

			<Card.Root class="mt-6 border-gray-700">
				<Card.Header class="flex">
					<Card.Title>Gallery</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="gallery-container">
						<!-- Mostrar mensaje si no hay imágenes disponibles -->
						{#if getCurrentPageItems().length === 0}
							<p>No frames available for this video.</p>
						{:else}
							<div class="mb-5 flex justify-end">
								<!-- Botón para activar los checkboxes -->
								<Button variant="outline" size="sm" on:click={toggleShowCheckboxes}>
									{showCheckboxes ? 'Cancel Selection' : 'Select Photos'}
								</Button>

								<!-- Si los checkboxes están visibles, mostrar el botón de descarga -->
								{#if showCheckboxes}
									<Button
										class="ml-2"
										variant="outline"
										size="sm"
										on:click={downloadSelectedFramesAsZip}
									>
										Download Selected
									</Button>
								{/if}
							</div>

							<!-- Galería con CSS Grid de 5 columnas -->
							<div class="grid-container">
								{#each getCurrentPageItems() as framesImg}
									<div class="image-item">
										<!-- Solo mostrar checkboxes si se ha activado la selección -->
										{#if showCheckboxes}
											<input
												type="checkbox"
												id={framesImg}
												on:change={() => toggleFrameSelection(framesImg)}
												class="checkboxGallery"
											/>
										{/if}
										<Lightbox description={framesImg}>
											<figure class="shrink-0">
												<div class="overflow-hidden rounded-md">
													<img
														src={`${import.meta.env.VITE_API_AI_URL}/gcs/files/${framesImg}`}
														alt={framesImg}
														class="gallery-image"
														width="350"
														height="250"
													/>
												</div>
											</figure>
										</Lightbox>
									</div>
								{/each}
							</div>

							<!-- Paginación -->
							<div class="pagination">
								{#if currentPage > 1}
									<Button variant="outline" size="sm" on:click={() => changePage(currentPage - 1)}>
										Previous
									</Button>
								{/if}

								{#if getCurrentPageItems().length === itemsPerPage}
									<Button variant="outline" size="sm" on:click={() => changePage(currentPage + 1)}>
										Next
									</Button>
								{/if}
							</div>
						{/if}
					</div>
				</Card.Content>
			</Card.Root>
			<Card.Root class="mt-6 mb-6 border-gray-700">
				<Card.Header>
					<Card.Title>Download Options</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="flex flex-wrap gap-2">
						{#if audioFile.video.transcript}
							<Button variant="outline" size="sm" on:click={handleDownloadTranscript}>
								<FileTextIcon class="mr-2 h-4 w-4" /> Transcript
							</Button>
						{/if}

						{#if audioFile.video.vtt}
							<Button variant="outline" size="sm" on:click={handleDownloadVTT}>
								<FileIcon class="mr-2 h-4 w-4" /> VTT
							</Button>
						{/if}

						{#if audioFile.video.audio}
							<Button variant="outline" size="sm" on:click={handleDownloadAudio}>
								<Headphones class="mr-2 h-4 w-4" /> Audio
							</Button>
						{/if}

						{#if audioFile.video.zip}
							<Button variant="outline" size="sm" on:click={handleDownloadZip}>
								<FolderArchive class="mr-2 h-4 w-4" /> Gallery
							</Button>
						{/if}
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	{/if}
</div>

<style>
	.loader {
		border: 4px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		border-top: 4px solid #fff;
		width: 40px;
		height: 40px;
		animation: spin 1s linear infinite;
	}

	.checkboxGallery {
		/* width: 20px; */
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.grid-container {
		display: grid;
		grid-template-columns: repeat(5, 1fr); /* Cinco columnas de igual tamaño */
		gap: 16px; /* Espacio entre las imágenes */
	}

	.image-item {
		position: relative; /* Para posicionar el checkbox si es necesario */
	}

	.checkboxGallery {
		position: absolute;
		top: 8px;
		left: 8px;
		z-index: 10;
	}

	/* .gallery-image {
		width: 100%;
		height: auto;
		object-fit: cover;
		transition: transform 0.3s ease;
	} */

	.gallery-image:hover {
		transform: scale(1.05); /* Efecto de hover */
	}

	.pagination {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}
</style>
