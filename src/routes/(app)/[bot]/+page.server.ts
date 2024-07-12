import { redirect } from "@sveltejs/kit";
import { getApiData, postData } from "$lib/services/getData";
import type { Action, Actions, PageServerLoad } from "./$types";
import { sendErrorNotification, sendSuccessNotification } from "$lib/helpers/toast";


export const load: PageServerLoad = async ({ locals, fetch, params }) => {
  if (!locals.user || !locals.user.token) throw redirect(302, "/auth");

  const headers = !locals.user?.apikey
  ? { authorization: `Bearer ${locals.user?.token}` }
  : { 'x-api-key': locals.user?.token }

const bots = await getApiData(
	`${import.meta.env.VITE_API_AI_URL}/api/v1/bots`,
  'GET',
  {},
  {},
  {headers},
  fetch,
  false
  )

  const chat = bots.find((bot: any) => bot.name.toLowerCase() === params.bot);
  const promptLibrary = await getApiData(
    `${import.meta.env.VITE_API_AI_URL}/api/v1/prompt_library?chatbot_id=${chat.chatbot_id}`,
    'GET',
    {},
    {},
    {headers},
    fetch,
    false
  )

  const good = await getApiData(
    `${import.meta.env.VITE_API_AI_URL}/api/v1/feedback_types/Good`,
    'GET',
    {},
    {},
    {headers},
    fetch,
    false
  )

  const bad = await getApiData(
    `${import.meta.env.VITE_API_AI_URL}/api/v1/feedback_types/Bad`,
    'GET',
    {},
    {},
    {headers},
    fetch,
    false
  )
  

  return {
    user: locals.user,
    bots,
    promptLibrary,
    good,
    bad
  };
};

const feedback: Action = async ({ cookies, request }) => {
  console.log("Feedback Action: Received feedback request");

  const payload = {
    chatbot_id: 'a6fcfaef-fe01-4040-94f3-bb418054ab5b',
    sid: '24292fac-b46d-447e-a4f7-f88d68e9c998',
    feedback_type: 'Correct',
    feedback: 'Good Enough',
    _like: true,
    rating: '5'
  }

  try {
    const url = 'https://ai-dev.trocdigital.net/api/v1/bot_feedback'

    const setFeedback = await postData(url, payload)
  console.log(setFeedback)
    if (setFeedback && setFeedback.message) {
      sendSuccessNotification(setFeedback.message)
    } else {
      sendErrorNotification('Failed')
    }
  } catch (error) {
    sendErrorNotification('An unexpected error occurred')
    console.error('There was a problem with the fetch operation:', error)
  }
}

export const actions: Actions = { feedback };
