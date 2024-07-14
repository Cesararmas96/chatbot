import { getApiData } from "$lib/services/getData";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, fetch }) => {
 
  const { id } = params;
  const share = await getApiData(
    `${import.meta.env.VITE_API_AI_URL}/api/v1/chatbots/questions/${id}`,
    'GET',
    {},
    {},
    {  },
    fetch,
    false
  );


  return {
    share
  };
};
