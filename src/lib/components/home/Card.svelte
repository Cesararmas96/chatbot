<script lang="ts">
	export let namebot
	export let name
	let imgName = name.toLowerCase()
</script>

<div
	class="flex justify-center animate__animated animate__zoomIn card cursor-pointer p-6 hover:-translate-y-1 hover:scale-100 hover:shadow-lg border border-gray-500 dark:bg-gray-700 rounded-md"
>
	<a href={imgName} class="dark:text-gray-200">
		<img
			src="/images/bots/{imgName}.png"
			alt="img-{name}-logo"
			class="h-auto w-full rounded-md object-cover object-center img-logo"
		/>

		<div class="mb-2 mt-6">
			<h3 class="tracki text-center text-lg font-semibold uppercase">
				{namebot}
			</h3>
		</div>
	</a>
</div>

<style>
	.img-logo {
		max-width: 120px;
	}
</style>
