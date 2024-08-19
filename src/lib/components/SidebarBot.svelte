<script lang="ts">
	import Dexie from 'dexie'
	import { Button, Dropdown, DropdownItem, ToolbarButton, DropdownDivider } from 'flowbite-svelte'
	import { DotsHorizontalOutline, DotsVerticalOutline } from 'flowbite-svelte-icons'
	import { enhance } from '$app/forms'
	import { page } from '$app/stores'
	import Avatar from './common/Avatar.svelte'
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import moment from 'moment'

	export let chatbotid
	export let user_id
	// Define la base de datos Dexie
	const db = new Dexie('ChatDB')
	db.version(1).stores({
		users: '++id, &userId, name',
		bots: '++id, &botId, userId',
		messages: '++id, pageId, text, query, answer, chat_history, sid'
	})

	let botName = $page.params.bot
	const bot = $page.params.bot
	let hidden2 = false
	// let pageIds: string[] = [] // Para almacenar los pageId recuperados

	// let chatbotidpage = `/${botName}/${chatbotid}`
	let pageData = []

	async function fetchPageIds(chatbotid, user_id) {
		try {
			const messages = await db.messages.toArray()
			// console.log(messages)
			// console.log(user_id)
			const pageDataArray = messages.filter(
				(message) => message.chatbot_id === chatbotid && message.user_id === user_id
			)

			pageData = Array.from(new Map(pageDataArray.map((item) => [item.pageId, item])).values())

			// console.log(pageData)
		} catch (error) {
			console.error('Error fetching pageIds:', error)
		}
	}

	// Montar el componente y obtener los pageIds
	onMount(() => {
		fetchPageIds(chatbotid, user_id)

		const button = document.getElementById('toggle-drawer-button')
		if (button) button.addEventListener('click', toggleDrawer)

		const closeButton = document.getElementById('close-drawer-button')
		if (closeButton) closeButton.addEventListener('click', closeDrawer)
	})

	// Toggle sidebar visibility
	const toggleDrawer = () => {
		hidden2 = !hidden2
		const sidebar = document.getElementById('default-sidebar')
		if (sidebar) {
			sidebar.classList.toggle('-translate-x-full')
			sidebar.classList.toggle('translate-x-0')
		}
	}

	// Close sidebar
	const closeDrawer = () => {
		hidden2 = true
		const sidebar = document.getElementById('default-sidebar')
		if (sidebar) {
			sidebar.classList.add('-translate-x-full')
			sidebar.classList.remove('translate-x-0')
		}
	}

	// Update sidebar visibility on window resize
	window.addEventListener('resize', () => {
		hidden2 = window.innerWidth >= 640 // Adjust as needed
		const sidebar = document.getElementById('default-sidebar')
		if (sidebar) {
			if (!hidden2) {
				sidebar.classList.add('-translate-x-full')
				sidebar.classList.remove('translate-x-0')
			} else {
				sidebar.classList.remove('-translate-x-full')
				sidebar.classList.add('translate-x-0')
			}
		}
	})

	// Función para eliminar un pageId
	async function deletePageId(pageId: string) {
		try {
			// Elimina los mensajes asociados con el pageId
			await db.messages.where('pageId').equals(pageId).delete()
			sendSuccessNotification('Chat deleted successfully')

			// Actualiza la lista de pageIds
			await fetchPageIds(chatbotid, user_id)
		} catch (error) {
			console.error('Error deleting pageId:', error)
		}
	}
	const currentUrl = $page.url
	const newUrl = `${currentUrl.origin}`

	function isSameDay(created_at1, created_at2) {
		return moment(created_at1).isSame(created_at2, 'day')
	}

	function formatDate(created_at) {
		const today = moment().startOf('day')
		const yesterday = moment().subtract(1, 'days').startOf('day')

		if (moment(created_at).isSame(today, 'day')) {
			return 'Today'
		} else if (moment(created_at).isSame(yesterday, 'day')) {
			return 'Yesterday'
		} else {
			return moment(created_at).format('DD MMM YYYY')
		}
	}

	let lastDate = ''

	function isDifferentDate(date) {
		const formattedDate = formatDate(date)
		if (formattedDate !== lastDate) {
			lastDate = formattedDate
			return true
		}
		return false
	}
</script>

<aside
	id="default-sidebar"
	class=" {bot} fixed top-0 left-0 z-40 w-64 h-screen transition-transform dark:bg-gray-800 translate-x-0 text-white"
