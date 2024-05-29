<script lang="ts">
  import { NameChatBot } from "../../helpers/commons";
  import { page } from "$app/stores";
  let bot = $page.params.bot;
  let botName = $page.url.searchParams.get("botName")
  
  function getNameChatBot(name: string, nameChatBotObj: typeof NameChatBot): string {
    return nameChatBotObj[name as keyof typeof NameChatBot] ?? "";
  }

</script>

<div class="flex flex-col justify-center items-center w-full h-full">
  <img src="/troc.png" width="150" alt="troc-logo" />
  <h2 class="font-bold text-lg dark:text-white">Welcome Back to {getNameChatBot(bot, NameChatBot) !== "" ? getNameChatBot(bot, NameChatBot) : botName}  Chatbot</h2>
  <p class="text-gray-500">How can I help you today?</p>
</div>
