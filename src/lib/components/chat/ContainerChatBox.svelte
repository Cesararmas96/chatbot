<script lang="ts">
  import BotMessage from "./BotMessage.svelte";
  import LoadingMessage from "./LoadingMessage.svelte";
  import QuestionMessage from "./QuestionMessage.svelte";
  import WelcomeChat from "./WelcomeChat.svelte";
  export let handleRegenerate;
  let last;
  export let isLoading;
  export let messages;
  import { afterUpdate } from "svelte";
  let element: HTMLDivElement;
  // Either afterUpdate()

  afterUpdate(() => {
    if (messages && messages.length > 0) scrollToBottom(element);
  });

  const scrollToBottom = async (node: HTMLDivElement) => {
    node.scroll({ top: node.scrollHeight, behavior: "smooth" });
  };
</script>

<div
  class="flex flex-col h-full overflow-x-auto mb-4 rounded-2xl bg-gray-100 mt-3 chatbox"
>
  <div class="flex flex-col h-full">
    {#if messages && messages.length > 0}
      <div class="grid grid-cols-12 gap-y-2 overflow-auto" bind:this={element}>
        {#each messages as message, index}
          <QuestionMessage {message} />
          <BotMessage
            {message}
            on:scrollToBottom={() => scrollToBottom(element)}
            handleRegenerate={handleRegenerate}
            last={index === messages.length - 1 ? 'true' : 'false'}
          />
        {/each}

        {#if isLoading}
          <LoadingMessage />
        {/if}
      </div>
    {:else}
      <WelcomeChat />
    {/if}
  </div>
</div>
