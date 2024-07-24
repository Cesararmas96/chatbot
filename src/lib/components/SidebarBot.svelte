<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/stores'
	import Avatar from './common/Avatar.svelte'
	import { onMount } from 'svelte'
	let botName = $page.params.bot
	const bot = $page.params.bot
	let hidden2 = false

	const toggleDrawer = () => {
		hidden2 = !hidden2
		const sidebar = document.getElementById('default-sidebar')
		if (sidebar) {
			sidebar.classList.toggle('-translate-x-full')
			sidebar.classList.toggle('translate-x-0')
		}
	}

	const closeDrawer = () => {
		hidden2 = true
		const sidebar = document.getElementById('default-sidebar')
		if (sidebar) {
			sidebar.classList.add('-translate-x-full')
			sidebar.classList.remove('translate-x-0')
		}
	}

	onMount(() => {
		const button = document.getElementById('toggle-drawer-button')
		button.addEventListener('click', toggleDrawer)

		const closeButton = document.getElementById('close-drawer-button')
		closeButton.addEventListener('click', closeDrawer)
	})

	// Añadir un listener para cambiar hidden2 cuando cambie el tamaño de la ventana
	window.addEventListener('resize', () => {
		// Cambiar hidden2 dependiendo de la resolución
		hidden2 = window.innerWidth >= 640 // Cambiar 640 por el ancho en píxeles que deseas para la transición
		// Actualizar la clase del sidebar según el valor de hidden2
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

	function refreshPage() {
		location.reload()
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
			><path
				fill="currentColor"
				d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z"
			/></svg
		>
	</button>
	<div class="flex flex-col h-full px-3 py-4 overflow-y-auto dark:bg-gray-800">
		<a href="/" class="flex items-center ps-2.5 mb-5">
			<img src="/troc.png" class="h-6 me-3 sm:h-7" alt="T-ROC Logo" />
			<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
				>T-ROC Chatbot</span
			>
		</a>
		<ul class="space-y-2 font-medium">
			<li
				class="group text-white dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
			>
				<button
					on:click={refreshPage}
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
							d="M17.74 30L16 29l4-7h6a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9v2H6a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4h-4.84Z"
						/><path fill="currentColor" d="M8 10h16v2H8zm0 6h10v2H8z" /></svg
					>
					<span class="ms-3">New Chat</span>
				</button>
			</li>
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
						href="/home"
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
