<script lang="ts">
  import { Button, Input } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";
  import axios from "axios";
  import { page } from "$app/stores";

  export let message;
  const dispatch = createEventDispatcher();
  let inputDisabled = true;

  const bot = $page.params.bot.toString();

  enum Reason {
    Offensive = "Offensive / Unsafe",
    NotFactuallyCorrect = "Not factually correct",
    Other = "Other",
  }

  const handleDislikeSubmit = async (event: any) => {
    if (event.target.textContent === Reason.Other) {
      inputDisabled = false;
      reason = "";
      return;
    }

    reason =
      event.target.textContent !== "Submit" ? event.target.textContent : reason;

    const apiUrl = `${import.meta.env.VITE_API_URL}/support/api/v1/support_ticket`;
    const body = JSON.stringify({ ...message, reason });
    const payload = {
      type: "Request",
      group: "People Team",
      attachments: [],
      service_catalog: "",
      title: `${bot} Dislike`,
      body,
    };

    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        apiUrl,
        { ...payload },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }

    dispatch("close");
  };

  let reason: string = "";
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
    {#each Object.values(Reason) as item}
      <Button color="light" class="px-3 py-0" on:click={handleDislikeSubmit}
        >{item}</Button
      >
    {/each}
  </div>
  <div>
    <Input
      type="text"
      bind:value={reason}
      placeholder="Provide additional feedback"
      size="md"
      disabled={inputDisabled}
    />
  </div>
  <div>
    <Button
      on:click={handleDislikeSubmit}
      color="light"
      size="xs"
      disabled={inputDisabled}>Submit</Button
    >
  </div>
</div>
