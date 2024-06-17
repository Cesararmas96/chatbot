<script lang="ts">
    import { page } from "$app/stores";
    import SidebarBot from "$lib/components/SidebarBot.svelte";
    import Header from "$lib/components/chat/Header.svelte";
      import { DarkMode } from 'flowbite-svelte'
      import SelectBots from '$lib/components/chat/SelectBots.svelte'
  
    let shared = $page.url.searchParams.get("shared") === "true";
  </script>
  
  <div class="sm:ml-64 ">
    <Header />
  
     <div class="flex flex-row h-full w-full overflow-x-hidden">
        {#if !shared}
          <SidebarBot />
        {/if}
        <div class="flex flex-col h-screen  flex-auto p-2 " >
         
            <slot />
        </div>
      </div>
  </div>
  