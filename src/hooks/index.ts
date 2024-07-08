import { decrypt, encrypt } from "$lib/helpers/auth";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  let token: string = event.url.searchParams.get("token") || "";
  let apikey: undefined | string = event.url.searchParams.get("apikey") || "";

  if (!token && !apikey) {
    try {
      if (
        !event.cookies.get("_session1") ||
        !event.cookies.get("_session2") ||
        !event.cookies.get("_session3")
      ) {
        return await resolve(event);
      }
      const decoded1 = decrypt(event.cookies.get("_session1"));
      const decoded2 = decrypt(event.cookies.get("_session2"));
      const decoded3 = decrypt(event.cookies.get("_session3"));
      if (!decoded1 || !decoded2 || !decoded3) return await resolve(event);
      token = decoded1 + decoded2 + decoded3;
    } catch (error) {
      return await resolve(event);
    }
  }

  try {
    let session;
    if (token) {
      const rawSession = await fetch(
        `${import.meta.env.VITE_API_AI_URL}/api/v1/user/session`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (rawSession.status !== 401) session = await rawSession.json();
      apikey = undefined;
    }

    if (!session && apikey) {
      const rawSession = await fetch(
        `${import.meta.env.VITE_API_AI_URL}/api/v1/login?apikey=${apikey}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-auth-method": "APIKeyAuth",
          },
        }
      );
      session = await rawSession.json();

      token = apikey;
    }

    if (session) {
      event.locals.user = { ...session.session };
      event.locals.user.aux = { ...session };
      delete event.locals.user.aux.session;
      event.locals.user.token = apikey ? apikey : token;
      event.locals.user.apikey = apikey ? true : false;
    }
  } catch (error) {
    console.log("hooks", error);
    return await resolve(event);
  }
  return await resolve(event);
};
