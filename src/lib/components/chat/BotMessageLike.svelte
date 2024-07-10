<script lang="ts">
  import { Button, Input } from "flowbite-svelte";
  import { createEventDispatcher, onMount } from "svelte";
  import { page } from "$app/stores";
  import { getApiData, postData } from "$lib/services/getData";
  import {
    sendErrorNotification,
    sendSuccessNotification,
  } from "$lib/stores/toast";
  

  export let message;
  const dispatch = createEventDispatcher();
  let inputDisabled = true;

  const bot = $page.params.bot.toString();
  let reason: string = "";
  let catalog: any;
  let feedbackReasons: string[] = [];

  onMount(async () => {
    const fetchData = async () => {
      const apiGoodFeedback = `${import.meta.env.VITE_API_AI_URL}/api/v1/feedback_types/Good`;
      try {
        const response = await getApiData(
          apiGoodFeedback,
          'GET',
          {},
          {},
          {headers: {
            "Content-Type" : "application/json",
            },
          },
          null,
          true
        );
        const feedbackData = await response.json();
        feedbackReasons = feedbackData.feedback;
        console.log(feedbackReasons);
      } catch (error) {
        throw new Error("Fetch operation failed: " + error.message);
      }
    };

    fetchData();
  });

  const handleCatalog = async (cat: string) => {
    catalog = cat;
  };

  let token ="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MjA5NzQ5ODIuNDk4NzYxLCJpYXQiOjE3MjA2MTQ5ODIsImlzcyI6Ik1vYmlsZWluc2lnaHQiLCJ1c2VyIjoxNTc3OSwidXNlcm5hbWUiOiJqbWVuZG96YTFAdHJvY2dsb2JhbC5jb20iLCJ1c2VyX2lkIjoxNTc3OSwiaWQiOiJqbWVuZG96YTFAdHJvY2dsb2JhbC5jb20ifQ.qbyTKhY5wOflzyZ503fHLXZ0vRHZiH20STVV5NALwAQ"
  
  const reasons = [
    {
      name: "Awesome",
      value: "Navigator::Chatbots::Awesome",
    },
    {
      name: "Usefull",
      value: "Navigator::Chatbots::Usefull",
    },
    {
      name: "Other",
      value: "Navigator::Chatbots::Other",
    },
  ];

  const handleLikeSubmit = async (event: any) => {
  const payload = {
    chatbot_id: "a6fcfaef-fe01-4040-94f3-bb418054ab5b",
    sid: "24292fac-b46d-447e-a4f7-f88d68e9c998",
    feedback_type: "Correct",  
    feedback: "Good Enough",
    like: true,
    rating: '5'
  };

  try {
    const url = "https://ai-dev.trocdigital.net/api/v1/bot_feedback";
    
    const setFeedback = await postData(url, payload);
    
    if (setFeedback && setFeedback.message) {
      sendSuccessNotification(setFeedback.message);
    } else {
      sendErrorNotification('Failed');
    }
    
  } catch (error) {
    sendErrorNotification( 'An unexpected error occurred');
    console.error("There was a problem with the fetch operation:", error);
  }

  dispatch("close");
};

// import axios from 'axios';
// const handleLikeSubmit = async (event: any) => {
//   const payload = {
//     chatbot_id: "a6fcfaef-fe01-4040-94f3-bb418054ab5b",
//     sid: "24292fac-b46d-447e-a4f7-f88d68e9c998",
//     feedback_type: "Correct",
//     feedback: "Good Enough",
//     like: true,
//     rating: '5'
//   };

//   try {
//     const url = "https://ai-dev.trocdigital.net/api/v1/bot_feedback";
//     console.log("Payload:", payload);
//     console.log("Token:", token);

//     const response = await axios.post(url, payload, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       }
//     });

//     if (response && response.data) {
//       sendSuccessNotification(response.data.message);
//     } else {
//       sendErrorNotification('Failed');
//     }

//   } catch (error) {
//     sendErrorNotification(error);
//     console.error("There was a problem with the fetch operation:", error);
//   }

//   dispatch("close");
// };
</script>

<div class="relative mt-2 ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl flex flex-col gap-3">
  <div class="flex flex-row justify-between">
    <div>Why did you choose this rating? (optional)</div>
    <div>
      <a class="hover:cursor-pointer" on:click={() => dispatch('close')}>X</a>
    </div>
  </div>
  <div class="flex flex-row gap-2">
    <!-- {#each feedbackReasons as reason}
      <Button
        color="light"
        class="px-3 py-0 {reason === catalog ? 'border-2 border-green-500' : ''}"
        on:click={() => handleCatalog(reason)}>{reason}</Button>
    {/each} -->

    {#each reasons as item}
      <Button
        color="light"
        class="px-3 py-0 {item.name === catalog?.name
          ? 'border-2 border-green-500'
          : ''}"
        on:click={() => handleCatalog(item)}>{item.name}</Button
      >
    {/each}
  </div>
  <div>
    <Input
      type="text"
      id="feedback"
      bind:value={reason}
      placeholder="Provide additional feedback"
      size="md"
      class=""
    />
  </div>
  <div>
    <Button on:click={handleLikeSubmit} color="light" size="xs" disabled={catalog === undefined}>Submit</Button>
  </div>
</div>
