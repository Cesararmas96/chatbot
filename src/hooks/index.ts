// // src/hooks/index.ts
// import { redirectTo } from '@sveltejs/kit';

// export const handle = async ({ request, resolve }) => {
//   const response = await resolve(request);

//   // Si la ruta es "/", redireccionar al usuario a "/login"
//   if (response.status === 404 && request.path === '/') {
//     return redirectTo('/login');
//   }

//   return response;
// };
