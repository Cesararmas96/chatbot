<script lang="ts">
	import * as Card from '$lib/components/ui/card'
	import { storeUser } from '$lib/stores'
	import { Users } from 'lucide-svelte'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js'
	import * as Table from '$lib/components/ui/table/index.js'
	import * as Tabs from '$lib/components/ui/tabs/index.js'
	import * as Tooltip from '$lib/components/ui/tooltip/index.js'
	import { Button } from '$lib/components/ui/button/index.js'
	import { Badge } from '$lib/components/ui/badge/index.js'
	import ListFilter from 'lucide-svelte/icons/list-filter'
	import File from 'lucide-svelte/icons/file'
	import Home from 'lucide-svelte/icons/home'
	import LineChart from 'lucide-svelte/icons/line-chart'
	import ListFilter from 'lucide-svelte/icons/list-filter'
	import Ellipsis from 'lucide-svelte/icons/ellipsis'
	import Package from 'lucide-svelte/icons/package'
	import Package2 from 'lucide-svelte/icons/package-2'
	import PanelLeft from 'lucide-svelte/icons/panel-left'
	import CirclePlus from 'lucide-svelte/icons/circle-plus'
	import Search from 'lucide-svelte/icons/search'
	import Settings from 'lucide-svelte/icons/settings'
	import ShoppingCart from 'lucide-svelte/icons/shopping-cart'
	import UsersRound from 'lucide-svelte/icons/users-round'

	import { storeBots } from '$lib/stores/bots'
	export let data: any
	$storeBots = data.bots.sort((a, b) => a.name.localeCompare(b.name))

	$storeUser = data.user
	const session = data.user ? data.user : $storeUser

	// console.log(session)
</script>

<main class="flex flex-1 flex-col gap-4 p-4 lg:gap-12 lg:p-12">
	<Tabs.Root value="all">
		<div class="flex items-center">
			<Tabs.List>
				<Tabs.Trigger value="all">All</Tabs.Trigger>
				<Tabs.Trigger value="active">Active</Tabs.Trigger>
			</Tabs.List>
			<div class="ml-auto flex items-center gap-2">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button builders={[builder]} variant="outline" size="sm" class="h-7 gap-1">
							<ListFilter class="h-3.5 w-3.5" />
							<span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Filter </span>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						<DropdownMenu.Label>Filter by</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.CheckboxItem checked>Active</DropdownMenu.CheckboxItem>
						<DropdownMenu.CheckboxItem>Draft</DropdownMenu.CheckboxItem>
					</DropdownMenu.Content>
				</DropdownMenu.Root>

				<Button size="sm" class="h-7 gap-1">
					<a href="/new" class="flex items-center">
						<CirclePlus class="h-3.5 w-3.5 mr-2" />
						<span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Add Bot </span>
					</a>
				</Button>
			</div>
		</div>
		<Tabs.Content value="all">
			<Card.Root
				data-x-chunk-name="dashboard-06-chunk-1"
				data-x-chunk-description="A list of products in a table with actions. Each row has an image, name, status, price, total sales, created at and actions."
			>
				<Card.Header>
					<Card.Title>Bots</Card.Title>
					<Card.Description>Manage your Bots and view their performance.</Card.Description>
				</Card.Header>
				<Card.Content>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Name</Table.Head>
								<Table.Head>Description</Table.Head>
								<Table.Head>Llm</Table.Head>
								<Table.Head>Enable</Table.Head>
								<Table.Head class="hidden md:table-cell">Created at</Table.Head>
								<Table.Head>
									<span class="sr-only">Actions</span>
								</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each $storeBots as bot}
								<Table.Row>
									<Table.Cell class="font-medium">{bot.name}</Table.Cell>
									<Table.Cell>
										{bot.description}
									</Table.Cell>
									<Table.Cell>{bot.llm}</Table.Cell>
									<Table.Cell class="hidden md:table-cell"
										><Badge variant="outline" class="bg-green-200">{bot.enabled}</Badge></Table.Cell
									>
									<Table.Cell class="hidden md:table-cell"
										>{bot.created_at.split('.')[0].replace('T', ' ').slice(0, 16)}</Table.Cell
									>
									<Table.Cell>
										<DropdownMenu.Root>
											<DropdownMenu.Trigger asChild let:builder>
												<Button
													aria-haspopup="true"
													size="icon"
													variant="ghost"
													builders={[builder]}
												>
													<Ellipsis class="h-4 w-4" />
													<span class="sr-only">Toggle menu</span>
												</Button>
											</DropdownMenu.Trigger>
											<DropdownMenu.Content align="end">
												<DropdownMenu.Label>Actions</DropdownMenu.Label>
												<DropdownMenu.Item>Edit</DropdownMenu.Item>
												<DropdownMenu.Item>Delete</DropdownMenu.Item>
											</DropdownMenu.Content>
										</DropdownMenu.Root>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</Card.Content>
				<!-- <Card.Footer>
					<div class="text-muted-foreground text-xs">
						Showing <strong>1-10</strong> of <strong>32</strong> products
					</div>
				</Card.Footer> -->
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</main>
