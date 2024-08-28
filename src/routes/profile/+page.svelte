<script lang="ts">
	import * as Card from '$lib/components/ui/card'
	import { storeUser } from '$lib/stores'
	import { Users } from 'lucide-svelte'
	export let data: any

	$storeUser = data.user
	const session = data.user ? data.user : $storeUser

	// console.log(session)
</script>

<main class="flex flex-1 flex-col gap-4 p-4 lg:gap-12 lg:p-12">
	<Card.Root class="w-[380px] ">
		<Card.Header>
			<div class=" bg-blue-600 p-4 text-center rounded-md mb-5">
				<h2 class="text-5xl font-semibold">
					{session.first_name[0] + session.last_name[0]}
				</h2>
			</div>
			<p class="text-lg mb-0 mt-5">{session.first_name} {session.last_name}</p>
			<p>{session.username}</p>
		</Card.Header>
		<Card.Content>
			{#if session.enabled}
				<div class="flex items-center rounded">
					<Users />
					<p class="pl-2 text-sm md:text-base">Enabled</p>
				</div>
			{:else}
				<div class="flex items-center rounded">
					<Users />
					<p class="pl-2 text-sm md:text-base">Disabled</p>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</main>
