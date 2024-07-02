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
  <img src="/images/bots/{bot}.png" class="w-32 md:w-36" alt="{bot}-logo" />
  <h2 class="font-bold md:text-lg dark:text-white text-sm">Welcome Back to {getNameChatBot(bot, NameChatBot) !== "" ? getNameChatBot(bot, NameChatBot) : botName}  Chatbot</h2>
  <p class="text-gray-500 md:text-base text-xs">How can I help you today?</p>
</div>
