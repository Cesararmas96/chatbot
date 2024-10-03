<script lang="ts">
	import { onMount } from 'svelte'
	import { Button } from '$lib/components/ui/button/index.js'
	import { Input } from '$lib/components/ui/input/index.js'
	import { Label } from '$lib/components/ui/label/index.js'
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js'
	import { Separator } from '$lib/components/ui/separator/index.js'
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js'
	import * as Avatar from '$lib/components/ui/avatar/index.js'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js'
	import { Upload, FileAudio, Plus, LogOut, Home, Search, Loader } from 'lucide-svelte'
	import { enhance } from '$app/forms'
	import { getApiData } from '$lib/services/getData'
	import { jobsListStore } from '$lib/stores/jobsStore.ts';
	import { storeUser } from '$lib/stores'
	export let data: any

	$storeUser = data.user
	const session = data.user ? data.user : $storeUser

	let inputType = 'file'
	let searchTerm = ''
	// let jobsList = []
	let isLoading = false
	// const fetchJobs = async () => {
	// 	isLoading = true // Set loading state during data fetching
	// 	const apiUrl = `${import.meta.env.VITE_API_AI_URL}/api/v1/upload_videos`

	// 	try {
	// 		const fetchedJobs = await getApiData(
	// 			apiUrl,
	// 			'GET',
	// 			{},
	// 			{},
	// 			{
	// 				headers: {
	// 					Authorization: `Bearer ${session.token}`,
	// 					'Content-Type': 'application/json'
	// 				}
	// 			},
	// 			null,
	// 			true
	// 		)

	// 		// Sorting bots by name
	// 		jobsList = fetchedJobs.jobs
	// 		console.log(jobsList)
	// 	} catch (error) {
	// 		console.error('There was a problem with the fetch operation:', error)
	// 	} finally {
	// 		isLoading = false // Reset loading state after fetching
	// 	}
	// }

	// Puedes suscribirte al store para obtener la lista de trabajos (videos)
		let jobsList = [];

		// Suscribirse al store para obtener la lista de trabajos (videos)
	const unsubscribe = jobsListStore.subscribe((value) => {
		jobsList = value;
		filteredAudios = [...jobsList];
	});

	// let filteredAudios = [...jobsList]

	// Reactividad en Svelte, se recalcula automáticamente
	// $: filteredAudios = jobsList.filter((jobs) =>
	// 	jobs.video_path.toLowerCase().includes(searchTerm.toLowerCase())
	// )

	$: filteredAudios = jobsList.filter((job) => job.video_path.toLowerCase().includes(searchTerm.toLowerCase()));


	console.log(filteredAudios)

	const fetchJobs = async () => {
		isLoading = true;
		try {
			const fetchedJobs = await getApiData(
				`${import.meta.env.VITE_API_AI_URL}/api/v1/upload_videos`,
				'GET',
				{},
				{},
				{
					headers: {
						Authorization: `Bearer ${session.token}`,
						'Content-Type': 'application/json',
					},
				}
			);
			jobsListStore.set(fetchedJobs.jobs); // Guardamos los trabajos en el store
		} catch (error) {
			console.error('Error fetching jobs:', error);
		} finally {
			isLoading = false;
		}
	};

	onMount(() => {
		fetchJobs()
	})

	
</script>

<div class="flex flex-col md:flex-row h-screen bg-black text-white">
	<!-- Sidebar -->
	<div class="w-full md:w-64 bg-zinc-900 p-4 flex flex-col">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center">
				<a href="/video" class="flex justify-center items-center">
					<img src="/troc.png" alt="" class="w-12 h-12" />
					<h1 class="text-xl font-bold ml-2">Processed Video</h1>
				</a>
			</div>
		</div>

		<Button
			href="/video"
			class="mb-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
		>
			<Plus class="h-4 w-4 mr-2" /> New Processed Video
		</Button>

		<div class="relative mb-4">
			<Search class="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
			<Input
				type="text"
				placeholder="Search audios..."
				class="pl-8 bg-zinc-800 border-gray-600"
				bind:value={searchTerm}
			/>
		</div>

		<nav class="space-y-6 flex-grow overflow-hidden">
			<div>
				<h2 class="text-sm font-semibold mb-2">List Processed Videos</h2>
				<ScrollArea
					class="relative h-[calc(100vh-380px)] md:h-[calc(100vh-280px)] rounded-md border border-zinc-800"
				>
					{#if isLoading}
						<div class="absolute inset-0 flex justify-center items-center">
							<Loader class="animate-spin text-white h-8 w-8" />
						</div>
					{:else if filteredAudios.length === 0}
						<p class="absolute inset-0 flex justify-center items-center text-center text-gray-400">
							No videos found.
						</p>
					{:else}
						{#each filteredAudios as audio}
							<a href="/video/{audio.task_uid}">
								<div class="flex items-center p-2 hover:bg-zinc-800 cursor-pointer">
									<div
										class="w-2 h-2 rounded-full mr-2 {audio.error 
											? 'bg-red-400' 
											: audio.status === 'done'
												? 'bg-green-400' 
												: audio.status === 'processing' 
													? 'bg-yellow-400' 
													: 'bg-red-400'}"
									></div>
									<FileAudio class="h-4 w-4 mr-2 text-gray-400" />
									<span class="text-sm truncate">
										{#if audio.video_path.replace('/tmp/', '').length > 23}
											{audio.video_path.replace('/tmp/', '').slice(0, 23)}...
										{:else}
											{audio.video_path.replace('/tmp/', '')}
										{/if}
									</span>
								</div>
							</a>
						{/each}
					{/if}
				</ScrollArea>
			</div>
		</nav>

		<Separator class="my-4" />

		<div class="mt-auto">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<div class="flex items-center space-x-2 cursor-pointer hover:bg-zinc-800 p-2 rounded-lg">
						<Avatar.Root>
							<Avatar.Fallback class="bg-gray-600">
								{session.first_name[0] + session.last_name[0]}</Avatar.Fallback
							>
						</Avatar.Root>
						<div class="flex-grow">
							<p class="text-sm font-medium text-left">{session.first_name} {session.last_name}</p>
							<p class="text-xs text-gray-400">{session.email}</p>
						</div>
					</div>
				</DropdownMenu.Trigger>

				<DropdownMenu.Content class="w-56">
					<DropdownMenu.Group>
						<DropdownMenu.Item href="/bots" class="cursor-pointer">
							<Home class="mr-2 h-4 w-4" />
							<span>Home</span>
						</DropdownMenu.Item>

						<DropdownMenu.Item class="cursor-pointer">
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
	</div>

	<!-- Main Content -->
	<slot />
</div>
