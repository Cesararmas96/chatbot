<script lang="ts">
	import { storeUser } from '$lib/stores'
	export let showFullName: boolean = false
</script>

<div class="flex flex-row items-center rounded-xl p-2">
	<div
		class="uppercase flex items-center text-xs justify-center h-10 w-10 rounded-full bg-blue-600 flex-shrink-0 text-white"
	>
		{#if !$storeUser}
			GU
		{:else if $storeUser.first_name && $storeUser.last_name}
			<!-- {$storeUser.first_name.charAt(0)}{$storeUser.last_name.charAt(0)} -->
			USER
		{:else}
			GU
		{/if}
	</div>

	{#if showFullName && $storeUser && $storeUser.first_name && $storeUser.last_name}
		<div class="ml-2 font-semibold dark:text-white">
			{$storeUser.first_name}
			{$storeUser.last_name}
		</div>
	{/if}
</div>
