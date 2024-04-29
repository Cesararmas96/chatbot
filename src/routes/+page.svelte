<script lang="ts">
	import { Button, Input, Label } from 'flowbite-svelte'
	import type { ActionData } from './$types'
	import ImgLogin from '../assets/slider.png'

	
	let errorMessage = "";
	let username = "";
  	let password = "";
  	export let form: ActionData

	// mandarlo env
	const apiUrl = 'https://api.dev.trocdigital.io'


	const keyDownEnter = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			document.getElementById('form')?.dispatchEvent(new Event('submit'))
		}
	}

	
	// Hook crearle
	const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`${apiUrl}/api/v1/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-method":"BasicAuth",
        "Origin" : apiUrl,
        "Referer" : apiUrl
      },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {

		// console.log(await response.json()) 

      const { token, session } = await response.json();
	
	 
      // Guardar el token en el localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("session", session);
      localStorage.setItem("first_name", session.first_name);
      localStorage.setItem("last_name", session.last_name);

      
      window.location.href = "/trocers";

    } else {
      const error = await response.json();
      console.log(error);

	  if(error.status == 401){
		errorMessage= 'Your email is not registered.'
	  }

	  if(error.status == 403){
	  errorMessage = `Forbidden: Incorrect password`; 
	  }
    }
  }

</script>

	<main class="h-screen">
		<div class="dark:text-white-dark text-black">
			<div class="flex bg-white">
				<div
					class="hidden w-full flex-col !justify-center text-white dark:text-black lg:!flex lg:!w-3/5"
				>
				<div class="carousel">
					<img src={ImgLogin} alt="Image 1" >
				</div>

					<div class="absolute bottom-1 ml-2">
						<div
							class="mt-10 flex  flex-col items-center justify-center text-center text-xs text-gray-500 lg:flex-row lg:justify-center"
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
				<div class="flex w-full  justify-center lg:!w-2/5">
					<div class=" m-2 flex w-full flex-col items-center  pl-2 pr-2 sm:p-4">
						<div class="mb-5 self-start">
							<img src="{ImgLogin}" alt="" style="max-width: 80px" />
						</div>

						<div class="text-center text-2xl font-semibold">Welcome Back</div>

						
					

						
						<form
							id="form"
							class="mt-4 flex w-4/5 flex-col items-center"
							method="POST"
                            on:submit={handleSubmit}
							action="?/login"
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
									type='password'
									defaultClass="block w-full  !bg-gray-50 !text-gray-900 !border-gray-300 !text-base rounded"
									name="password"
									placeholder="**********"
									required
									maxlength="100"
                                    bind:value={password}
								>
									<button
										slot="right"
										
										class="pointer-events-auto mt-1"
									>
										
									</button>
								</Input>
							</div>

						
						  {#if errorMessage}
						  <p class="mb-2 mt-2 w-full rounded-md border bg-red-100 p-2 text-center text-red-500">{errorMessage}</p>
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
	.carousel{
		height: 100vh;
		position: relative;
		overflow: hidden;
		max-width: 80%;
	}
</style>   