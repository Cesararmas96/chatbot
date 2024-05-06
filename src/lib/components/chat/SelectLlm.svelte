<script lang="ts">
  import { page } from "$app/stores";
  import { LlmChatBot } from "../../helpers/commons";
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const handleChange = (event) => {
    const selectValue = event.target.value
    dispatch('selectChange', {value: selectValue });
  }
</script>

<div class="flex items-center mt-2">
 
  <select
    id="selectllm"
    class="w-[200px] ml-auto border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
    on:change={handleChange}
    >
    {#each Object.keys(LlmChatBot) as key}
      <option class="text-gray-900" value={key} 
        >{LlmChatBot[key]}</option
      >
    {/each}
  </select>
</div>
