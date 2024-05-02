<script lang="ts">
  import { page } from "$app/stores";
  import {  NameChatBot } from "./helpers/commons";

  let bot = $page.params.bot;


  let chatBotNames = [
    { id: "trocers", name: "T-ROCers" },
    { id: "bose", name: "Bose" },
    { id: "askbrett", name: "AskBrett" },
    { id: "oddie", name: "Oddie" },
  ];
</script>

<div class="flex items-center">
  <div class="font-bold text-xl">
    <p class="namebot {bot}">{NameChatBot[bot]} ChatBot</p>
  </div>
  <select
    id="selectbot"
    onchange="location = this.value;"
    class="w-[200px] ml-auto border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
  >
    <!-- <option class="text-gray-900" value="">Change the chatBot</option> -->
    {#each chatBotNames as { id, name }}
      <option class="text-gray-900" value={id} selected={id === bot}
        >{name} Chatbot</option
      >
    {/each}
  </select>
</div>
