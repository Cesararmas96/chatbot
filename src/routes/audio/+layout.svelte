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
	import { Upload, FileAudio, Plus, LogOut, Settings, Search } from 'lucide-svelte'
	import { enhance } from '$app/forms'

	import { storeUser } from '$lib/stores'
	export let data: any

	$storeUser = data.user
	const session = data.user ? data.user : $storeUser

	let inputType = 'file'
	let searchTerm = ''
	let processedAudios = [
		{ id: 'audio-1', status: 'completed', name: 'Interview_001.mp3' },
		{ id: 'audio-2', status: 'processing', name: 'Lecture_002.wav' },
		{ id: 'audio-3', status: 'failed', name: 'Podcast_003.ogg' },
		{ id: 'audio-4', status: 'completed', name: 'Meeting_004.mp3' },
		{ id: 'audio-5', status: 'processing', name: 'Voicenote_005.wav' }
	]

	let filteredAudios = [...processedAudios]

	// Reactividad en Svelte, se recalcula automáticamente
	$: filteredAudios = processedAudios.filter((audio) =>
		audio.name.toLowerCase().includes(searchTerm.toLowerCase())
	)

	const handleSubmit = (e) => {
		e.preventDefault()
		const newAudioId = `audio-${Date.now()}`
		processedAudios = [
			...processedAudios,
			{ id: newAudioId, status: 'processing', name: `NewAudio_${processedAudios.length + 1}.mp3` }
		]
	}
</script>

<div class="flex flex-col md:flex-row h-screen bg-black text-white">
	<!-- Sidebar -->
	<div class="w-full md:w-64 bg-zinc-900 p-4 flex flex-col">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center">
				<a href="/audio" class="flex justify-center items-center">
					<img src="/troc.png" alt="" class="w-12 h-12" />
					<h1 class="text-xl font-bold ml-2">Audio</h1>
				</a>
			</div>
		</div>

		<Button
			href="/audio"
			class="mb-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
		>
			<Plus class="h-4 w-4 mr-2" /> New Processed Audio
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
				<h2 class="text-sm font-semibold mb-2">Processed Audios</h2>
				<ScrollArea
					class="h-[calc(100vh-380px)] md:h-[calc(100vh-280px)] rounded-md border border-zinc-800"
				>
					{#each filteredAudios as audio (audio.id)}
						<a href="/audio/{audio.id}">
							<div class="flex items-center p-2 hover:bg-zinc-800 cursor-pointer">
								<div
									class="w-2 h-2 rounded-full mr-2 {audio.status === 'completed'
										? 'bg-green-400'
										: audio.status === 'processing'
											? 'bg-yellow-400'
											: 'bg-red-400'}"
								></div>
								<FileAudio class="h-4 w-4 mr-2 text-gray-400" />
								<span class="text-sm truncate">{audio.name}</span>
							</div>
						</a>
					{/each}
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
	</div>

	<!-- Main Content -->
	<slot />
</div>
