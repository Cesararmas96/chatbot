
<script lang="ts">
	import { Button, Input, Label, P, Tooltip } from 'flowbite-svelte'
    

	// export let data




	let showPassword: boolean = false

	let year = new Date().getFullYear()

	// const errorCodes = {
	// 	'400':
	// 		'Bad Request. Please double-check your credentials and try again. For persistent issues contact support.',
	// 	'401':
	// 		'User Not Found: The email you entered does not exist. Please check your entry for any errors and try again.',
	// 	'403': 'Incorrect Password: Please double-check your credentials and try again.'
	// }

	// const keyDownEnter = (e) => {
	// 	if (e.key === 'Enter') {
	// 		e.preventDefault()
	// 		document.getElementById('form')?.dispatchEvent(new Event('submit'))
	// 	}
	// }

</script>

	<main class="h-screen">
		<div class="dark:text-white-dark text-black">
			<div class="flex bg-white">
				<div
					class="hidden w-full flex-col !justify-center text-white dark:text-black lg:!flex lg:!w-3/5"
				>


					<div class="absolute bottom-1 ml-2">
						<div
							class="mt-10 flex flex-col items-center justify-center text-center text-xs text-gray-500 lg:flex-row lg:justify-center"
						>
							<span class="lg:border-r lg:border-gray-400 lg:pr-1"
								>Copyright &copy;  Navigator by T-ROC.</span
							>
							<span class="lg:border-r lg:border-gray-400 lg:pl-1 lg:pr-1">
								All rights Reserved.
							</span>
							<span class=" pl-1"> Privacy Policy Terms and Conditions Cookies </span>
						</div>
					</div>
				</div>
				<div class="flex w-full items-center justify-center lg:!w-2/5">
					<div class=" m-2 flex w-full flex-col items-center justify-center pl-2 pr-2 sm:p-4">
						<div class="mb-5 self-start">
							<img src="" alt="-logo" style="max-width: 80px" />
						</div>

						<div class="text-center text-2xl font-semibold">Welcome Back</div>

						
					

						
						<form
							id="form"
							class="mt-4 flex w-4/5 flex-col items-center"
							action="?/login"
							method="POST"
						>
							<div class="w-full">
								<Label for="email" class="mb-1 font-semibold">Email</Label>
								<Input
									type="text"
									id="email"
									defaultClass="block w-full mb-4 p-2.5  !bg-gray-50 !text-gray-900 !border-gray-300 !text-base rounded"
									name="email"
									placeholder="Email@email.com"
									required
									maxlength="100"
								/>
							</div>
							<div class="w-full">
								<Label for="password" class="mb-1 font-semibold">Password</Label>
								<Input
									id="password"
									type='text'
									defaultClass="block w-full  !bg-gray-50 !text-gray-900 !border-gray-300 !text-base rounded"
									name="password"
									placeholder="**********"
									required
									maxlength="100"
								>
									<button
										slot="right"
										
										class="pointer-events-auto mt-1"
									>
										
									</button>
								</Input>
							</div>

						

							
							 

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
	@media (max-width: 768px) {
		.footer-copyright {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
		}
	}
</style>
