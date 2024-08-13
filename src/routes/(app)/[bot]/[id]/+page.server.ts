import { redirect } from "@sveltejs/kit";
import { getApiData, postData } from "$lib/services/getData";
import type { Action, Actions, PageServerLoad } from "./$types";
import { sendErrorNotification, sendSuccessNotification } from "$lib/helpers/toast";
import { message } from "$lib/stores/loading";

export const load: PageServerLoad = async ({ locals, fetch, params }) => {
  if (!locals.user || !locals.user.token) throw redirect(302, "/login");

  const headers = !locals.user?.apikey
    ? { authorization: `Bearer ${locals.user?.token}` }
    : { 'x-api-key': locals.user?.token };

  const bots = await getApiData(
    `${import.meta.env.VITE_API_AI_URL}/api/v1/bots`,
    'GET',
    {},
    {},
    { headers },
    fetch,
    false
  );

  const chat = bots.find((bot: any) => bot.name.toLowerCase() === params.bot);
  let chatbotid = chat.chatbot_id;


  
  const promptLibrary = await getApiData(
    `${import.meta.env.VITE_API_AI_URL}/api/v1/prompt_library?chatbot_id=${chat.chatbot_id}`,
    'GET',
    {},
    {},
    { headers },
    fetch,
    false
  );

  const good = await getApiData(
    `${import.meta.env.VITE_API_AI_URL}/api/v1/feedback_types/Good`,
    'GET',
    {},
    {},
    { headers },
    fetch,
    false
  );


  const bad = await getApiData(
    `${import.meta.env.VITE_API_AI_URL}/api/v1/feedback_types/Bad`,
    'GET',
    {},
    {},
    { headers },
    fetch,
    false
  );

  const askBrettBot = bots.filter(bot => bot.name === 'AskBrett');
	const attBot = bots.filter(bot => bot.name === 'ATTBot');

	const combinedBots = [...askBrettBot, ...attBot]

  // Save chatbotid to locals for later use in actions
  return {
    user: locals.user,
    bots,
    promptLibrary,
    good,
    bad,
    chatbotid
  };
};

const feedback: Action = async ({ request, locals }) => {
  console.log("Feedback Action: Received feedback request");

  const user_id = locals.user.user_id;
  const formData = await request.formData();
  const chatbotid = formData.get('chatbotId');
  const sid = formData.get('sid');
  const feedbackText = formData.get('feedback');
  const feedback_type = formData.get('feedback_type');
  const like = formData.get('like');
  const rating = formData.get('rating');

  const payload = {
    chatbot_id: chatbotid,
    sid: sid,
    feedback_type:  feedback_type,
    feedback: feedbackText,
    _like: like,
    rating: rating,
    user_id: user_id
  };

  console.log(payload);
  try {
    const url = `${import.meta.env.VITE_API_AI_URL}/api/v1/bot_feedback`;
    const setFeedback = await postData(url, payload);
    console.log("Response from API:", setFeedback);

    if (setFeedback && setFeedback.message) {
      console.log('bien')
      return {
        status: 200,
        body: {
          message: setFeedback.message
          
        }
      };
    } else {
      return {
        status: 500,
        body: {
          error: 'Failed'
        }
      };
    }


  } catch (error) {
    return {
      status: 500,
      body: {
        error: 'An unexpected error occurred'
      }
    };
  }
};


const feedbackDislike: Action = async ({ request, locals }) => {
  console.log("Feedback Action: Received feedback request");

  const user_id = locals.user.user_id;
  const formData = await request.formData();
  const chatbotid = formData.get('chatbotId');
  const sid = formData.get('sid');
  const feedbackText = formData.get('feedback');
  const feedback_type = formData.get('feedback_type');
  const dislike = formData.get('dislike');
  const rating = formData.get('rating');

  const payload = {
    chatbot_id: chatbotid,
    sid: sid,
    feedback_type:  feedback_type,
    feedback: feedbackText,
    _dislike: dislike,
    rating: rating,
    user_id: user_id
  };

  console.log(payload);
  try {
    const url = `${import.meta.env.VITE_API_AI_URL}/api/v1/bot_feedback`;
    const setFeedback = await postData(url, payload);
    console.log("Response from API:", setFeedback);

    if (setFeedback && setFeedback.message) {
      console.log('bien')
      return {
        status: 200,
        body: {
          message: setFeedback.message
          
        }
      };
    } else {
      return {
        status: 500,
        body: {
          error: 'Failed'
        }
      };
    }


  } catch (error) {
    return {
      status: 500,
      body: {
        error: 'An unexpected error occurred'
      }
    };
  }
};
export const actions: Actions = { feedbackDislike,  feedback};
