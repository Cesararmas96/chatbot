<script>
  import "../app.css";
  import "../style.css";
  import "iconify-icon";

  import Toasts from "$lib/components/common/Toasts.svelte";

  let isPageLoaded = false;

  const pageLoaded = () => {
    isPageLoaded = true;
  };
</script>

{#if !isPageLoaded}
<div    use:pageLoaded class="z-10 flex h-screen w-screen items-center justify-center overflow-hidden">
  <div class="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-blue-400" />
</div>
  
{:else}
  <slot />
{/if}
<Toasts />
