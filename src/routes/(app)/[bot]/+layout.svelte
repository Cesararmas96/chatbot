<script lang="ts">
  import { page } from "$app/stores";
  import SidebarBot from "$lib/components/SidebarBot.svelte";
  import Header from "$lib/components/chat/Header.svelte";

  let shared = $page.url.searchParams.get("shared") === "true";
</script>

<div class="sm:ml-64">
  <Header />

  <div class="flex h-screen antialiased text-gray-800  ">
    <div class="flex flex-row h-full w-full overflow-x-hidden">
      {#if !shared}
        <SidebarBot />
      {/if}
      <div class="flex flex-col flex-auto h-full" class:p-6={!shared}>
        <div class="flex flex-col flex-auto flex-shrink-0 h-full p-4">
          <slot />
        </div>
      </div>
    </div>
  </div>
</div>
