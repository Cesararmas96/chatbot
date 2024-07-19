import { redirect } from "@sveltejs/kit";
import { getApiData } from "$lib/services/getData";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, fetch, url }) => {
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
	
	const askBrettBot = bots.filter(bot => bot.name === 'AskBrett');

	console.log(askBrettBot);

	
// console.log(bots)
  return {
    user: locals.user,
    bots : askBrettBot
  };
};

