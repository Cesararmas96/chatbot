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

      const length = Math.ceil(token.length / 3)
      const token1 = encrypt(token.substring(0, length))
      const token2 = encrypt(token.substring(length, 2 * length))
      const token3 = encrypt(token.substring(2 * length))

      event.cookies.set('_session1', token1, {
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: true, //import.meta.env.ENV === 'production',
        maxAge: 60 * 60 * 24 * 30
      })
      event.cookies.set('_session2', token2, {
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: true, //import.meta.env.ENV === 'production',
        maxAge: 60 * 60 * 24 * 30
      })
      event.cookies.set('_session3', token3, {
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: true, //import.meta.env.ENV === 'production',
        maxAge: 60 * 60 * 24 * 30
      })
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
    if (!session) {
			event.cookies.delete('_session1', { path: "/" })
			event.cookies.delete('_session2', { path: "/" })
			event.cookies.delete('_session3', { path: "/" })
			throw redirect(301, `/login`)
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
