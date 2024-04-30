<script>
  import BotMessage from "./BotMessage.svelte";
  import LoadingMessage from "./LoadingMessage.svelte";
  import QuestionMessage from "./QuestionMessage.svelte";
  export let isLoading;
  export let messages;
  console.log(messages)
</script>

<div
  class="flex flex-col h-full overflow-x-auto mb-4 rounded-2xl bg-gray-100 mt-3 chatbox"
>
  <div class="flex flex-col h-full">
    <div class="grid grid-cols-12 gap-y-2">

      {#if messages && messages.length > 0}
      {#each messages as message}
        <QuestionMessage {message} />
        <BotMessage {message} />
      {/each}

      {#if isLoading}
        <LoadingMessage />
      {/if}
      {:else}
      <p class="text-gray-500">No hay mensajes disponibles.</p>

      {/if}


   
    </div>
  </div>
</div>
