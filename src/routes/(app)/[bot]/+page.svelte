<script lang="ts">
  import { page } from "$app/stores";
  import SelectBots from "$lib/components/chat/SelectBots.svelte";
  import ContainerChatBox from "$lib/components/chat/ContainerChatBox.svelte";
  import SidebarBot from "$lib/components/SidebarBot.svelte";
  import { ApiChatBot, NameChatBot } from "$lib/helpers/commons";
  import { getApiData } from "$lib/services/getData.js";
  import { storeUser } from "$lib/stores/session.js";
  import SelectLlm from "$lib/components/chat/SelectLlm.svelte";
  import { DarkMode, NavBrand, NavHamburger, Navbar } from "flowbite-svelte";
  export let data;
  const { user } = data;

  storeUser.set(user);

  let isLoading = false;
  const bot = $page.params.bot.toString();
  let token = user?.token;
  let messages: any[] = [];
  let query = "";

  let shared = $page.url.searchParams.get("shared") === "true";
  let hidebot = $page.url.searchParams.get("hidebot") === "true";
  let hidellm = $page.url.searchParams.get("hidellm") === "true";

  let llm = $page.url.searchParams.get("llm") || "vertex";

  const fetchData = async (lastquery = "") => {
    isLoading = true;

    const apiUrl = `${import.meta.env.VITE_API_AI_URL}/${ApiChatBot[bot]}?use_llm=${llm}`;
    try {
      const { answer, question } = await getApiData(
        apiUrl,
        "POST",
        { query: query || lastquery },
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
        null,
        true
      );

      messages = [...messages, { text: answer, query: question }];
      query = "";
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      isLoading = false;
    }
  };

  const handleRegenerate = async (lastquery) => {
    await fetchData(lastquery);
  };

  const handleSubmit = async () => {
    await fetchData();
  };

  const handleSelectChange = (event) => {
    llm = event.detail.value;
  };
</script>
<ContainerChatBox {isLoading} {messages} {handleRegenerate} />
<form on:submit={handleSubmit}>
  <div class="flex flex-row items-center h-16 rounded-xl w-full">
    <div class="flex-grow">
      <div class="relative">
        <input
          placeholder="Send a message."
          type="text"
          disabled={isLoading}
          bind:value={query}
          class="dark:text-white dark:bg-gray-800 flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-10 h-10 {isLoading
            ? 'bg-gray-200 cursor-not-allowed opacity-50'
            : ''}"
        />

        <div
          class="absolute inset-y-0 left-0 pl-3
                            flex items-center
                            pointer-events-none"
        >
          {#if isLoading}
            <i class="fa-solid fa-spinner animate-spin text-gray-400"></i>
          {:else}
            <i class="fas fa-search text-gray-400"></i>
          {/if}
        </div>
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
        <span>
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
