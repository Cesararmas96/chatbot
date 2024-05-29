<script lang="ts">
    import { NameChatBot } from "$lib/helpers/commons";
    import { DarkMode } from "flowbite-svelte";
    export let bot;
  </script>
  
  <header class="w-full mx-auto bg-white dark:bg-slate-950">
    <nav class="flex items-center justify-between p-4">
      <span class="ml-5 whitespace-nowrap text-xl font-semibold dark:text-white">{NameChatBot[bot]} ChatBot</span>
      <DarkMode class="inline-block dark:hover:text-white hover:text-gray-900" />
    </nav>x
  </header>