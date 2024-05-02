<script>
  import BotMessage from "./BotMessage.svelte";
  import LoadingMessage from "./LoadingMessage.svelte";
  import QuestionMessage from "./QuestionMessage.svelte";
  import WelcomeChat from "./WelcomeChat.svelte";
  
  export let isLoading;
  export let messages;
  import { afterUpdate } from 'svelte';
	let element;
  // Either afterUpdate()
  console.log(messages)
  afterUpdate(() => {
    if (messages && messages.length > 0) 
      scrollToBottom(element)
    
  });

  const scrollToBottom = async (node) => {
    node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
  }; 
</script>

<div
  class="flex flex-col h-full overflow-x-auto mb-4 rounded-2xl bg-gray-100 mt-3 chatbox"
>
  <div class="flex flex-col h-full">
    {#if messages && messages.length > 0}
    <div class="grid grid-cols-12 gap-y-2 overflow-auto" bind:this={element}>
      {#each messages as message}
        <QuestionMessage {message} />
        <BotMessage {message} />
      {/each}

      {#if isLoading}
        <LoadingMessage />
      {/if}
    </div>
    {:else}
    <WelcomeChat/>
    {/if}


  </div>
</div>
