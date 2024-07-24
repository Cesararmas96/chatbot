<script lang="ts">
	import { page } from '$app/stores'
	import SidebarBot from '$lib/components/SidebarBot.svelte'
	import Header from '$lib/components/chat/Header.svelte'
	import { DarkMode } from 'flowbite-svelte'
	import SelectBots from '$lib/components/chat/SelectBots.svelte'

	let shared = $page.url.searchParams.get('shared') === 'true'
</script>

<slot />
