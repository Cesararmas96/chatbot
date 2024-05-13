<script lang="ts">
  import { page } from "$app/stores";
  import { NameChatBot } from "../../helpers/commons";

  let bot = $page.params.bot;
</script>

<div class="flex items-center">
  
  <select
    id="selectbot"
    onchange="location = this.value;"
    class="w-[200px] ml-auto border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
  >
    <!-- <option class="text-gray-900" value="">Change the chatBot</option> -->
    {#each Object.keys(NameChatBot) as key}
      <option class="text-gray-900" value={key} selected={key === bot}
        >{NameChatBot[key]} Chatbot</option
      >
    {/each}
  </select>
</div>
