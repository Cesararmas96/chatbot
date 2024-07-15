<script lang="ts">
	import BotMessage from './BotMessage.svelte'
	import LoadingMessageBot from './LoadingMessageBot.svelte'
	import LoadingMessage from './LoadingMessage.svelte'
	import QuestionMessage from './QuestionMessage.svelte'
	import WelcomeChat from './WelcomeChat.svelte'
	import { afterUpdate, onDestroy } from 'svelte'
	import VideoSection from '../video/VideoSection.svelte'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	export let handleRegenerate
	export let messages
	export let isLoading
	export let promptLibrary: any
	export let chatbotId
	export let good
	export let bad

	let isLoadingAvatar = false
	let element: HTMLDivElement
	let mediaElement: HTMLVideoElement
	let statusMessages: string[] = []
	let sessionInfo: any = null
	let peerConnection: RTCPeerConnection | null = null
	let avatarChat = false // Estado del interruptor
	const apiKey = 'ZjcwYjJlMTI5Yjc5NDA4YWI1ZTUxZmY4MDMwZWU1ZTAtMTcxODEzMDkxMA=='
	const SERVER_URL = 'https://api.heygen.com'

	async function createNewSession() {
		console.log('Creating and logging in... please wait')
		const avatar = 'josh_lite3_20230714'
		const voice = '077ab11b14f04ce0b49b5f6e5cc20979'

		try {
			sessionInfo = await newSession('low', avatar, voice)
			const { sdp: serverSdp, ice_servers2: iceServers } = sessionInfo

			peerConnection = new RTCPeerConnection({ iceServers: iceServers })

			peerConnection.ontrack = (event) => {
				console.log('Received audio/video stream')
				if (event.track.kind === 'audio' || event.track.kind === 'video') {
					mediaElement.srcObject = event.streams[0]
				}
			}

			peerConnection.ondatachannel = (event) => {
				const dataChannel = event.channel
				dataChannel.onmessage = onMessage
			}

			const remoteDescription = new RTCSessionDescription(serverSdp)
			await peerConnection.setRemoteDescription(remoteDescription)

			sendSuccessNotification('Session creation completed')
			sendSuccessNotification('Logging in... please wait')

			const localDescription = await peerConnection.createAnswer()
			await peerConnection.setLocalDescription(localDescription)

			peerConnection.onicecandidate = ({ candidate }) => {
				console.log('ICE candidate received:', candidate)
				if (candidate) {
					handleICE(sessionInfo.session_id, candidate.toJSON())
				}
			}

			peerConnection.oniceconnectionstatechange = (event) => {
				sendSuccessNotification(
					`ICE connection status changed to: ${peerConnection.iceConnectionState}`
				)
			}

			await startSession(sessionInfo.session_id, localDescription)

			const receivers = peerConnection.getReceivers()
			receivers.forEach((receiver) => {
				receiver.jitterBufferTarget = 500
			})

			sendSuccessNotification('Session started successfully')
			isLoadingAvatar = true
		} catch (error) {
			console.error('Error creating or logging in:', error)
			sendErrorNotification('Error creating or starting the session. Please try again.')
		}
	}

	function onMessage(event) {
		const message = event.data
		console.log('Message received:', message)
		// Procesar el mensaje recibido pero no llamar a handleSend aquí
	}

	async function newSession(quality, avatar_name, voice_id) {
		const response = await fetch(`${SERVER_URL}/v1/streaming.new`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Api-Key': apiKey
			},
			body: JSON.stringify({
				quality,
				avatar_name,
				voice: {
					voice_id: voice_id
				}
			})
		})
		isLoadingAvatar = true

		if (!response.ok) {
			throw new Error('Error al iniciar una nueva sesión')
		}
		const data = await response.json()
		return data.data
	}

	async function startSession(session_id, sdp) {
		const response = await fetch(`${SERVER_URL}/v1/streaming.start`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Api-Key': apiKey
			},
			body: JSON.stringify({ session_id, sdp })
		})
		isLoadingAvatar = true

		if (!response.ok) {
			throw new Error('Error al iniciar la sesión')
		}
		const data = await response.json()
		return data.data
	}

	async function handleICE(session_id, candidate) {
		const response = await fetch(`${SERVER_URL}/v1/streaming.ice`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Api-Key': apiKey
			},
			body: JSON.stringify({ session_id, candidate })
		})
		if (!response.ok) {
			throw new Error('Error al manejar el ICE candidate')
		}
		const data = await response.json()
		return data
	}

	async function repeat(session_id, text) {
		const response = await fetch(`${SERVER_URL}/v1/streaming.task`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Api-Key': apiKey
			},
			body: JSON.stringify({ session_id, text })
		})
		if (!response.ok) {
			throw new Error('Error al enviar la tarea')
		}
		const data = await response.json()
		return data.data
	}

	async function stopSession() {
		if (!sessionInfo || !sessionInfo.session_id) {
			console.log('No active session to stop')
			return
		}

		try {
			await fetch(`${SERVER_URL}/v1/streaming.stop`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Api-Key': apiKey
				},
				body: JSON.stringify({ session_id: sessionInfo.session_id })
			})
			console.log('Session stopped successfully')
			sessionInfo = null
		} catch (error) {
			console.error('Error stopping session:', error)
			console.log('Error stopping session. Please try again.')
		}
	}

	// Manejar el envío de la tarea
	async function handleSend(text) {
		if (!sessionInfo || !sessionInfo.session_id) {
			console.log('Please create a connection first')
			return
		}
		console.log('Sending assignment... please wait')
		try {
			await repeat(sessionInfo.session_id, text)
			console.log('Task submitted successfully')
		} catch (error) {
			console.error('Error submitting assignment:', error)
			console.log('Error submitting assignment. Please try again.')
		}
	}

	// Scroll al fondo después de cada actualización
	afterUpdate(() => {
		if (element) {
			scrollToBottom(element)
		}
	})

	function scrollToBottom(node: HTMLDivElement) {
		node.scroll({ top: node.scrollHeight, behavior: 'smooth' })
	}

	// onDestroy(() => {
	//   stopSession();
	// });

	function handleSelectQuery(event) {
		dispatch('selectQuery', { query: event.detail.query })
	}
