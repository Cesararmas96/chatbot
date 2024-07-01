<script>
    import { onMount } from 'svelte';
    export let mediaElement;
    export let isLoadingAvatar;
    let videoRef;
    let canvasRef;
  
    onMount(() => {
      mediaElement = videoRef;
    });
  </script>
  
  <div class="w-full flex justify-center items-center flex-col">
    {#if !isLoadingAvatar}
    <div  class="w-full  flex justify-center">
      <div class="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-blue-400" />
    </div>
    {:else}
    <video bind:this={videoRef} class="w-3/5" autoplay></video>
    <!-- <canvas bind:this={canvasRef} class="videoEle hide"></canvas> -->

    {/if}
  </div>
