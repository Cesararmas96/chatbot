<script lang="ts">
  import { Button, Input } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";
  import axios from "axios";
  import { page } from "$app/stores";

  export let message;
  const dispatch = createEventDispatcher();
  let inputDisabled = true;

  const bot = $page.params.bot.toString();
  let reason: string = "";
  let catalog: any;

  const reasons = [
    {
      name: "Offensive/Unsafe",
      value: "Navigator::Chatbots::Offensive/Unsafe",
    },
    {
      name: "Not factually correct",
      value: "Navigator::Chatbots::Not factually correct",
    },
    {
      name: "Other",
      value: "Navigator::Chatbots::Other",
    },
  ];

  const handleCatalog = async (cat: any) => {
    catalog = cat;
    if (catalog.name !== "Other") {
      reason = catalog.name;
      handleDislikeSubmit(null);
    }
  };

  const handleDislikeSubmit = async (event: any) => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/support/api/v1/anon_ticket`;

    const body = message.text + "\n\n" + reason;
    const payload = {
      type: "Incident",
      group: "Navigator Support",
      attachments: [],
      service_catalog: catalog.value,
      title: "TEST " + message.query,
      body,
      non_anonymous: true,
    };

    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        apiUrl,
        { ...payload },
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }

    dispatch("close");
  };
</script>

<div
  class="relative mt-2 ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl flex flex-col gap-3"
>
  <div class="flex flex-row justify-between">
    <div>Why did you choose this rating? (optional)</div>
    <!-- svelte-ignore a11y-missing-attribute -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div>
      <a class="hover:cursor-pointer" on:click={() => dispatch("close")}>X</a>
    </div>
  </div>
  <div class="flex flex-row gap-2">
    {#each reasons as item}
      <Button
        color="light"
        class="px-3 py-0"
        on:click={() => handleCatalog(item)}>{item.name}</Button
      >
    {/each}
  </div>
  <div>
    <Input
      type="text"
      bind:value={reason}
      placeholder="Provide additional feedback"
      size="md"
      disabled={catalog?.name !== "Other"}
    />
  </div>
  <div>
    <Button
      on:click={handleDislikeSubmit}
      color="light"
      size="xs"
      disabled={catalog?.name !== "Other"}>Submit</Button
    >
  </div>
</div>