</script>

<!-- Botón Switch para alternar avatarChat -->
<!-- <div class="flex justify-center mb-5">
	<span class="mr-2 {!avatarChat ? 'font-medium text-blue-700' : 'text-gray-300'}">Chat</span>
	<label class="switch">
		<input
			type="checkbox"
			bind:checked={avatarChat}
			on:change={avatarChat ? createNewSession : stopSession}
		/>
		<span class="slider round"></span>
	</label>
	<span class="ml-2 {avatarChat ? 'font-medium text-blue-700' : 'text-gray-300'} "
		>Video Avatar</span
	>
</div> -->

<div
	class="flex flex-auto overflow-x-auto rounded-2xl bg-gray-100 chatbox dark:bg-gray-800 ml-2 mr-2"
>
	{#if messages && messages.length > 0}
		{#if avatarChat}
			<div id="avatar" class="w-full mt-2 h-auto text-center">
				<div class="">
					<VideoSection bind:mediaElement {isLoadingAvatar} />
				</div>
				<div class="mt-5">
					<button
						class="bg-yellow-500 ml-2 text-white py-2 px-4 rounded"
						on:click={createNewSession}
						><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
							><path
								fill="currentColor"
								d="M12 5V1L7 6l5 5V7a6 6 0 0 1 6 6a6 6 0 0 1-6 6a6 6 0 0 1-6-6H4a8 8 0 0 0 8 8a8 8 0 0 0 8-8a8 8 0 0 0-8-8"
							/></svg
						></button
					>
					<button class="bg-red-500 text-white py-2 px-4 rounded" on:click={stopSession}
						><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
							><path fill="currentColor" d="M3 5v14l8-7m2 7h3V5h-3m5 0v14h3V5" /></svg
						></button
					>
				</div>
			</div>

			{#each messages as message, index}
				{#if index === messages.length - 1}
					{#await handleSend(message.answer)}
						<!-- Mostrar mensaje de carga -->
						<!-- <LoadingMessage /> -->
					{/await}
				{/if}
			{/each}
		{:else}
			<div id="chat" class="w-full flex flex-col h-full">
				<div class="grid grid-cols-12 gap-y-2 overflow-auto" bind:this={element}>
					{#each messages as message, index}
						<QuestionMessage {message} />
						<BotMessage
							{message}
							{good}
							{bad}
							{chatbotId}
							on:scrollToBottom={() => scrollToBottom(element)}
							{handleRegenerate}
							last={index === messages.length - 1 ? 'true' : 'false'}
						/>
					{/each}

					{#if isLoading}
						<LoadingMessage />
						<LoadingMessageBot />
					{/if}
				</div>
			</div>
		{/if}
	{:else}
		<WelcomeChat on:selectQuery={handleSelectQuery} {promptLibrary} />
	{/if}
</div>

<style>
	.switch {
		position: relative;
		display: inline-block;
		width: 34px;
		height: 20px;
	}

	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #4451c2;
		transition: 0.4s;
	}

	.slider:before {
		position: absolute;
		content: '';
		height: 14px;
		width: 14px;
		left: 3px;
		bottom: 3px;
		background-color: white;
		transition: 0.4s;
	}
	/* 
  input:checked + .slider {
    background-color: #2196F3;
  } */

	input:checked + .slider:before {
		transform: translateX(14px);
	}

	.slider.round {
		border-radius: 34px;
	}

	.slider.round:before {
		border-radius: 50%;
	}
</style>
