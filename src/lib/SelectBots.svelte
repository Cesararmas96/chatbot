<script lang="ts">
    import { onMount } from 'svelte';
let selectedPage = '';
  import { page } from "$app/stores";

  let bot = "";

let chatBotNames = [
 { id:'trocers' , name: "T-ROCers"},
 { id:'bose' , name: "Bose"},
 { id:'askbrett' , name: "AskBrett"},
 { id:'oddie' , name: "Oddie"},
]
enum ApiChatBot {
  trocers = "trocers",
  bose = "bose",
  askbrett = "askbrett",
  oddie = "oddie"
};
let aqui =""
onMount(() => {
 
  bot = $page.params.bot;
  });
console.log(aqui)
</script>
  <select
    id="selectbot"
    onchange="location = this.value;"
    class="w-[200px] ml-auto border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
  >

  {#each chatBotNames as {id, name}}
    {#if name == aqui}
    <option class="text-gray-900" value="{id}">{name}</option>
    {:else}
    <option class="text-gray-900" value="{id}" selected>{name}</option>
  {/if}

  {/each}
</select>

<style>
  /* #selectbot {
    background: rgb(26, 211, 187);
    background: linear-gradient(
      90deg,
      rgba(26, 211, 187, 1) 1%,
      rgba(90, 185, 99, 1) 100%
    );
    color: white;
    font-weight: bold;
  } */
</style>
