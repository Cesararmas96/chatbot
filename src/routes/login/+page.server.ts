// /* eslint-disable @typescript-eslint/no-explicit-any */
import { fail, redirect } from "@sveltejs/kit";
import type { Action, Actions, PageServerLoad } from "./$types";
import { encrypt } from "$lib/helpers/auth";

export const load: PageServerLoad = async ({ locals, url, fetch }) => {
  if (locals.user) throw redirect(302, "/");

	const apiUrl = import.meta.env.VITE_API_AI_URL
  const tenant = url.hostname.split('.')[0]
  console.log(tenant)

  const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/clients?subdomain_prefix=${tenant}`, { method: "GET" });
  console.log(resp)
  if (resp?.ok) {
    const response = await resp.json()

    const data = response[0]
    locals.client = data

    // const images = buildImageUrls(data, rootLink)
    const { auth_backends } = data

    let filteredObject: Record<string, any> = {}

    const totalAuthMethods = await fetch(`${apiUrl}/api/v1/auth/methods`, {method: "GET"}).then(res => res.json())
    filteredObject = filterAuthMethods(totalAuthMethods, auth_backends)
    delete filteredObject.BasicAuth

    return {
      filteredObject,
      authMethods: totalAuthMethods
    }
  }
};

 const filterAuthMethods = (totalAuthMethods: any, authMethods: any) => {
	return Object.fromEntries(
		Object.entries(totalAuthMethods).filter(([key]) => authMethods.includes(key))
	)
}

const login: Action = async ({ cookies, request }) => {
  console.log("Login Action: Received login request");

  const data = await request.formData();
  const username = data.get("username");
  const password = data.get("password");

  console.log("Login Action: Form Data", { username, password });

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username ||
    !password
  ) {
    console.log("Login Action: Invalid form data");
    return fail(400, { invalid: true });
  }

  console.log("Login Action: Making API request with", { username, password });

  const apiUrl = `${import.meta.env.VITE_API_AI_URL}/api/v1/login`;
  console.log("Login Action: API URL", apiUrl);

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "x-auth-method": "BasicAuth",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
console.log("Login Action: API Response", response);
  console.log("Login Action: API Response Status", response.status);

  if (response.ok) {
    const data = await response.json();
    console.log("Login Action: API Response Data", data);

    const length = Math.ceil(data.token.length / 3);
    const token1 = encrypt(data.token.substring(0, length));
    const token2 = encrypt(data.token.substring(length, 2 * length));
    const token3 = encrypt(data.token.substring(2 * length));

    console.log("Login Action: Encrypted Tokens", { token1, token2, token3 });

    cookies.set("_session1", token1, {
      path: "/",
      httpOnly: true,
      sameSite: "none",
      secure: true, //import.meta.env.ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    });
    cookies.set("_session2", token2, {
      path: "/",
      httpOnly: true,
      sameSite: "none",
      secure: true, //import.meta.env.ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    });
    cookies.set("_session3", token3, {
      path: "/",
      httpOnly: true,
      sameSite: "none",
      secure: true, //import.meta.env.ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    });
    cookies.delete("_program", { path: "/" });
  } else {
    const errorData = await response.json();
    console.error("Login Action: API Error", errorData);
    return fail(400, { credentials: true, message: errorData });
  }

  // redirect the user
  console.log("Login Action: Redirecting to /bots");
  throw redirect(302, "/bots");
};

export const actions: Actions = { login };
