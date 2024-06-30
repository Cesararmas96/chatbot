<script>
    import { onMount } from 'svelte';
    export let mediaElement;
    let videoRef;
    let canvasRef;
  
    onMount(() => {
      mediaElement = videoRef;
    });
  </script>
  
  <div class="videoWrap">
    <video bind:this={videoRef} class="videoEle show" autoplay></video>
    <canvas bind:this={canvasRef} class="videoEle hide"></canvas>
  </div>
