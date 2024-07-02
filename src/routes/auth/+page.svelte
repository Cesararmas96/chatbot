<script lang="ts">
	import { Button, Input, Label, Tooltip } from 'flowbite-svelte'
	import ImgLogin from '../../assets/slider.png'
	import { enhance } from '$app/forms'
	import { page } from '$app/stores'

	export let data
	const { filteredObject } = data

	const apiUrl = import.meta.env.VITE_API_URL
	const redirecURI = `${$page.url.origin}/auth/callback`

	let errorMessage = ''
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
		},
		ADFSAuth: {
			description: 'Sign in with SSO',
			external: true,
			headers: { 'x-auth-method': 'ADFSAuth' },
			img: 'images/auth/ADFS.png',
			class: 'auth-adfs',
			name: 'ADFSAuth'
		}
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
</script>

<main class="h-screen">
	<div class="dark:text-white-dark text-black">
		<div class="flex bg-white">
			<div
				class="hidden w-full flex-col !justify-center text-white dark:text-black lg:!flex lg:!w-3/5"
			>
				<div class="carousel">
					<img src={ImgLogin} alt="Carrousel" />
				</div>

				<div class="absolute bottom-1 ml-2">
					<div
						class="mt-10 flex flex-col items-center justify-center text-center text-xs text-gray-500 lg:flex-row lg:justify-center"
					>
						<span class="lg:border-r lg:border-gray-400 lg:pr-1"
							>Copyright &copy; Navigator by T-ROC.</span
						>
						<span class="lg:border-r lg:border-gray-400 lg:pl-1 lg:pr-1">
							All rights Reserved.
						</span>
						<span class=" pl-1"> Privacy Policy Terms and Conditions Cookies </span>
					</div>
				</div>
			</div>
			<div class="flex w-full justify-center lg:!w-2/5">
				<div class=" m-2 flex w-full flex-col items-center pl-2 pr-2 sm:p-4">
					<div class="mb-5 self-start">
						<img src={ImgLogin} alt="" style="max-width: 80px" />
					</div>

					<div class="text-center text-2xl font-semibold">Welcome Back</div>

					<div class="mb-8 text-center text-lg text-gray-600">
						Please select how you want to connect with us
					</div>

					<ul class="grid w-full gap-4 sm:gap-5">
						{#if filteredObject}
							{#each Object.values(filteredObject) as method}
								<li>
									<Button
										href={`${apiUrl}${authMethods[method.name].uri}?redirect_uri=${redirecURI}`}
										weight="24"
										outline
										color={method.color}
										class="ml-auto mr-auto flex w-4/5 border text-gray-600 hover:bg-slate-100 hover:text-gray-700 {authMethods[
											method.name
										].class} border-blue-600 p-2 text-base shadow"
									>
										<img
											src={authMethods[method.name].img || 'images/auth/default.png'}
											style="max-width: 25px"
											class="mr-2"
											alt={authMethods[method.name].name}
										/>
										{authMethods[method.name].description}
									</Button>
									<Tooltip>{authMethods[method.name].description}</Tooltip>
								</li>
							{/each}
						{/if}
					</ul>

					<div class="mt-6 flex w-4/5 items-center justify-center">
						<div class="h-px flex-grow bg-gray-400 opacity-20" />
						<span class="flex-shrik px-4 text-gray-600">Or Continue With</span>
						<div class="h-px flex-grow bg-gray-400 opacity-20" />
					</div>

					<form
						id="form"
						class="mt-4 flex w-4/5 flex-col items-center"
						method="POST"
						action="?/login"
						use:enhance
					>
						<div class="w-full">
							<Label for="email" class="mb-1 font-semibold">Email</Label>
							<Input
								bind:value={username}
								type="text"
								id="username"
								defaultClass="block w-full mb-4 p-2.5  !bg-gray-50 !text-gray-900 !border-gray-300 !text-base rounded"
								name="username"
								placeholder="Email@email.com"
								required
								maxlength="100"
							/>
						</div>
						<div class="w-full">
							<Label for="password" class="mb-1 font-semibold">Password</Label>
							<Input
								id="password"
								type="password"
								defaultClass="block w-full  !bg-gray-50 !text-gray-900 !border-gray-300 !text-base rounded"
								name="password"
								placeholder="**********"
								required
								maxlength="100"
								bind:value={password}
							>
								<button slot="right" class="pointer-events-auto mt-1"> </button>
							</Input>
						</div>

						{#if errorMessage}
							<p class="mb-2 mt-2 w-full rounded-md border bg-red-100 p-2 text-center text-red-500">
								{errorMessage}
							</p>
						{/if}

						<div class="mt-5 w-full">
							<Button
								color="blue"
								class="w-full rounded bg-blue-600 text-sm font-semibold text-white shadow-xl hover:bg-blue-700 focus:outline-none"
								type="submit">Login</Button
							>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</main>

<style>
	.carousel {
		height: 100vh;
		position: relative;
		overflow: hidden;
		max-width: 80%;
	}
</style>
