import { redirect } from "@sveltejs/kit";
import { getApiData } from "$lib/services/getData";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, fetch, url }) => {
  if (!locals.user || !locals.user.token) throw redirect(302, "/login");

  const headers = !locals.user?.apikey
		? { authorization: `Bearer ${locals.user?.token}` }
		: { 'x-api-key': locals.user?.token }

	

  return {
    user: locals.user
  };
};
