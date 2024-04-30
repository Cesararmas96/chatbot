<script>
  import BotMessage from "./BotMessage.svelte";
  import LoadingMessage from "./LoadingMessage.svelte";
  import QuestionMessage from "./QuestionMessage.svelte";
  export let isLoading;
  export let messages;
</script>

<div
  class="flex flex-col h-full overflow-x-auto mb-4 rounded-2xl bg-gray-100 mt-3 chatbox"
>
  <div class="flex flex-col h-full">
    <div class="grid grid-cols-12 gap-y-2">
      {#each messages as message}
        <QuestionMessage {message} />
        <BotMessage {message} />
      {/each}

      {#if isLoading}
        <LoadingMessage />
      {/if}
    </div>
  </div>
</div>
