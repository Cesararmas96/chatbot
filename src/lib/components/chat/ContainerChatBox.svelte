<script lang="ts">
  import BotMessage from "./BotMessage.svelte";
  import LoadingMessageBot from "./LoadingMessageBot.svelte";
  import LoadingMessage from "./LoadingMessage.svelte";
  import QuestionMessage from "./QuestionMessage.svelte";
  import WelcomeChat from "./WelcomeChat.svelte";
  import { afterUpdate, onDestroy } from "svelte";
  import VideoSection from "../video/VideoSection.svelte";

  export let handleRegenerate;
  export let messages;
  export let isLoading;

  let element: HTMLDivElement;
  let mediaElement: HTMLVideoElement;
  let statusMessages: string[] = [];
  let sessionInfo: any = null;
  let peerConnection: RTCPeerConnection | null = null;

  const apiKey = 'ZjcwYjJlMTI5Yjc5NDA4YWI1ZTUxZmY4MDMwZWU1ZTAtMTcxODEzMDkxMA==';
  const SERVER_URL = 'https://api.heygen.com';

  async function createNewSession() {
    console.log('Creando y iniciando sesión... por favor espera');
    const avatar = 'josh_lite3_20230714';
    const voice = '077ab11b14f04ce0b49b5f6e5cc20979';

    try {
      sessionInfo = await newSession('low', avatar, voice);
      const { sdp: serverSdp, ice_servers2: iceServers } = sessionInfo;

      peerConnection = new RTCPeerConnection({ iceServers: iceServers });

      peerConnection.ontrack = (event) => {
        console.log('Recibido el flujo de audio/video');
        if (event.track.kind === 'audio' || event.track.kind === 'video') {
          mediaElement.srcObject = event.streams[0];
        }
      };

      peerConnection.ondatachannel = (event) => {
        const dataChannel = event.channel;
        dataChannel.onmessage = onMessage;
      };

      const remoteDescription = new RTCSessionDescription(serverSdp);
      await peerConnection.setRemoteDescription(remoteDescription);

      console.log('Creación de sesión completada');
      console.log('Iniciando sesión... por favor espera');

      const localDescription = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(localDescription);

      peerConnection.onicecandidate = ({ candidate }) => {
        console.log('Recibido candidato ICE:', candidate);
        if (candidate) {
          handleICE(sessionInfo.session_id, candidate.toJSON());
        }
      };

      peerConnection.oniceconnectionstatechange = (event) => {
        console.log(`Estado de conexión ICE cambiado a: ${peerConnection.iceConnectionState}`);
      };

      await startSession(sessionInfo.session_id, localDescription);

      const receivers = peerConnection.getReceivers();
      receivers.forEach((receiver) => {
        receiver.jitterBufferTarget = 500;
      });

      console.log('Sesión iniciada exitosamente');
    } catch (error) {
      console.error('Error al crear o iniciar la sesión:', error);
      console.log('Error al crear o iniciar la sesión. Por favor, inténtalo de nuevo.');
    }
  }

  function onMessage(event) {
    const message = event.data;
    console.log('Mensaje recibido:', message);
    // Procesar el mensaje recibido pero no llamar a handleSend aquí
  }

  async function newSession(quality, avatar_name, voice_id) {
    const response = await fetch(`${SERVER_URL}/v1/streaming.new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify({
        quality,
        avatar_name,
        voice: {
          voice_id: voice_id,
        },
      }),
    });
    if (!response.ok) {
      throw new Error('Error al iniciar una nueva sesión');
    }
    const data = await response.json();
    return data.data;
  }

  async function startSession(session_id, sdp) {
    const response = await fetch(`${SERVER_URL}/v1/streaming.start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify({ session_id, sdp }),
    });
    if (!response.ok) {
      throw new Error('Error al iniciar la sesión');
    }
    const data = await response.json();
    return data.data;
  }

  async function handleICE(session_id, candidate) {
    const response = await fetch(`${SERVER_URL}/v1/streaming.ice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify({ session_id, candidate }),
    });
    if (!response.ok) {
      throw new Error('Error al manejar el ICE candidate');
    }
    const data = await response.json();
    return data;
  }

  async function repeat(session_id, text) {
    const response = await fetch(`${SERVER_URL}/v1/streaming.task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify({ session_id, text }),
    });
    if (!response.ok) {
      throw new Error('Error al enviar la tarea');
    }
    const data = await response.json();
    return data.data;
  }

  async function stopSession() {
    if (!sessionInfo || !sessionInfo.session_id) {
      console.log('No hay sesión activa para detener');
      return;
    }

    try {
      await fetch(`${SERVER_URL}/v1/streaming.stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apiKey,
        },
        body: JSON.stringify({ session_id: sessionInfo.session_id }),
      });
      console.log('Sesión detenida exitosamente');
      sessionInfo = null;
    } catch (error) {
      console.error('Error al detener la sesión:', error);
      console.log('Error al detener la sesión. Por favor, inténtalo de nuevo.');
    }
  }

  // Manejar el envío de la tarea
  async function handleSend(text) {
    if (!sessionInfo || !sessionInfo.session_id) {
      console.log('Por favor, crea una conexión primero');
      return;
    }
    console.log('Enviando tarea... por favor espera');
    try {
      await repeat(sessionInfo.session_id, text);
      console.log('Tarea enviada exitosamente');
    } catch (error) {
      console.error('Error al enviar la tarea:', error);
      console.log('Error al enviar la tarea. Por favor, inténtalo de nuevo.');
    }
  }

  // Scroll al fondo después de cada actualización
  afterUpdate(() => {
    if (element) {
      scrollToBottom(element);
    }
  });

  function scrollToBottom(node: HTMLDivElement) {
    node.scroll({ top: node.scrollHeight, behavior: "smooth" });
  }

  onDestroy(() => {
    stopSession();
  });
</script>

<div class="flex flex-auto overflow-x-auto rounded-2xl bg-gray-100 chatbox dark:bg-gray-800 ml-2 mr-2">
  {#if messages && messages.length > 0}
    <div id="avatar" class="w-1/2 mt-2">
      <button class="bg-blue-500 ml-2 text-white py-2 px-4 rounded" on:click={createNewSession}>Start</button>
      <button class="bg-blue-500 text-white py-2 px-4 rounded" on:click={stopSession}>End</button>

      <div class="videoSectionWrap m-2">
        <VideoSection bind:mediaElement={mediaElement} />
      </div>
    </div>

    <div id="chat" class="w-1/2 flex flex-col h-full">
      <div class="grid grid-cols-12 gap-y-2 overflow-auto" bind:this={element}>
        {#each messages as message, index}
          <QuestionMessage {message} />
          <BotMessage
            {message}
            on:scrollToBottom={() => scrollToBottom(element)}
            {handleRegenerate}
            last={index === messages.length - 1 ? 'true' : 'false'}
          />
          <!-- Llamar a handleSend solo para el último mensaje -->
          {#if index === messages.length - 1}
            {#await handleSend(message.text)}
              <!-- Mostrar mensaje de carga -->
              <!-- <LoadingMessage /> -->
            {/await}
          {/if}
        {/each}

        <!-- Mostrar mensajes de carga adicionales si isLoading es true -->
        {#if isLoading}
          <LoadingMessage />
          <LoadingMessageBot />
        {/if}
      </div>
    </div>
  {/if}
</div>
