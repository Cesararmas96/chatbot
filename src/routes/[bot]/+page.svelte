<script lang="ts">
  import { page } from "$app/stores";

  import ContainerChatBox from "$lib/ContainerChatBox.svelte";
  import SelectBots from "$lib/SelectBots.svelte";
  import SidebarBot from "$lib/SidebarBot.svelte";
  import { ApiChatBot } from "$lib/helpers/commons";
  import axios from "axios";

  export let data;

  const { user } = data;

  let isLoading = false;
  let query = "";
  const bot = $page.params.bot.toString();
  let token = localStorage.getItem("token");
  let messages: any[] = [];

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    isLoading = true; // Mostrar el div de carga

    const apiUrl = `${import.meta.env.VITE_API_AI_URL}/api/v1/chat/${ApiChatBot[bot]}`;

    try {
      const response = await axios.post(
        apiUrl,
        { query },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;

        messages = [...messages, { text: data.answer, query: data.question }];
        query = "";
      } else {
        console.error("Error getting response:", response.statusText);
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      isLoading = false;
    }
  };
</script>

<div class="flex h-screen antialiased text-gray-800">
  <div class="flex flex-row h-full w-full overflow-x-hidden">
    <SidebarBot {user} />

    <div class="flex flex-col flex-auto h-full p-6">
      <div class="flex flex-col flex-auto flex-shrink-0 bg-white h-full p-4">
        <SelectBots />
        <ContainerChatBox {isLoading} {messages} />

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
                  class="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10 {isLoading
                    ? 'bg-gray-200 cursor-not-allowed opacity-50'
                    : ''}"
                />
              </div>
            </div>
            <div class="ml-4">
              <button
                disabled={isLoading}
                type="submit"
                class="flex items-center justify-center bg-pink-600 hover:bg-pink-700 rounded-full text-white px-3 py-3 flex-shrink-0 {isLoading
                  ? 'bg-gray-200 cursor-not-allowed opacity-50'
                  : ''}"
              >
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
