<script lang="ts">
	// import Footer from '$lib/components/layouts/Footer.svelte'
	// import Header from '$lib/components/layouts/Header.svelte'
	// // import LoadingEnv from '$lib/components/common/LoadingEnv.svelte'
	import '@mixoo/ui/css/theme/default.css'
	import '@mixoo/form/css/theme/default.css'
	let width: number
</script>

<svelte:window bind:innerWidth={width} />

<!-- <Header /> -->

<div class="mx-auto flex w-full">
	<div class="mx-auto w-full">
		<div class="flex h-[calc(100vh-4rem)] flex-col justify-between" data-simplebar>
			<main class="pt-10">
				<slot />
			</main>
		</div>
	</div>
</div>
