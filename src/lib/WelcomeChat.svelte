<script lang="ts">
    
  import { page } from "$app/stores";
  import { ApiChatBot } from "./helpers/commons";
  let bot = $page.params.bot;


</script>

<div class="flex flex-col justify-center items-center w-full h-full">
    <img src="/troc.png" width="150" alt="troc-logo">
    <h2 class="font-bold text-lg">Welcome Back to {ApiChatBot[bot]} Chatbot</h2>


    <p class="text-gray-500">How can I help you today?</p>
</div>

