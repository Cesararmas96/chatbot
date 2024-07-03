<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/stores'
	import Avatar from './common/Avatar.svelte'
	import { onMount } from 'svelte'
	let botName = $page.params.bot
	const bot = $page.params.bot.toString()
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
			class="w-6 h-6"
			aria-hidden="true"
			fill="currentColor"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M4.707 4.293a1 1 0 0 1 1.414 0L10 8.586l4.793-4.793a1 1 0 0 1 1.414 1.414L11.414 10l4.793 4.793a1 1 0 0 1-1.414 1.414L10 11.414l-4.793 4.793a1 1 0 0 1-1.414-1.414L8.586 10 3.793 5.207a1 1 0 0 1 0-1.414z"
			></path>
		</svg>
	</button>
	<div class="flex flex-col h-full px-3 py-4 overflow-y-auto dark:bg-gray-800">
		<a href="/" class="flex items-center ps-2.5 mb-5">
			<img src="/troc.png" class="h-6 me-3 sm:h-7" alt="T-ROC Logo" />
			<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
				>T-ROC Chatbot</span
			>
		</a>
		<ul class="space-y-2 font-medium">
			<li>
				<a
					href="/{bot}"
					class="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group hover:text-black"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 512 512"
						aria-hidden="true"
						fill="currentColor"
						class="w-5 h-5 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
					>
						<path
							d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z"
						/></svg
					>
					<span class="ms-3">Chat</span>
				</a>
			</li>
		</ul>
		<div class="mt-auto pb-5">
			<ul>
				<li>
					<a
						href="/{bot}/setting"
						class="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group hover:text-black"
					>
						<svg
							class="w-5 h-5 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
							width="24"
							height="25"
							viewBox="0 0 24 25"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M22.8885 15.0196L20.8084 13.8184C21.0184 12.6856 21.0184 11.5235 20.8084 10.3907L22.8885 9.1895C23.1277 9.05278 23.2352 8.76958 23.157 8.50591C22.615 6.76762 21.6922 5.19536 20.4861 3.88676C20.3006 3.68657 19.9979 3.63774 19.7635 3.77446L17.6834 4.97563C16.8094 4.22368 15.8035 3.64262 14.7147 3.26176V0.864303C14.7147 0.590866 14.5242 0.351608 14.2557 0.293014C12.4637 -0.107376 10.6277 -0.0878449 8.92364 0.293014C8.65508 0.351608 8.46465 0.590866 8.46465 0.864303V3.26665C7.38067 3.65239 6.37481 4.23344 5.4959 4.98051L3.42071 3.77934C3.18145 3.64262 2.8836 3.68657 2.69805 3.89165C1.492 5.19536 0.569146 6.76762 0.0271543 8.51079C-0.0558535 8.77446 0.0564511 9.05766 0.295709 9.19438L2.37579 10.3956C2.16583 11.5284 2.16583 12.6905 2.37579 13.8233L0.295709 15.0245C0.0564511 15.1612 -0.0509707 15.4444 0.0271543 15.7081C0.569146 17.4463 1.492 19.0186 2.69805 20.3272C2.8836 20.5274 3.18633 20.5762 3.42071 20.4395L5.50079 19.2383C6.37481 19.9903 7.38067 20.5713 8.46954 20.9522V23.3545C8.46954 23.628 8.65997 23.8672 8.92852 23.9258C10.7205 24.3262 12.5565 24.3067 14.2606 23.9258C14.5291 23.8672 14.7195 23.628 14.7195 23.3545V20.9522C15.8035 20.5665 16.8094 19.9854 17.6883 19.2383L19.7684 20.4395C20.0076 20.5762 20.3055 20.5323 20.491 20.3272C21.6971 19.0235 22.6199 17.4512 23.1619 15.7081C23.2352 15.4395 23.1277 15.1563 22.8885 15.0196ZM11.5897 16.0108C9.43633 16.0108 7.6834 14.2579 7.6834 12.1045C7.6834 9.95122 9.43633 8.19829 11.5897 8.19829C13.743 8.19829 15.4959 9.95122 15.4959 12.1045C15.4959 14.2579 13.743 16.0108 11.5897 16.0108Z"
								fill="currentColor"
							/>
						</svg>

						<span class="ms-3">Setting</span>
					</a>
				</li>

				<li>
					<a
						href="/home"
						class="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group hover:text-black"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 24"
							><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8z" /></svg
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
								class="w-5 h-5 transition duration-75 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 18 16"
							>
								<path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
								/>
							</svg>
							<span class="ms-3 group-hover:text-black dark:group-hover:text-white">Logout</span>
						</button>
					</form>
				</li>
			</ul>
			<Avatar showFullName={true} />
		</div>
	</div>
</aside>
