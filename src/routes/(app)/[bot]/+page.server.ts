import { redirect } from "@sveltejs/kit";
import { getApiData } from "$lib/services/getData";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, fetch }) => {
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

  
  const promptLibrary = await getApiData(
    `${import.meta.env.VITE_API_AI_URL}/api/v1/prompt_library`,
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
