<script lang="ts">
  import { NameChatBot } from "$lib/helpers/commons.js";
import { onMount } from "svelte";
import Card from "$lib/components/home/Card.svelte";
import { Input } from 'flowbite-svelte'

  let selectedValue;

  let searchTerm = "";
</script>
<div
		class="flex flex-col items-center justify-start gap-y-2 px-4 lg:w-[50%] lg:flex-row lg:gap-x-4"
	>
  <Input
  type="text"
  size="md"
  class="form-control rounded bg-white/75 p-2 pl-8 text-base placeholder:text-muted dark:bg-dark-100/50"
  placeholder="Start typing to search a Chatbot..."

>
  
</Input>

</div>
  <ul class="grid grid-cols-2 gap-4 p-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">

 
      {#each Object.keys(NameChatBot) as key}
    
        <Card namebot={NameChatBot[key]} link={key} />
      {/each}
    </ul>

