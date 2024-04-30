<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
	
  let bot = "";
  let NameBot = "";
	

  let chatBotNames = [
    { id: "trocers", name: "T-ROCers" },
    { id: "bose", name: "Bose" },
    { id: "askbrett", name: "AskBrett" },
    { id: "oddie", name: "Oddie" },
  ];
  enum ApiChatBot {
    trocers = "trocers",
    bose = "bose",
    askbrett = "askbrett",
    oddie = "oddie",
  }
  let aqui = "";
  onMount(() => {
    bot = $page.params.bot;
  });
</script>
<div class="flex items-center">
  <div class="font-bold text-xl ">
    {#each chatBotNames as { id, name }}
      {#if id === bot }
        <p class="namebot {bot}">{name} ChatBot</p>
      {/if}
  {/each} 

  </div>
  <select
    id="selectbot"
    onchange="location = this.value;"
    class="w-[200px] ml-auto border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
  >
  <option class="text-gray-900" value="">Change the chatBot</option>
  {#each chatBotNames as { id, name }}
  <option class="text-gray-900" value={id}>{name} Chatbot</option>
  
  {/each} 
  
  
  </select>
</div>
