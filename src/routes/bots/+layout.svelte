<script lang="ts">
	// import ChevronLeft from 'lucide-svelte/icons/chevron-left'
	// import ChevronRight from 'lucide-svelte/icons/chevron-right'
	// import Copy from 'lucide-svelte/icons/copy'
	// import CreditCard from 'lucide-svelte/icons/credit-card'
	// import File from 'lucide-svelte/icons/file'
	// import Home from 'lucide-svelte/icons/home'
	// import LineChart from 'lucide-svelte/icons/line-chart'
	// import ListFilter from 'lucide-svelte/icons/list-filter'
	// import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical'
	// import Package from 'lucide-svelte/icons/package'
	import Package2 from 'lucide-svelte/icons/package-2'
	import PanelLeft from 'lucide-svelte/icons/panel-left'
	// import Search from 'lucide-svelte/icons/search'
	import Settings from 'lucide-svelte/icons/settings'
	import ShoppingCart from 'lucide-svelte/icons/shopping-cart'

	// import Truck from 'lucide-svelte/icons/truck'
	// import UsersRound from 'lucide-svelte/icons/users-round'

	import { Badge } from '$lib/components/ui/badge/index.js'
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js'
	import { Button } from '$lib/components/ui/button/index.js'
	import * as Card from '$lib/components/ui/card/index.js'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js'
	import { Input } from '$lib/components/ui/input/index.js'
	import * as Pagination from '$lib/components/ui/pagination/index.js'
	import { Progress } from '$lib/components/ui/progress/index.js'
	import { Separator } from '$lib/components/ui/separator/index.js'
	import * as Sheet from '$lib/components/ui/sheet/index.js'
	import * as Table from '$lib/components/ui/table/index.js'
	import * as Tabs from '$lib/components/ui/tabs/index.js'
	import * as Tooltip from '$lib/components/ui/tooltip/index.js'

	import { storeBots } from '$lib/stores/bots'
	export let data
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
						<img
							src="/images/placeholder-user.jpg"
							width={36}
							height={36}
							alt="Avatar"
							class="overflow-hidden rounded-full"
						/>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Label>My Account</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>Settings</DropdownMenu.Item>
					<DropdownMenu.Item>Support</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>Logout</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</header>
		<main
			class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-1 xl:grid-cols-1"
		>
			<Breadcrumb.Root class="hidden md:flex">
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href="##">Home</Breadcrumb.Link>
					</Breadcrumb.Item>
					<!-- <Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Link href="##">Orders</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Page>Recent Orders</Breadcrumb.Page>
					</Breadcrumb.Item> -->
				</Breadcrumb.List>
			</Breadcrumb.Root>
			<slot />
		</main>
	</div>
</div>
