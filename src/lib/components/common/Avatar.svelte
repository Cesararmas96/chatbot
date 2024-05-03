<script lang="ts">
  import { storeUser } from "$lib/stores";

  export let showFullName: boolean = false;
</script>

<div class="flex flex-row items-center rounded-xl p-2">
  <div
    class="uppercase flex items-center justify-center h-10 w-10 rounded-full bg-pink-600 flex-shrink-0 text-white"
  >
    {$storeUser.first_name.charAt(0)}{$storeUser.last_name.charAt(0)}
  </div>

  {#if showFullName}
    <div class="ml-2 font-semibold">
      {$storeUser.first_name}
      {$storeUser.last_name}
    </div>
  {/if}
</div>
