<script lang="ts">
	import { onMount } from 'svelte'
	import { getApiData } from '$lib/services/getData'

	// Importing icons from 'lucide-svelte'
	import PanelLeft from 'lucide-svelte/icons/panel-left'
	import { Search, LogOut, User, Bot, Settings, FileAudio } from 'lucide-svelte'

	// Importing UI components from custom library
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js'

	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js'
	import { Button } from '$lib/components/ui/button/index.js'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js'
	import { Input } from '$lib/components/ui/input/index.js'
	import { Separator } from '$lib/components/ui/separator/index.js'
	import * as Sheet from '$lib/components/ui/sheet/index.js'
	import * as Tooltip from '$lib/components/ui/tooltip/index.js'
	import { enhance } from '$app/forms'
	import { DarkMode } from 'flowbite-svelte'
	import * as Avatar from '$lib/components/ui/avatar/index.js'
	import * as Accordion from '$lib/components/ui/accordion'
	// Importing user data store
	import { storeUser } from '$lib/stores'

	// Setting the initial data from props
	export let data
	$storeUser = data.user
	const session = data.user ? data.user : $storeUser

	// Defining variables
	const { user } = data
	let token = user.token
	let isLoading = false
	let bots = []
	let selectedItem = null

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
{#if isLoading}
	<div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
		<div class="loader"></div>
	</div>
{/if}

<!-- Main container for the layout -->
<div class="bg-muted/40 flex min-h-screen w-full flex-col">
	<!-- Sidebar with navigation -->
	<div class="bg-background fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r sm:flex p-2">
		<div class="flex items-center justify-between mb-4 px-1">
			<div class="flex items-center">
				<a href="/bots" class="flex justify-center items-center">
					<img src="/troc.png" alt="" class="w-12 h-12" />
					<h1 class="text-xl font-bold ml-2">T-ROC Chatbot</h1>
				</a>
			</div>
		</div>

		<nav class="flex flex-col items-left gap-4 px-2 py-4">
			<!-- Loop through bots and display them -->
			<ScrollArea
				class="h-[calc(100vh-380px)] md:h-[calc(100vh-210px)] rounded-md border border-zinc-200"
			>
				<Accordion.Root type="single">
					<!-- Sección de Bots -->
					<Accordion.Item value="bots">
						<Accordion.Trigger
							class="p-4 flex justify-between items-center hover:bg-gray-300 hover:no-underline"
						>
							<div class="flex items-center space-x-2">
								<Bot class="w-5 h-5" />
								<span class="">Bots</span>
							</div>
						</Accordion.Trigger>
						<Accordion.Content>
							{#each bots as bot}
								<Tooltip.Root>
									<Tooltip.Trigger asChild let:builder>
										<a
											href="/{bot.name.toLowerCase()}"
											on:click={() => handleClick(bot.name)}
											class="flex h-9 items-center pl-6 hover:bg-gray-200 cursor-pointer"
											use:builder.action
											{...builder}
										>
											<span class:font-bold={selectedItem === bot.name}>{bot.name}</span>
										</a>
									</Tooltip.Trigger>
								</Tooltip.Root>
							{/each}
						</Accordion.Content>
					</Accordion.Item>

					<!-- Sección de Audio -->
					<Accordion.Item value="audio">
						<Accordion.Trigger
							class="p-4 flex justify-between items-center hover:bg-gray-300 hover:no-underline"
						>
							<div class="flex items-center space-x-2">
								<FileAudio class="w-5 h-5" />
								<span>Video Processed</span>
							</div>
						</Accordion.Trigger>
						<Accordion.Content>
							<div class="pl-4 hover:bg-gray-200 cursor-pointer">
								<a href="/audio" class="flex items-center hover:text-foreground p-2"
									>Video Processed</a
								>
							</div>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>
			</ScrollArea>
		</nav>

		<Separator class="my-4" />

		<div class="mt-auto hover:bg-zinc-400 rounded-lg">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<div class="flex items-center space-x-2 cursor-pointer p-2">
						<Avatar.Root>
							<Avatar.Fallback class="bg-pink-600 text-white"
								>{session.first_name[0] + session.last_name[0]}</Avatar.Fallback
							>
						</Avatar.Root>
						<div class="flex-grow">
							<p class="text-sm font-medium text-left">{session.first_name} {session.last_name}</p>
							<p class="text-xs text-gray-700">{session.email}</p>
						</div>
					</div>
				</DropdownMenu.Trigger>

				<DropdownMenu.Content class="w-56">
					<DropdownMenu.Group>
						<DropdownMenu.Item>
							<Settings class="mr-2 h-4 w-4" />
							<span>Settings</span>
						</DropdownMenu.Item>

						<DropdownMenu.Item>
							<LogOut class="mr-2 h-4 w-4" />
							<form action="/logout" method="POST" use:enhance>
								<button type="submit">
									<span>Logout</span>
								</button>
							</form>
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>

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
	</div>

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
						<ScrollArea class="h-[calc(100vh-260px)]  rounded-md border border-zinc-200">
							<Accordion.Root type="single">
								<!-- Sección de Bots -->
								<Accordion.Item value="bots">
									<Accordion.Trigger
										class="p-4 flex justify-between items-center hover:bg-gray-300 hover:no-underline"
									>
										<div class="flex items-center space-x-2">
											<Bot class="w-5 h-5" />
											<span class="">Bots</span>
										</div>
									</Accordion.Trigger>
									<Accordion.Content>
										{#each bots as bot}
											<Tooltip.Root>
												<Tooltip.Trigger asChild let:builder>
													<a
														href="/{bot.name.toLowerCase()}"
														on:click={() => handleClick(bot.name)}
														class="flex h-9 items-center pl-6 hover:bg-gray-200 cursor-pointer"
														use:builder.action
														{...builder}
													>
														<span class:font-bold={selectedItem === bot.name}>{bot.name}</span>
													</a>
												</Tooltip.Trigger>
											</Tooltip.Root>
										{/each}
									</Accordion.Content>
								</Accordion.Item>

								<!-- Sección de Audio -->
								<Accordion.Item value="audio">
									<Accordion.Trigger
										class="p-4 flex justify-between items-center hover:bg-gray-300 hover:no-underline"
									>
										<div class="flex items-center space-x-2">
											<FileAudio class="w-5 h-5" />
											<span>Audio</span>
										</div>
									</Accordion.Trigger>
									<Accordion.Content>
										<div class="pl-4 hover:bg-gray-200 cursor-pointer">
											<a href="/audio" class="flex items-center hover:text-foreground p-2"
												>Processed Audio</a
											>
										</div>
									</Accordion.Content>
								</Accordion.Item>
							</Accordion.Root>
						</ScrollArea>
						<Separator class="my-4" />

						<div class="mt-auto">
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<div
										class="flex items-center space-x-2 cursor-pointer hover:bg-zinc-800 p-2 rounded-lg"
									>
										<Avatar.Root>
											<Avatar.Fallback class="bg-pink-600 text-white"
												>{session.first_name[0] + session.last_name[0]}</Avatar.Fallback
											>
										</Avatar.Root>
										<div class="flex-grow">
											<p class="text-sm font-medium text-left">
												{session.first_name}
												{session.last_name}
											</p>
											<p class="text-xs text-gray-400">{session.email}</p>
										</div>
									</div>
								</DropdownMenu.Trigger>

								<DropdownMenu.Content class="w-56">
									<DropdownMenu.Group>
										<DropdownMenu.Item>
											<Settings class="mr-2 h-4 w-4" />
											<span>Settings</span>
										</DropdownMenu.Item>

										<DropdownMenu.Item>
											<LogOut class="mr-2 h-4 w-4" />
											<form action="/logout" method="POST" use:enhance>
												<button type="submit">
													<span>Logout</span>
												</button>
											</form>
										</DropdownMenu.Item>
									</DropdownMenu.Group>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</div>
					</nav>
				</Sheet.Content>
			</Sheet.Root>

			<DarkMode class="inline-block dark:hover:text-white hover:text-gray-900" />
		</header>

		<!-- Main content slot -->
		<main
			class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-1 xl:grid-cols-1"
		>
			<!-- Breadcrumb navigation -->
			<Breadcrumb.Root class="hidden md:flex">
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/bots" class="text-xl ml-4">Bots</Breadcrumb.Link>
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
