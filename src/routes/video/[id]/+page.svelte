<script lang="ts">
	import { onMount } from 'svelte'
	import { Input } from '$lib/components/ui/input/index.js'
	import { Button } from '$lib/components/ui/button/index.js'
	import { Textarea } from '$lib/components/ui/textarea/index.js'
	import * as Card from '$lib/components/ui/card'
	import { Separator } from '$lib/components/ui/separator/index.js'
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js'
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar'
	import { Badge } from '$lib/components/ui/badge'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import {
		Download,
		Copy,
		FileTextIcon,
		LogOut,
		Settings,
		FileAudio,
		FileIcon,
		AlertCircle,
		VideoIcon
	} from 'lucide-svelte'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import { getApiData } from '$lib/services/getData'
	import { page } from '$app/stores'

	import { storeUser } from '$lib/stores'
	import { Footer } from 'flowbite-svelte'
	export let data: any

	$storeUser = data.user
	const session = data.user ? data.user : $storeUser

	let audioFile = {
		status: '',
		video_path: '',

		video: [
			{
				url: '',
				source: '',
				filename: '',
				type: '',
				source_type: '',
				transcript: '',
				summary: '',
				vtt: '',
				summary_file: ''
			}
		]
	}

	let isLoading = true
	let errorMessage = ''

	//Obtener el Id del parametro de la Url
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

			console.log(fetchedAudio)

			if (fetchedAudio) {
				// Asignar los datos recibidos al objeto audioFile
				audioFile = {
					name: fetchedAudio.video_path || 'Unknown Name',
					summary: fetchedAudio.video[0].summary || 'No available',
					vtt: fetchedAudio.video[0].vtt || 'No  available',
					summary_file: fetchedAudio.video[0].summary_file || 'No  available',
					transcript: fetchedAudio.video[0].transcript || 'No  available',
					filename: fetchedAudio.video[0].filename || 'No  available',
					status: fetchedAudio.status || 'pending'
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
	// Reactividad: Detectar cambios en el ID de la URL
	$: if (audioId) {
		// Reiniciar el estado cuando cambie el ID
		isLoading = true
		errorMessage = ''
		fetchAudioData() // Volver a cargar los datos con el nuevo ID
	}
	// Llamar a la función cuando el componente se monte
	onMount(() => {
		fetchAudioData()
	})

	const handleDownloadVTT = async (vttUrl) => {
		try {
			const response = await fetch(vttUrl) // Hacer una solicitud fetch a la URL del VTT
			if (!response.ok) {
				throw new Error('Network response was not ok')
			}
			const blob = await response.blob() // Convertir la respuesta a un Blob (archivo)

			// Crear un enlace de descarga temporal
			const element = document.createElement('a')
			const url = URL.createObjectURL(blob) // Crear una URL para el Blob
			element.href = url
			element.download = audioFile.name.replace('/tmp/', '').replace(/\.(mp4|avi)$/, '') + '.vtt' // Nombre sugerido para el archivo descargado
			document.body.appendChild(element)
			element.click() // Simular el clic
			document.body.removeChild(element) // Eliminar el enlace después de descargar

			// Liberar la URL creada
			URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Error downloading VTT file:', error)
			sendErrorNotification('Failed to download VTT file.')
		}
	}

	const handleDownloadSummaryFile = async (summary_file) => {
		try {
			const response = await fetch(summary_file) // Hacer una solicitud fetch a la URL del VTT
			if (!response.ok) {
				throw new Error('Network response was not ok')
			}
			const blob = await response.blob() // Convertir la respuesta a un Blob (archivo)

			// Crear un enlace de descarga temporal
			const element = document.createElement('a')
			const url = URL.createObjectURL(blob) // Crear una URL para el Blob
			element.href = url
			element.download =
				audioFile.name.replace('/tmp/', '').replace(/\.(mp4|avi)$/, '') + '.summary' // Nombre sugerido para el archivo descargado
			document.body.appendChild(element)
			element.click() // Simular el clic
			document.body.removeChild(element) // Eliminar el enlace después de descargar

			// Liberar la URL creada
			URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Error downloading summary file:', error)
			sendErrorNotification('Failed to download summary file.')
		}
	}

	const handleDownloadTranscript = async (transcript) => {
		try {
			const response = await fetch(transcript) // Hacer una solicitud fetch a la URL del VTT
			if (!response.ok) {
				throw new Error('Network response was not ok')
			}
			const blob = await response.blob() // Convertir la respuesta a un Blob (archivo)

			// Crear un enlace de descarga temporal
			const element = document.createElement('a')
			const url = URL.createObjectURL(blob) // Crear una URL para el Blob
			element.href = url
			element.download = audioFile.name.replace('/tmp/', '').replace(/\.(mp4|avi)$/, '') + '.txt' // Nombre sugerido para el archivo descargado
			document.body.appendChild(element)
			element.click() // Simular el clic
			document.body.removeChild(element) // Eliminar el enlace después de descargar

			// Liberar la URL creada
			URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Error downloading transcript file:', error)
			sendErrorNotification('Failed to download transcript file.')
		}
	}

	const handleDownloadFilename = async (filename) => {
		try {
			const response = await fetch(filename) // Hacer una solicitud fetch a la URL del VTT
			if (!response.ok) {
				throw new Error('Network response was not ok')
			}
			const blob = await response.blob() // Convertir la respuesta a un Blob (archivo)

			// Crear un enlace de descarga temporal
			const element = document.createElement('a')
			const url = URL.createObjectURL(blob) // Crear una URL para el Blob
			element.href = url
			element.download = audioFile.name.replace('/tmp/', '') // Nombre sugerido para el archivo descargado
			document.body.appendChild(element)
			element.click() // Simular el clic
			document.body.removeChild(element) // Eliminar el enlace después de descargar

			// Liberar la URL creada
			URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Error downloading filename:', error)
			sendErrorNotification('Failed to download filename .')
		}
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

<!-- Aquí renderizas el contenido basado en el estado de carga y si hay errores -->
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
	{:else}
		<div>
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-2xl font-bold">{audioFile.name.replace('/tmp/', '')}</h2>
				<Badge
					class={audioFile.status === 'done'
						? 'bg-green-400'
						: audioFile.status === 'processing'
							? 'bg-yellow-400'
							: 'bg-red-400'}
					variant={audioFile.status === 'done' ? 'success' : 'warning'}
				>
					{audioFile.status === 'done' ? 'Done' : 'Processing'}
				</Badge>
			</div>

			<Card.Root class="border-gray-700">
				<Card.Header class="flex">
					<Card.Title>Source File</Card.Title>
				</Card.Header>
				<Card.Content>
					<!-- Reproductor de video -->
					{#if audioFile.filename.endsWith('.mp4') || audioFile.filename.endsWith('.avi')}
						<video controls class="w-[300px] rounded-md">
							<source src={audioFile.filename} type="video/mp4" />
							Sorry, your browser doesn't support embedded videos.
						</video>
					{/if}

					<div class="mt-4">
						<Button variant="outline" size="sm" on:click={() => handleCopy(audioFile.filename)}>
							<Copy class="h-4 w-4 mr-1" /> Copy Link
						</Button>
						<Button
							variant="outline"
							size="sm"
							on:click={() => handleDownloadFilename(audioFile.filename)}
						>
							<VideoIcon class="mr-2 h-4 w-4" />
							Download File
						</Button>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root class="mt-6 border-gray-700">
				<Card.Header class="flex">
					<Card.Title>Summary</Card.Title>
				</Card.Header>
				<Card.Content>
					<p>{audioFile.summary}</p>
					<div class="mt-4">
						<Button variant="outline" size="sm" on:click={() => handleCopy(audioFile.summary)}>
							<Copy class="h-4 w-4 mr-1" /> Copy
						</Button>
						<Button
							variant="outline"
							size="sm"
							on:click={() => handleDownloadSummaryFile(audioFile.summary_file)}
						>
							<FileTextIcon class="mr-2 h-4 w-4" />
							Download
						</Button>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root class="mt-6 mb-6  border-gray-700">
				<Card.Header>
					<Card.Title>Download Options</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="flex flex-wrap gap-2">
						<Button
							variant="outline"
							size="sm"
							on:click={() => handleDownloadTranscript(audioFile.transcript)}
						>
							<FileTextIcon class="mr-2 h-4 w-4" />
							Download Transcript
						</Button>
						<Button variant="outline" size="sm" on:click={() => handleDownloadVTT(audioFile.vtt)}>
							<FileIcon class="mr-2 h-4 w-4" />
							Download VTT
						</Button>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	{/if}
</div>

<style>
	/* Styling for the loader */
	.loader {
		border: 4px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		border-top: 4px solid #fff;
		width: 40px;
		height: 40px;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