>
	<button
		id="close-drawer-button"
		type="button"
		class="sm:hidden absolute top-3 right-4 p-2 text-sm hover:text-gray-700 focus:outline-none"
	>
		<span class="sr-only">Close sidebar</span>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="w-6 h-6"
			width="32"
			height="32"
			viewBox="0 0 32 32"
		>
			<path
				fill="currentColor"
				d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z"
			/>
		</svg>
	</button>
	<div class="flex flex-col h-full px-3 py-4 overflow-y-auto dark:bg-gray-800">
		<a href="/" class="flex items-center ps-2.5 mb-5">
			<img src="/troc.png" class="h-6 me-3 sm:h-7" alt="T-ROC Logo" />
			<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
				>T-ROC Chatbot</span
			>
		</a>
		<ul>
			<li
				class="group text-white dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ml-2"
			>
				<a
					href={`/${bot}`}
					target="_self"
					class="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group hover:text-black"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-5 h-5 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						width="32"
						height="32"
						viewBox="0 0 32 32"
						><path
							fill="currentColor"
							d="M17.74 30L16 29l4-7h6a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9v2H6a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4h-4.84Z"
						/><path fill="currentColor" d="M17 9h-2v4h-4v2h4v4h2v-4h4v-2h-4z" /></svg
					>
					<span class="ms-3">New Chat</span>
				</a>
			</li>
			{#each pageData.slice().reverse() as data}
				{#if isDifferentDate(data.at)}
					<li class="mt-3">
						<span class="ms-3 text-sm">
							{formatDate(data.at)}
						</span>
					</li>
				{/if}
				<li
					class="group flex items-center text-white dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ml-2"
				>
					<a
						target="_self"
						href={`${newUrl}${data.pageId}`}
						class="flex justify-between items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group hover:text-black"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 32 32"
							class="mr-2 self-start flex-shrink-0"
						>
							<path
								fill="currentColor"
								d="M17.74 30L16 29l4-7h6a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9v2H6a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4h-4.84Z"
							/>
							<path fill="currentColor" d="M8 10h16v2H8zm0 6h10v2H8z" />
						</svg>
						<span class="text-sm flex-grow">
							{data.query.length > 21 ? `${data.query.slice(0, 21)}...` : data.query}
						</span>
					</a>
					<div class="flex-shrink-0 group-hover:text-black">
						<DotsVerticalOutline
							class="dots-menu text-white dark:text-white group-hover:text-black"
						/>
						<Dropdown triggeredBy=".dots-menu">
							<DropdownItem>
								<button class="flex" on:click={() => deletePageId(data.pageId)}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 32 32"
									>
										<path fill="currentColor" d="M12 12h2v12h-2zm6 0h2v12h-2z" />
										<path
											fill="currentColor"
											d="M4 6v2h2v20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8h2V6zm4 22V8h16v20zm4-26h8v2h-8z"
										/>
									</svg>
									<span class="ml-2">Delete</span>
								</button>
							</DropdownItem>
						</Dropdown>
					</div>
				</li>
			{/each}
		</ul>
		<div class="mt-auto pb-5">
			<ul>
				<!-- <li>
					<a
						href="/{bot}/setting"
						class="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group hover:text-black"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							viewBox="0 0 32 32"
							class="w-5 h-5 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
							><path
								fill="currentColor"
								d="M27 16.76v-1.53l1.92-1.68A2 2 0 0 0 29.3 11l-2.36-4a2 2 0 0 0-1.73-1a2 2 0 0 0-.64.1l-2.43.82a11 11 0 0 0-1.31-.75l-.51-2.52a2 2 0 0 0-2-1.61h-4.68a2 2 0 0 0-2 1.61l-.51 2.52a11.5 11.5 0 0 0-1.32.75l-2.38-.86A2 2 0 0 0 6.79 6a2 2 0 0 0-1.73 1L2.7 11a2 2 0 0 0 .41 2.51L5 15.24v1.53l-1.89 1.68A2 2 0 0 0 2.7 21l2.36 4a2 2 0 0 0 1.73 1a2 2 0 0 0 .64-.1l2.43-.82a11 11 0 0 0 1.31.75l.51 2.52a2 2 0 0 0 2 1.61h4.72a2 2 0 0 0 2-1.61l.51-2.52a11.5 11.5 0 0 0 1.32-.75l2.42.82a2 2 0 0 0 .64.1a2 2 0 0 0 1.73-1l2.28-4a2 2 0 0 0-.41-2.51ZM25.21 24l-3.43-1.16a8.9 8.9 0 0 1-2.71 1.57L18.36 28h-4.72l-.71-3.55a9.4 9.4 0 0 1-2.7-1.57L6.79 24l-2.36-4l2.72-2.4a8.9 8.9 0 0 1 0-3.13L4.43 12l2.36-4l3.43 1.16a8.9 8.9 0 0 1 2.71-1.57L13.64 4h4.72l.71 3.55a9.4 9.4 0 0 1 2.7 1.57L25.21 8l2.36 4l-2.72 2.4a8.9 8.9 0 0 1 0 3.13L27.57 20Z"
							/><path
								fill="currentColor"
								d="M16 22a6 6 0 1 1 6-6a5.94 5.94 0 0 1-6 6m0-10a3.91 3.91 0 0 0-4 4a3.91 3.91 0 0 0 4 4a3.91 3.91 0 0 0 4-4a3.91 3.91 0 0 0-4-4"
							/></svg
						>

						<span class="ms-3">Setting</span>
					</a>
				</li> -->

				<li>
					<a
						href="/bots"
						class="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group hover:text-black"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"
							><path
								fill="currentColor"
								d="M16.612 2.214a1.01 1.01 0 0 0-1.242 0L1 13.419l1.243 1.572L4 13.621V26a2.004 2.004 0 0 0 2 2h20a2.004 2.004 0 0 0 2-2V13.63L29.757 15L31 13.428ZM18 26h-4v-8h4Zm2 0v-8a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v8H6V12.062l10-7.79l10 7.8V26Z"
							/></svg
						>

						<span class="ms-3">Home </span>
					</a>
				</li>
				<li
					class="group text-white dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
				>
					<form action="/logout" method="POST" use:enhance class="w-full">
						<button
							type="submit"
							class="flex items-center w-full p-2 rounded-lg dark:text-white dark:hover:bg-gray-700 group-hover:text-black dark:group-hover:text-white"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 32 32"
								fill="currentColor"
								class="w-5 h-5 transition duration-75 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white"
								><path
									d="M6 30h12a2 2 0 0 0 2-2v-3h-2v3H6V4h12v3h2V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2"
								/><path
									d="M20.586 20.586L24.172 17H10v-2h14.172l-3.586-3.586L22 10l6 6l-6 6z"
								/></svg
							>
							<span class="ms-3 group-hover:text-black dark:group-hover:text-white">Logout</span>
						</button>
					</form>
				</li>
			</ul>
			<Avatar showFullName={true} />
		</div>
	</div>
</aside>
