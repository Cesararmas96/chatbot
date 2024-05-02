<script>
  import { marked } from "marked";
  import { createEventDispatcher, onMount } from "svelte";
  import BotMessageDislike from "./BotMessageDislike.svelte";

  const dispatch = createEventDispatcher();

  export let message;

  console.log(message);

  let copied = false;
  let dislike = false;

  let clipboard = message.text;
  console.log(clipboard);

  function copyToClipboard() {
    navigator.clipboard
      .writeText(clipboard)
      .then(() => {
        copied = true;
        setTimeout(() => {
          copied = false;
        }, 2000);
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
      });
  }

  const handleDislike = () => {
    dislike = true;
    setTimeout(() => {
      dispatch("scrollToBottom");
    }, 100);
  };
  // onMount(() => {
  //   clipboard = marked(message.text);
  // });
</script>

<div class="col-start-1 col-end-8 p-3 rounded-lg">
  <div class="flex flex-row">
    <div
      class="flex items-center justify-center h-10 w-10 rounded-full flex-shrink-0"
    >
      <img src="/troc.png" alt="sd" />
    </div>
    <div class="flex flex-col">
      <div class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
        <div>{@html marked(message.text)}</div>
        <div class="flex justify-end mt-5 mb-2">
          {#if !dislike}
            <button title="Dislike" class="mr-2" on:click={handleDislike}>
              <svg
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                ><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
                  d="M323.8 477.2c-38.2 10.9-78.1-11.2-89-49.4l-5.7-20c-3.7-13-10.4-25-19.5-35l-51.3-56.4c-8.9-9.8-8.2-25 1.6-33.9s25-8.2 33.9 1.6l51.3 56.4c14.1 15.5 24.4 34 30.1 54.1l5.7 20c3.6 12.7 16.9 20.1 29.7 16.5s20.1-16.9 16.5-29.7l-5.7-20c-5.7-19.9-14.7-38.7-26.6-55.5c-5.2-7.3-5.8-16.9-1.7-24.9s12.3-13 21.3-13L448 288c8.8 0 16-7.2 16-16c0-6.8-4.3-12.7-10.4-15c-7.4-2.8-13-9-14.9-16.7s.1-15.8 5.3-21.7c2.5-2.8 4-6.5 4-10.6c0-7.8-5.6-14.3-13-15.7c-8.2-1.6-15.1-7.3-18-15.2s-1.6-16.7 3.6-23.3c2.1-2.7 3.4-6.1 3.4-9.9c0-6.7-4.2-12.6-10.2-14.9c-11.5-4.5-17.7-16.9-14.4-28.8c.4-1.3 .6-2.8 .6-4.3c0-8.8-7.2-16-16-16H286.5c-12.6 0-25 3.7-35.5 10.7l-61.7 41.1c-11 7.4-25.9 4.4-33.3-6.7s-4.4-25.9 6.7-33.3l61.7-41.1c18.4-12.3 40-18.8 62.1-18.8H384c34.7 0 62.9 27.6 64 62c14.6 11.7 24 29.7 24 50c0 4.5-.5 8.8-1.3 13c15.4 11.7 25.3 30.2 25.3 51c0 6.5-1 12.8-2.8 18.7C504.8 238.3 512 254.3 512 272c0 35.3-28.6 64-64 64l-92.3 0c4.7 10.4 8.7 21.2 11.8 32.2l5.7 20c10.9 38.2-11.2 78.1-49.4 89zM32 384c-17.7 0-32-14.3-32-32V128c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H32z"
                /></svg
              >
            </button>
          {/if}
          <button on:click={copyToClipboard} title="Copy">
            <svg
              width="20"
              height="20"
              class="svg dislike"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              ><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
                d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z"
              /></svg
            >
          </button>
        </div>
      </div>
      {#if dislike}
        <BotMessageDislike {message} on:close={() => (dislike = false)} />
      {/if}
    </div>
  </div>
</div>

<style>
  .svg.copy,
  .svg.dislike {
    fill: gray;
  }
</style>
