<script lang="ts">
  export let icon: string;
  export let size: string = "14px";
  export let classes: string = "";
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<iconify-icon {icon} height={size} class={classes} on:click />
