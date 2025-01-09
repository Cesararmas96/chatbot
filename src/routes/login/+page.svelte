<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js'
	// import { Input } from '$lib/components/ui/input/index.js'
	import { Input } from 'flowbite-svelte'
	import { Label } from '$lib/components/ui/label/index.js'
	import * as Tooltip from '$lib/components/ui/tooltip/index.js'
	import { enhance } from '$app/forms'
	import type { ActionData } from './$types'
	import { page } from '$app/stores'
	import { errorCodes } from '$lib/helpers/error-codes'
	import { onMount } from 'svelte'

	import { loading } from '$lib/stores/preferences'

	export let data
	const { filteredObject } = data
	export let form: ActionData

	const apiUrl = import.meta.env.VITE_API_AI_URL
	const isAIEnabled = import.meta.env.VITE_API_AI_URL === 'https://ai-dev.trocdigital.net'
	const redirecURI = `${$page.url.origin}/login/callback`

	let showPassword: boolean = false

	let errorMessage = form?.error?.message || ''
	let username = ''
	let password = ''

	const keyDownEnter = (e: any) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			document.getElementById('form')?.dispatchEvent(new Event('submit'))
		}
	}

	const customAuthMethods: Record<string, any> = {
		AzureAuth: {
			description: 'Sign in with Microsoft',
			external: true,
			headers: { 'x-auth-method': 'AzureAuth' },
			img: 'images/auth/Microsoft.png',
			class: 'auth-microsoft',
			name: 'Microsoft',
			uri: '/api/v1/auth/azure/'
		}
		// ADFSAuth: {
		// 	description: 'Sign in with SSO',
		// 	external: true,
		// 	headers: { 'x-auth-method': 'ADFSAuth' },
		// 	img: 'images/auth/ADFS.png',
		// 	class: 'auth-adfs',
		// 	name: 'ADFSAuth'
		// }
	}

	const authMethods = {
		...data.authMethods,
		...Object.keys(customAuthMethods).reduce((acc: any, key: string) => {
			if (data.authMethods && data.authMethods[key]) {
				acc[key] = { ...data.authMethods[key], ...customAuthMethods[key] }
			}
			return acc
		}, {})
	}

	$: _loading = Boolean(form && !(form?.invalid === true || form?.credentials === true))
	onMount(() => {
		$loading = false
	})
</script>

<main class="h-screen auth" style="background-image: url('./images/auth/ai-background.jpg');">
	<div class="dark:text-white-dark text-black">
		<div class="flex items-center justify-center min-h-screen">
			<div
				class="hidden w-full flex-col !justify-center text-white dark:text-black lg:!flex lg:!w-3/5"
			>
				<div class="absolute bottom-1 ml-2">
					<div
						class="mt-10 flex flex-col items-center justify-center text-center text-xs text-gray-100 lg:flex-row lg:justify-center"
					>
						<span class="lg:border-r lg:border-gray-400 lg:pr-1"
							>Copyright &copy; Navigator by T-ROC.</span
						>
						<span class="lg:border-r lg:border-gray-400 lg:pl-1 lg:pr-1">All rights Reserved.</span>
						<span class="pl-1">Privacy Policy Terms and Conditions Cookies</span>
					</div>
				</div>
			</div>
			<div
				id="loginAuth"
				class="flex lg:!w-2/5 bg-opacity-80 bg-gray-800 rounded-lg items-center justify-center lg:mr-5"
			>
				<div class="m-2 flex w-full flex-col items-center pl-2 pr-2 sm:p-4">
					<div class="self-center mb-10">
						<img
							src="/images/auth/logo-white.png"
							alt="Logo T-Roc"
							style="max-width: 200px"
							loading="lazy"
						/>
					</div>

					<div class="text-center text-2xl font-semibold text-gray-100">Welcome Back</div>

					<div class="mb-8 text-center text-lg text-gray-200">
						Many thanks for being a tester of T-ROC Bots
					</div>

					<ul class="grid w-full gap-4 sm:gap-5">
						{#if filteredObject}
							{#each Object.values(filteredObject) as method}
								{#if method.name === 'AzureAuth'}
									<li>
										<Tooltip.Root>
											<Tooltip.Trigger asChild let:builder>
												<Button
													href={`${apiUrl}/api/v1/auth/azure/?redirect_uri=${redirecURI}`}
													class="ml-auto mr-auto flex w-4/5 border text-gray-200 hover:bg-slate-100 hover:text-gray-700 {authMethods[
														method.name
													].class} border-white p-2 text-base shadow"
												>
													<img
														src={authMethods[method.name].img || 'images/auth/default.png'}
														style="max-width: 25px"
														class="mr-2"
														alt={authMethods[method.name].name}
														loading="lazy"
													/>
													Sign in with SSO TROC
												</Button>
											</Tooltip.Trigger>
											<Tooltip.Content>
												<p>Sign in with SSO TROC</p>
											</Tooltip.Content>
										</Tooltip.Root>
									</li>
								{/if}
							{/each}
						{/if}
					</ul>
					{#if isAIEnabled}
						<div class="mt-6 flex w-4/5 items-center justify-center">
							<div class="h-px flex-grow bg-gray-200 opacity-20" />
							<span class="flex-shrik px-4 text-gray-100">Or Continue With</span>
							<div class="h-px flex-grow bg-gray-200 opacity-20" />
						</div>

						<form
							id="form"
							class=" flex w-4/5 flex-col items-center"
							method="POST"
							action="?/login"
							on:submit={() => (_loading = true)}
							use:enhance
						>
							<div class="w-full">
								<Label for="email" class="mb-1 font-semibold text-gray-100">Email</Label>
								<Input
									bind:value={username}
									type="text"
									id="username"
									defaultClass="block w-full mb-4 p-2.5 !bg-gray-50 !text-gray-900 !border-gray-300 !text-base rounded "
									name="username"
									placeholder="Email@email.com"
									required
									maxlength="100"
								></Input>
							</div>
							<div class="w-full">
								<Label for="password" class="font-semibold text-gray-100">Password</Label>
								<Input
									id="password"
									type={showPassword ? 'text' : 'password'}
									defaultClass="flex block w-full !bg-gray-50 !text-gray-900 !border-gray-300 !text-base rounded mb-2"
									name="password"
									placeholder="**********"
									required
									maxlength="100"
									bind:value={password}
								></Input>
							</div>
							{#if errorMessage}
								<p class="text-red-500 text-xs italic">{errorMessage}</p>
							{/if}
							<Button
								disabled={_loading}
								type="submit"
								class="mt-8 w-full p-3 rounded font-semibold text-sm">Sign In</Button
							>

							{#if form?.invalid}
								<p
									class="mb-2 mt-2 w-full rounded-md border bg-red-100 p-2 text-center text-red-500"
								>
									Username and password is required.
								</p>
							{/if}

							{#if form?.credentials}
								<p
									class="mb-2 mt-2 w-full rounded-md border bg-red-100 p-2 text-center text-red-500"
								>
									{@html errorCodes[form?.message?.status]
										? `${errorCodes[form?.message?.status].title}. ${
												errorCodes[form?.message?.status].message
											}`
										: form?.message?.reason}
								</p>
							{/if}
						</form>

						<div class="mt-4 flex w-4/5 items-center justify-center">
							<a class="mt-2 text-sm text-gray-100 hover:underline" href="?/forgot-password"
								>Forgot your password?</a
							>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</main>

<style>
	.auth {
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
		height: 100vh;
		margin: 0;
	}
</style>
