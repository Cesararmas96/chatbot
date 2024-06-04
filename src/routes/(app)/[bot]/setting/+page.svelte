<script>
	import SidebarBot from '$lib/components/SidebarBot.svelte'
	import { Input, Label, Select, Radio, Range } from 'flowbite-svelte'
	let minmaxValue = 5
	import { page } from '$app/stores'
  let bot = $page.params.bot.toString()

</script>

<div class="p-2">
	<div class="flex items-center mb-5">
		<a
			href="/{bot}/"
			class="rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group hover:text-black p-2 bg-gray-100"
		>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-4"
				><path
					d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
				/></svg
			>

		</a>
		<h2 class="text-xl font-semibold ml-2 dark:text-white">Setting</h2>
	</div>

	<form action="">
		<div class="border-dashed border p-3 my-2 rounded-lg">
			<div class="mb-5 text-lg">
				<h3 class="font-semibold dark:text-white">Chatbot</h3>

				<p class="text-xs text-gray-500">
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. A dolorem illo nisi nam vero
					impedit qui in maiores voluptatem rem, eum, quam commodi mollitia hic quod reprehenderit,
					error cupiditate? Iste!
				</p>
			</div>
			<div class="grid gap-6 mb-6 md:grid-cols-2">
				<div>
					<Label class="text-sm mb-1">Name</Label>
					<Input type="text"></Input>
				</div>

				<div>
					<Label class="text-sm mb-1">Company</Label>
					<Input type="text"></Input>
				</div>

				<div>
					<Label class="text-sm mb-1">Company Website</Label>
					<Input type="text"></Input>
				</div>

				<div>
					<Label class="text-sm mb-1">Contact Information</Label>
					<Input type="text"></Input>
				</div>

				<div>
					<Label class="text-sm mb-1">Contact Form</Label>
					<Input type="text"></Input>
				</div>

				<div>
					<Label class="text-sm mb-1">Role</Label>
					<Input type="text"></Input>
				</div>

				<div>
					<Label class="text-sm mb-1">Purpose</Label>
					<Input type="text"></Input>
				</div>
			</div>
		</div>

		<div class="border-dashed border p-3 my-6 rounded-lg">
			<div class="mb-5 text-lg">
				<h3 class="font-semibold dark:text-white">Models</h3>

				<p class="text-xs text-gray-500">
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. A dolorem illo nisi nam vero
					impedit qui in maiores voluptatem rem, eum, quam commodi mollitia hic quod reprehenderit,
					error cupiditate? Iste!
				</p>
			</div>

			<div class="grid gap-6 mb-6 md:grid-cols-2">
				<div>
					<Label class="text-sm mb-1">
						LLM
						<Select />
					</Label>
				</div>

				<div>
					<Label class="text-sm mb-1">
						Model Name
						<Select />
					</Label>
				</div>

				<div>
					<Label class="text-sm mb-1">
						Embedding
						<Select />
					</Label>
				</div>

				<div>
					<Label class="text-sm mb-1">
						Tokenizer
						<Select />
					</Label>
				</div>

				<div class="flex gap-3">
					<Label class="text-sm mb-1">Use Bge</Label>
					<Radio>True</Radio>
					<Radio>False</Radio>
				</div>

				<div>
					<Label class="text-sm mb-1">
						Classification
						<Select />
					</Label>
				</div>

				<div>
					<Label class="text-sm mb-1">
						Summarization
						<Select />
					</Label>
				</div>

				<div>
					<Label class="text-sm mb-1">
						Rag_model
						<Select />
					</Label>
				</div>
			</div>
		</div>

		<div class="border-dashed border p-3 my-6 rounded-lg">
			<div class="mb-5 text-lg">
				<h3 class="font-semibold dark:text-white">LLM Config</h3>

				<p class="text-xs text-gray-500">
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. A dolorem illo nisi nam vero
					impedit qui in maiores voluptatem rem, eum, quam commodi mollitia hic quod reprehenderit,
					error cupiditate? Iste!
				</p>
			</div>

			<div class="grid gap-6 mb-6 md:grid-cols-2">
				<div class="flex gap-3">
					<Label class="text-sm mb-1">Use Barden</Label>
					<Radio>True</Radio>
					<Radio>False</Radio>
				</div>

				<div>
					<Label class="text-sm mb-1">Max Token</Label>
					<Range min="0" max="10" bind:value={minmaxValue} />
					<p class="dark:text-gray-500 text-sm">Value: {minmaxValue}</p>
				</div>
				<div>
					<Label class="text-sm mb-1">Top K</Label>
					<Range min="0" max="10" bind:value={minmaxValue} />
					<p class="dark:text-gray-500 text-sm">Value: {minmaxValue}</p>
				</div>

				<div>
					<Label class="text-sm mb-1">Top P</Label>
					<Range min="0" max="10" bind:value={minmaxValue} />
					<p class="dark:text-gray-500 text-sm">Value: {minmaxValue}</p>
				</div>
			</div>
		</div>

		<div class="border-dashed border p-3 my-6 rounded-lg">
			<div class="mb-5 text-lg">
				<h3 class="font-semibold dark:text-white">Vector Database</h3>

				<p class="text-xs text-gray-500">
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. A dolorem illo nisi nam vero
					impedit qui in maiores voluptatem rem, eum, quam commodi mollitia hic quod reprehenderit,
					error cupiditate? Iste!
				</p>
			</div>

			<div class="grid gap-6 mb-6 md:grid-cols-2">
				<div>
					<Label class="text-sm mb-1">Collection</Label>
					<Input type="text"></Input>
				</div>
				<div>
					<Label class="text-sm mb-1">Vector Database</Label>
					<Input type="text"></Input>
				</div>

				<div>
					<Label class="text-sm mb-1">Database</Label>
					<Input type="text"></Input>
				</div>

				<div>
					<Label class="text-sm mb-1">Chunk Size</Label>
					<Input type="text"></Input>
				</div>
			</div>
		</div>

		<div class="border-dashed border p-3 my-6 rounded-lg">
			<div class="mb-5 text-lg">
				<h3 class="font-semibold dark:text-white">Pre Instructionse</h3>

				<p class="text-xs text-gray-500">
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. A dolorem illo nisi nam vero
					impedit qui in maiores voluptatem rem, eum, quam commodi mollitia hic quod reprehenderit,
					error cupiditate? Iste!
				</p>
			</div>

			<div class="grid gap-6 mb-6 md:grid-cols-2">
				<div>
					<Label class="text-sm mb-1">Instruction</Label>
					<Input type="text"></Input>
				</div>
			</div>
		</div>

		<div class="border-dashed border p-3 my-6 rounded-lg">
			<div class="mb-5 text-lg">
				<h3 class="font-semibold dark:text-white">Knowledge Base</h3>

				<p class="text-xs text-gray-500">
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. A dolorem illo nisi nam vero
					impedit qui in maiores voluptatem rem, eum, quam commodi mollitia hic quod reprehenderit,
					error cupiditate? Iste!
				</p>
			</div>

			<div class="grid gap-6 mb-6 md:grid-cols-2">
				<div>
					<Label class="text-sm mb-1">Data</Label>
					<Input type="text"></Input>
				</div>
			</div>
		</div>
	</form>
</div>
