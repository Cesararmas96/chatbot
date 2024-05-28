<script>
  import { DarkMode, Navbar } from "flowbite-svelte";
  import { page } from "$app/stores";
  import { NameChatBot } from "$lib/helpers/commons";

  const bot = $page.params.bot.toString();
  let shared = $page.url.searchParams.get("shared") === "true";

</script>

<header class="w-full mx-auto bg-white dark:bg-slate-950">
  {#if !shared}
    <button
      id="toggle-drawer-button"
      aria-controls="default-sidebar"
      type="button"
      class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
    >
      <span class="sr-only">Open sidebar</span>
      <svg
        class="w-6 h-6"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clip-rule="evenodd"
          fill-rule="evenodd"
          d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
        ></path>
      </svg>
    </button>
  {/if}

  <Navbar>
    <span class="ml-5 whitespace-nowrap text-xl font-semibold dark:text-white">
      {NameChatBot[bot]} ChatBot
    </span>
    <div class="flex items-center ml-auto">
      <DarkMode
        class="inline-block dark:hover:text-white hover:text-gray-900"
      />
    </div>
  </Navbar>
</header>
