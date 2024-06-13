<script lang="ts">
    import { createEventDispatcher } from "svelte";
    export let isLoading;
    export let messages;
    const dispatch = createEventDispatcher();
  
    const handleRegenerate = (message) => {
      dispatch('regenerate', message.query);
    };
  </script>
  
  <div class="chat-box">
    {#each messages as message (message.query)}
      <div class="message">
        <p><strong>Q:</strong> {message.query}</p>
        <p><strong>A:</strong> {message.text}</p>
        <button on:click={() => handleRegenerate(message)}>Regenerate</button>
      </div>
    {/each}
  </div>
  