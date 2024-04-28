<script lang="ts">
  import logo from "../../../src/assets/troc.png";
  import axios from "axios";
  import { marked } from "marked";
  // import { useState } from 'svelte';
  // import { useLoading } from '@sveltejs/kit';
  // const [loading, {start, done}] = useLoading(); // Variable de estado para controlar el estado de carga
  import { onMount } from 'svelte';
  let isLoading = false;


  let query = "";
  let chatResponse = '';

  let token = localStorage.getItem("token");
  const username = localStorage.getItem("username").charAt(0);
  let messages = []; //lista mensajes


  const handleSubmit = async (event) => {
    event.preventDefault();
    isLoading = true; // Mostrar el div de carga

    const apiUrl = "https://ai.trocdigital.net/api/v1/chat/TROCers";
    try {
      const response = await axios.post(  
        apiUrl,
        { query },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        console.log(data);
        console.log(data.answer);
        messages = [...messages, { text: data.answer, query: data.question }];
        query = "";

      } else {
        console.error("Error al obtener la respuesta:", response.statusText);
      }
    } catch (error) {
      console.error("Hubo un problema con la operación de fetch:", error);
    }finally{
      isLoading = false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("session");

    window.location.href = "/";
  };
</script>

<div class="flex h-screen antialiased text-gray-800">
  <div class="flex flex-row h-full w-full overflow-x-hidden">
    <div
      id="navbar"
      class="flex flex-col py-8 pl-6 pr-2 w-64 flex-shrink-0 !bg-red-950"
    >
      <div class="flex flex-row items-center justify-start h-12 w-full">
        <div
          class="flex items-center justify-center rounded-2xltext-indigo-700 h-10 w-10"
        >
          <img src={logo} alt="sd" />
        </div>
        <div class="ml-2 font-bold text-2xl text-white">Troc-Chat</div>
      </div>

      <div class="flex flex-col h-full justify-end text-white">
       
        <button class="flex flex-row items-center buttonnavar rounded-xl p-2">
          <div class="flex items-center justify-center h-6 w-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
              ><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
                d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
              /></svg
            >
          </div>
          <button on:click={handleLogout}>
            <div class="ml-2 text-sm font-semibold">Logout</div>
          </button>
        </button>
      </div>
    </div>

    <div class="flex flex-col flex-auto h-full p-6">
      <div class="flex flex-col flex-auto flex-shrink-0 bg-white h-full p-4">
        <select
          id="selectbot"
          onchange="location = this.value;"
          class="w-[200px] ml-auto border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
        >
          <option class="text-gray-900" value="trocers" selected
            >T-ROCers Chatbot</option
          >
          <option class="text-gray-900" value="askbrett"
            >AskBrett Chatbot</option
          >
          <option class="text-gray-900" value="bose">Bose Chatbot</option>

          <option class="text-gray-900" value="oddie" >Oddie Chatbot</option>

        </select>

        <div
          class="flex flex-col h-full overflow-x-auto mb-4 rounded-2xl bg-gray-100 mt-3"
          id="chatbox"
        >
          <div class="flex flex-col h-full">
            <div class="grid grid-cols-12 gap-y-2">
              {#each messages as message}
                
                <div class="col-start-6 col-end-13 p-3 rounded-lg">
                  <div class="flex items-center justify-start flex-row-reverse">
                    <div
                      class="uppercase flex items-center justify-center h-10 w-10 rounded-full bg-pink-600 flex-shrink-0 text-white"
                    >
                    {username}
                    </div>
                    <div
                      class="relative mr-3 text-sm bg-white py-2 px-4 shadow rounded-xl "
                    >
                      <div>
                        
                        {message.query}
                      
                      </div>
                    </div>
                  </div>
                </div>


                <div class="col-start-1 col-end-8 p-3 rounded-lg">
                  <div class="flex flex-row ">
                    <div
                      class="flex items-center justify-center h-10 w-10 rounded-full  flex-shrink-0"
                    >
                    <img src={logo} alt="sd">
                    </div>
                    <div
                      class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
                    >
                      <div>{@html marked(message.text)}</div>
                     
                    </div>
                  </div>
                </div>  
               
                {/each}
                
                {#if isLoading}
                <div class="col-start-1 col-end-8 p-3 rounded-lg">
                  <div class="flex flex-row ">
                    <div
                      class="flex items-center justify-center h-10 w-10 rounded-full  flex-shrink-0"
                    >
                    <img src={logo} alt="sd">
                    </div>
                    <div
                      class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl p-4 max-w-sm w-full mx-auto"
                    >

                      <div class="animate-pulse flex space-x-4">
                        <div class="flex-1 space-y-6 py-1">
                          <div class="h-2 bg-slate-300 rounded"></div>
                          <div class="space-y-3">
                            <div class="grid grid-cols-3 gap-4">
                              <div class="h-2 bg-slate-300 rounded col-span-2"></div>
                              <div class="h-2 bg-slate-300 rounded col-span-1"></div>
                            </div>
                            <div class="h-2 bg-slate-300 rounded"></div>
                            <div class="h-2 bg-slate-300 rounded"></div>
                            <div class="h-2 bg-slate-300 rounded"></div>
                          </div>
                        </div>
                      </div>
                   
                     
                    </div>
                  </div>
                </div>  
                {/if}
                
                
           
            </div>
          </div>
        </div>
        <form on:submit={handleSubmit}>
          <div
            class="flex flex-row items-center h-16 rounded-xl bg-white w-full"
          >
            <div class="flex-grow">
              <div class="relative w-full">
                <input
                  placeholder="Send a message."
                  type="text"
                  disabled={isLoading}
                  bind:value={query}
                  class="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10 {isLoading ? 'bg-gray-200 cursor-not-allowed opacity-50' : ''}"
                />

                
              </div>
            </div>
            <div class="ml-4">

              <button
              disabled={isLoading}
                type="submit"
                class="flex items-center justify-center bg-pink-600 hover:bg-pink-700 rounded-full text-white px-3 py-3 flex-shrink-0 {isLoading ? 'bg-gray-200 cursor-not-allowed opacity-50' : ''}" >
                <span class="">
                  <svg
                    class="w-4 h-4 transform rotate-45 -mt-px"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    ></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<style>
  #navbar {
    background: linear-gradient(
      180deg,
      rgba(244, 124, 32, 1) 1%,
      rgba(239, 80, 157, 1) 50%,
      rgba(0, 174, 229, 1) 100%
    );
  }

  svg {
    fill: white;
  }

  #selectbot {
    background: rgb(26, 211, 187);
    background: linear-gradient(
      90deg,
      rgba(26, 211, 187, 1) 1%,
      rgba(90, 185, 99, 1) 100%
    );
    color: white;
    font-weight: bold;
  }

</style>
