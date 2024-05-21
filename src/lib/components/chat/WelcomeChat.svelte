<script lang="ts">
  import { NameChatBot } from "../../helpers/commons";

  import { page } from "$app/stores";
  let bot = $page.params.bot;
  export let botName;
  console.log(botName)
</script>

<div class="flex flex-col justify-center items-center w-full h-full">
  <img src="/troc.png" width="150" alt="troc-logo" />
  <h2 class="font-bold text-lg dark:text-white">Welcome Back to { NameChatBot[bot] !== undefined ? NameChatBot : botName  } Chatbot</h2>
  
  <p class="text-gray-500">How can I help you today?</p>
</div>
