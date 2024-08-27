<script lang="ts">
	import PanelLeft from 'lucide-svelte/icons/panel-left'
	// import Search from 'lucide-svelte/icons/search'
	import Settings from 'lucide-svelte/icons/settings'
	import ShoppingCart from 'lucide-svelte/icons/shopping-cart'
	import { CircleUser, Home, Menu, Search, LogOut, User, Bot } from 'lucide-svelte'

	import { Badge } from '$lib/components/ui/badge/index.js'
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js'
	import { Button } from '$lib/components/ui/button/index.js'
	import * as Card from '$lib/components/ui/card/index.js'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js'
	import { Input } from '$lib/components/ui/input/index.js'
	import { Separator } from '$lib/components/ui/separator/index.js'
	import * as Sheet from '$lib/components/ui/sheet/index.js'
	import * as Tooltip from '$lib/components/ui/tooltip/index.js'
	import { enhance } from '$app/forms'

	import { storeBots } from '$lib/stores/bots'
	import { storeUser } from '$lib/stores'

	export let data
	$storeUser = data.user
	$storeBots = data.bots.sort((a, b) => a.name.localeCompare(b.name))
</script>

<div class="bg-muted/40 flex min-h-screen w-full flex-col">
	<aside class="bg-background fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r sm:flex">
		<nav class="flex flex-col items-left gap-4 px-2 py-4">
			<a
				href="##"
				class="text-muted-foreground hover:text-foreground flex items-center h-9 items-right rounded-lg transition-colors w-full"
			>
				<img src="/images/bots/troc.png" alt="img-toc-logo" class="h-6 me-3 sm:h-12" />
				<span class="font-bold text-xl">T-ROC Chatbot</span>
			</a>
			<Separator />
			{#each $storeBots as bot}
				<Tooltip.Root>
					<Tooltip.Trigger asChild let:builder>
						<a
							href="##"
							class="text-muted-foreground hover:text-foreground flex h-9 w-9 items-right rounded-lg transition-colors md:h-8 md:w-8"
							use:builder.action
							{...builder}
						>
							<img
								src="/images/bots/{bot.name.toLowerCase()}.png"
								alt="img-{name}-logo"
								class="h-6 me-3 sm:h-7"
							/>
							<span class="">{bot.name}</span>
						</a>
					</Tooltip.Trigger>
				</Tooltip.Root>
			{/each}
		</nav>

		<!-- <nav class="mt-auto flex flex-col items-center gap-4 px-2 py-4">
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<a
						href="##"
						class="text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8"
						use:builder.action
						{...builder}
					>
						<Settings class="h-5 w-5" />
						<span class="sr-only">Settings</span>
					</a>
				</Tooltip.Trigger>
				<Tooltip.Content side="right">Settings</Tooltip.Content>
			</Tooltip.Root>
		</nav> -->
	</aside>
	<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-60">
		<header
			class="bg-background sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
		>
			<!-- Menu mobil -->
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
						{#each $storeBots as bot}
							<a href="##" class="text-foreground flex items-center gap-4 px-2.5">
								<img
									src="/images/bots/{bot.name.toLowerCase()}.png"
									alt="img-{name}-logo"
									class="h-6 me-3 sm:h-7"
								/>
								{bot.name}
							</a>
						{/each}
					</nav>
				</Sheet.Content>
			</Sheet.Root>

			<div class="relative ml-auto flex-1 md:grow-0">
				<!-- <Search class="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" /> -->
				<Input
					type="search"
					placeholder="Search..."
					class="bg-background w-full rounded-lg pl-8 md:w-[200px] lg:w-[320px]"
				/>
			</div>
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
							<DropdownMenu.Item class=" group-hover:text-black dark:group-hover:text-white"
								>Profile</DropdownMenu.Item
							>
						</a>
					</DropdownMenu.Item>
					<DropdownMenu.Item class="cursor-pointer">
						<a href="/admin" class="flex">
							<Bot />
							<DropdownMenu.Item class=" group-hover:text-black dark:group-hover:text-white"
								>Admin</DropdownMenu.Item
							>
						</a>
					</DropdownMenu.Item>
					<Separator />

					<DropdownMenu.Item>
						<LogOut />
						<DropdownMenu.Item class=" group-hover:text-black dark:group-hover:text-white">
							<form action="/logout" method="POST" use:enhance>
								<button type="submit" class="">
									<span>Logout</span>
								</button>
							</form>
						</DropdownMenu.Item>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</header>
		<main
			class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-1 xl:grid-cols-1"
		>
			<Breadcrumb.Root class="hidden md:flex">
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/bots">Admin</Breadcrumb.Link>
					</Breadcrumb.Item>
					<!-- <Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/profile">Profile</Breadcrumb.Link>
					</Breadcrumb.Item> -->
				</Breadcrumb.List>
			</Breadcrumb.Root>
			<slot />
		</main>
	</div>
</div>
