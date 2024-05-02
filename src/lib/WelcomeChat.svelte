<script lang="ts">
  import {  NameChatBot } from "./helpers/commons";
    
  import { page } from "$app/stores";
  let bot = $page.params.bot;


</script>

<div class="flex flex-col justify-center items-center w-full h-full">
    <img src="/troc.png" width="150" alt="troc-logo">
    <h2 class="font-bold text-lg">Welcome Back to {NameChatBot[bot]} Chatbot</h2>


    <p class="text-gray-500">How can I help you today?</p>
</div>

