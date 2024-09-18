<script lang="ts">
	import { onMount } from 'svelte'
	import { getApiData } from '$lib/services/getData'

	// Importing icons from 'lucide-svelte'
	import PanelLeft from 'lucide-svelte/icons/panel-left'
	import { Search, LogOut, User, Bot } from 'lucide-svelte'

	// Importing UI components from custom library
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js'
	import { Button } from '$lib/components/ui/button/index.js'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js'
	import { Input } from '$lib/components/ui/input/index.js'
	import { Separator } from '$lib/components/ui/separator/index.js'
	import * as Sheet from '$lib/components/ui/sheet/index.js'
	import * as Tooltip from '$lib/components/ui/tooltip/index.js'
	import { enhance } from '$app/forms'
	import { DarkMode } from 'flowbite-svelte'

	// Importing user data store
	import { storeUser } from '$lib/stores'

	// Setting the initial data from props
	export let data
	$storeUser = data.user

	// Defining variables
	const { user } = data
	let token = user.token
	let isLoading = false
	let bots = []

	// Function to fetch bots data from the API
	const fetchBots = async () => {
		isLoading = true // Set loading state during data fetching
		const apiUrl = `${import.meta.env.VITE_API_AI_URL}/api/v1/bots`

		try {
			const fetchedBots = await getApiData(
				apiUrl,
				'GET',
				{},
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				},
				null,
				true
			)

			// Sorting bots by name
			bots = fetchedBots.sort((a, b) => a.name.localeCompare(b.name))
		} catch (error) {
			console.error('There was a problem with the fetch operation:', error)
		} finally {
			isLoading = false // Reset loading state after fetching
		}
	}

	// Fetch bots data when the component is mounted
	onMount(() => {
		fetchBots()
	})

	// Function to handle click events on links
	function handleClick(event) {
		isLoading = true // Set loading state when a link is clicked
	}
</script>

<!-- Show loader if data is still loading -->
<!-- {#if isLoading}
	<div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
		<div class="loader"></div>
	</div>
{/if} -->

<!-- Main container for the layout -->
<div class="bg-muted/40 flex min-h-screen w-full flex-col">
	<!-- Sidebar with navigation -->
	<aside
		class="bg-background fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r sm:flex p-2"
	>
		<nav class="flex flex-col items-left gap-4 px-2 py-4">
			<a
				href="##"
				class="text-muted-foreground hover:text-foreground flex items-center h-9 items-right rounded-lg transition-colors w-full"
			>
				<img src="/images/bots/troc.png" alt="img-toc-logo" class="h-6 me-3 sm:h-12" />
				<span class="font-bold text-xl">T-ROC Chatbot</span>
			</a>
			<Separator />
			<!-- Loop through bots and display them -->
			{#each bots as bot}
				<Tooltip.Root>
					<Tooltip.Trigger asChild let:builder>
						<a
							href="/{bot.name.toLowerCase()}"
							on:click={handleClick}
							class="text-muted-foreground hover:text-foreground flex h-9 w-9 items-right rounded-lg transition-colors md:h-8 md:w-8"
							use:builder.action
							{...builder}
						>
							<span class="">{bot.name}</span>
						</a>
					</Tooltip.Trigger>
				</Tooltip.Root>
			{/each}
		</nav>
		<!-- Uncomment the following section for additional settings menu -->
		<!-- <nav class="mt-auto flex flex-col items-center gap-4 px-2 py-4">
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<a href="##" class="text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8" use:builder.action {...builder}>
						<Settings class="h-5 w-5" />
						<span class="sr-only">Settings</span>
					</a>
				</Tooltip.Trigger>
				<Tooltip.Content side="right">Settings</Tooltip.Content>
			</Tooltip.Root>
		</nav> -->
	</aside>

	<!-- Main content area -->
	<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-60">
		<!-- Header with search and user menu -->
		<header
			class="bg-background sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
		>
			<!-- Mobile menu button -->
			<Sheet.Root>
				<Sheet.Trigger asChild let:builder>
					<Button builders={[builder]} size="icon" variant="outline" class="sm:hidden">
						<PanelLeft class="h-5 w-5" />
						<span class="sr-only">Toggle Menu</span>
					</Button>
				</Sheet.Trigger>
				<Sheet.Content side="left" class="sm:max-w-xs">
					<nav class="grid gap-6 text-lg font-medium">
						<a href="/bots" class="flex items-center">
							<img src="/images/bots/troc.png" alt="img-troc-logo" class="h-10 me-3 sm:h-7" />
							<span class="font-bold text-xl">T-ROC Chatbot</span>
						</a>
						<Separator />
						{#each bots as bot}
							<a href="##" class="text-foreground flex items-center gap-4 px-2.5">
								{bot.name}
							</a>
						{/each}
					</nav>
				</Sheet.Content>
			</Sheet.Root>

			<DarkMode class="inline-block dark:hover:text-white hover:text-gray-900" />

			<!-- Search input -->
			<div class="relative ml-auto flex-1 md:grow-0">
				<Search class="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
				<Input
					type="search"
					placeholder="Search..."
					class="bg-background w-full rounded-lg pl-8 md:w-[200px] lg:w-[320px]"
				/>
			</div>

			<!-- User dropdown menu -->
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button
						variant="outline"
						size="icon"
						class="overflow-hidden rounded-full"
						builders={[builder]}
					>
						<div class="flex flex-row items-center rounded-xl p-2">
							<div
								class="uppercase flex items-center justify-center h-10 w-10 rounded-full bg-pink-600 flex-shrink-0 text-white"
							>
								{$storeUser.first_name.charAt(0)}{$storeUser.last_name.charAt(0)}
							</div>
						</div>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Item class="cursor-pointer">
						<a href="/profile" class="flex">
							<User />
							<DropdownMenu.Item class="group-hover:text-black dark:group-hover:text-white">
								Profile
							</DropdownMenu.Item>
						</a>
					</DropdownMenu.Item>
					<DropdownMenu.Item class="cursor-pointer">
						<a href="/admin" class="flex">
							<Bot />
							<DropdownMenu.Item class="group-hover:text-black dark:group-hover:text-white">
								Admin
							</DropdownMenu.Item>
						</a>
					</DropdownMenu.Item>
					<Separator />
					<DropdownMenu.Item>
						<LogOut />
						<DropdownMenu.Item class="group-hover:text-black dark:group-hover:text-white">
							<form action="/logout" method="POST" use:enhance>
								<button type="submit">
									<span>Logout</span>
								</button>
							</form>
						</DropdownMenu.Item>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</header>

		<!-- Main content slot -->
		<main
			class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-1 xl:grid-cols-1"
		>
			<!-- Breadcrumb navigation -->
			<Breadcrumb.Root class="hidden md:flex">
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/bots">Bots</Breadcrumb.Link>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
			<slot />
		</main>
	</div>
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
