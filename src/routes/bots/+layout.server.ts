import { redirect } from "@sveltejs/kit";
import { getApiData } from "$lib/services/getData";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, fetch, url }) => {
  if (!locals.user || !locals.user.token) throw redirect(302, "/login");

  const headers = !locals.user?.apikey
    ? { authorization: `Bearer ${locals.user?.token}` }
    : { 'x-api-key': locals.user?.token }

  const bots = await getApiData(
    `${import.meta.env.VITE_API_AI_URL}/api/v1/bots`,
    'GET',
    {},
    {},
    { headers },
    fetch,
    false
  );



  return {
    user: locals.user,
  
  };
};