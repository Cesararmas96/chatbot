<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { page } from '$app/stores';
	import { getApiData } from '$lib/services/getData.js'; // Servicio para obtener datos
	import { fetchChatData } from '$lib/services/chatService';
	import { storeUser } from '$lib/stores/session.js';
	import { db } from '$lib/db';
	import Avatar from '$lib/components/common/Avatar.svelte';
	import ChatInput from '$lib/components/chat/ChatInput.svelte';
	import MessageDisplay from '$lib/components/chat/MessageDisplay.svelte';
	import { sendErrorNotification } from '$lib/stores/toast';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { get } from 'svelte/store';

	let isLoadingResponse = false;
	let botData = null; // Aquí se almacenará la información del bot
	let chatbotId = '';
	let user_id = '';
	let token = '';
	let isLoading = false;
	let messages = [];
	let query = '';
	let chatInputRef: any;
	let messagesContainer: HTMLDivElement;

	let selectedLlm = 'Gemini'; // Modelo por defecto

	export let data;
	$storeUser = data.user;
	user_id = data.user.user_id;
	token = data.user.token;

	// Función para cargar el bot y los mensajes
	const loadBotAndMessages = async () => {
		const currentPage = get(page);
		const botName = currentPage.params.bot; // Extraer el nombre del bot desde la URL
		const chatId = currentPage.params.id;
		const apiUrl = `${import.meta.env.VITE_API_AI_URL}/api/v1/bots?name=${botName}`;

		try {
			// Obtén los datos del bot desde la API
			const botResponse = await getApiData(
				apiUrl,
				'GET',
				{},
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				}
			);

			if (botResponse && botResponse.length > 0) {
				botData = botResponse[0]; // Asigna los datos del bot
				chatbotId = botData.chatbot_id;
			} else {
				throw new Error('Bot not found.');
			}

			// Cargar mensajes desde IndexedDB
			const pageUrl = `/${botName}/${chatId}`;
			const storedMessages = await db.messages
				.where('pageId')
				.equals(pageUrl)
				.toArray();

			messages = storedMessages.map((msg) => ({
				text: msg.text,
				query: msg.query,
				answer: msg.answer,
				chat_history: msg.chat_history,
				sid: msg.sid,
				user_id: msg.user_id,
				chatbot_id: msg.chatbot_id
			}));
		} catch (error) {
			console.error('Error loading bot or messages:', error);
			sendErrorNotification('Error loading bot or messages. Please try again.');
		}
	};

	onMount(() => {
		loadBotAndMessages();
		page.subscribe(() => {
			loadBotAndMessages();
		});
	});

	afterUpdate(() => {
		if (messagesContainer) {
			scrollToBottom(messagesContainer);
		}
	});

	const scrollToBottom = (node: HTMLDivElement) => {
		node.scrollTop = node.scrollHeight;
	};

	// Manejo de la petición de datos al bot
	const handleFetchData = async () => {
		if (!botData || !botData.name) {
			sendErrorNotification('Error: Bot data is missing.');
			return;
		}

		isLoading = true;
		isLoadingResponse = true;

		try {
			const { response, question, answer, chat_history, sid, at } = await fetchChatData(
				botData.name, // Usar el nombre exacto del bot desde botData.name
				query,
				selectedLlm
			);

			const newMessage = {
				text: response,
				query,
				answer,
				chat_history,
				sid,
				user_id,
				chatbot_id: chatbotId,
				at
			};

			messages = [...messages, newMessage];
			query = ''; // Limpiar input después de recibir la respuesta

			// Guardar mensajes en IndexedDB
			const pageUrl = `/${botData.name}/${get(page).params.id}`;
			await db.messages.bulkAdd(messages.map((msg) => ({ ...msg, pageId: pageUrl })));
		} catch (error) {
			sendErrorNotification('Error: Unable to fetch data. Please try again.');
		} finally {
			isLoading = false;
			isLoadingResponse = false;
		}
	};

	// Manejo del evento de envío de formulario
	const handleSubmit = async (event: CustomEvent) => {
		event.preventDefault();
		query = event.detail.query;
		await handleFetchData();

		// Enfocar el campo de entrada después de manejar la respuesta
		if (chatInputRef && chatInputRef.focusInput) {
			chatInputRef.focusInput();
		}
	};
</script>

<div class="chatbox flex flex-col h-screen w-full">
	{#if botData}
		<div class="main-content flex-1 flex flex-col">
			<div class="scroll-area custom-scrollbar2 flex-1 p-6 overflow-auto" bind:this={messagesContainer}>
				<div class="mx-auto space-y-4 md:px-32">
					{#each messages as message, index (message.sid)}
						{#if message.query}
							<div class="message-container flex items-start gap-3 flex-row-reverse pb-5">
								<div
									class="avatar w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0"
								>
									<Avatar showFullName={false} />
								</div>
								<div class="message bg-purple-600 p-4 rounded-lg max-w-[80%]">
									{message.query}
								</div>
							</div>
						{/if}
						{#if message.text}
							<MessageDisplay
								{message}
								{botData.name} 
								{selectedLlm}
								isLastMessage={index === messages.length - 1}
							/>
						{/if}
					{/each}

					{#if isLoadingResponse}
						<div class="message-container flex items-start gap-3 flex-row-reverse pb-5">
							<div
								class="avatar w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0"
							>
								<Avatar showFullName={false} />
							</div>
							<div class="message bg-purple-600 p-4 rounded-lg max-w-[80%]">
								{query}
							</div>
						</div>

						<div class="flex items-center space-x-4">
							<img
								src={`/images/bots/${botData.name}.png`}
								alt="{botData.name}-logo"
								class="h-10 w-10"
							/>
							<div class="space-y-2">
								<Skeleton class="h-4 w-[350px]" />
								<Skeleton class="h-4 w-[300px]" />
							</div>
						</div>
					{/if}
				</div>
			</div>

			<div class="border-t border-gray-800 p-4 fixed bottom-0 left-0 right-0">
				<div class="max-w-2xl mx-auto">
					<div class="relative">
						<ChatInput {isLoading} bind:query on:submit={handleSubmit} bind:this={chatInputRef} />
					</div>
					<p class="text-xs text-gray-500 mt-2 text-center">
						Chatbots can make mistakes. Verify important information.
					</p>
				</div>
			</div>
		</div>
	{:else}
		<p class="text-center text-red-500">Bot data not found. Please try again.</p>
	{/if}
</div>

<style>
	.scroll-area {
		flex: 1;
		padding: 1.5rem;
		overflow-y: auto;
		max-width: 900px;
		margin: 0 auto;
		width: 100%;
	}

	.border-t {
		position: sticky;
		bottom: 0;
		background-color: black;
		z-index: 10;
	}
</style>
