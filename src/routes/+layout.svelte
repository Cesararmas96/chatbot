<script lang="ts">
	import '../app.css'
	import '../style.css'
	import 'iconify-icon'

	import Toasts from '$lib/components/common/Toasts.svelte'
	import { onMount } from 'svelte'
	import { sendWarningNotification } from '$lib/stores/toast'

	export let data

	let isPageLoaded = false

	const pageLoaded = (p0?: HTMLDivElement) => {
		isPageLoaded = true
	}

	const currentVersion = data.version

	onMount(() => {
		const checkVersion = async () => {
			try {
				const response = await fetch('/api/version')
				const { version } = await response.json()
				if (version !== currentVersion) {
					sendWarningNotification(
						'The application has been updated. The page will automatically reload in 5 seconds to apply the changes',
						10000
					)
					setTimeout(() => {
						location.reload()
					}, 10000)
				}
			} catch (error) {
				console.error('Error al verificar la versión:', error)
			}
		}

		// Verificar cada hora (3600000 ms)
		const interval = setInterval(checkVersion, 3600000)

		return () => {
			clearInterval(interval)
		}
	})
</script>

{#if !isPageLoaded}
	<div
		use:pageLoaded
		class="z-10 flex h-screen w-screen items-center justify-center overflow-hidden"
	>
		<div class="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-blue-400" />
	</div>
{:else}
	<slot />
{/if}
<Toasts />
