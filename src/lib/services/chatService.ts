import { getApiData } from "$lib/services/getData.js";
import { ApiChatBot } from "$lib/helpers/commons";

// // export const fetchChatData = async (bot: string, llm: string, query: string) => {
//   export const fetchChatData = async (bot: string, query: string) => {
//   // const apiUrl = `${import.meta.env.VITE_API_AI_URL}/${ApiChatBot[bot]}?use_llm=${llm}`;
//   const apiUrl = `${import.meta.env.VITE_API_AI_URL}/api/v1/chat/${ApiChatBot[bot]}`;
//   try {
//     return await getApiData(
//       apiUrl,
//       "POST",
//       { query },
//       {},
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       },
//       null,
//       true
//     );
//   } catch (error) {
//     throw new Error("Fetch operation failed: " + error.message);
//   }
// };


export const fetchChatData = async (bot: string, query: string, llm: string | null = null) => {
  const baseUrl = `${import.meta.env.VITE_API_AI_URL}/api/v1/chat/${ApiChatBot[bot]}`;
  const apiUrl = llm ? `${baseUrl}?use_llm=${llm}` : baseUrl;

  try {
    return await getApiData(
      apiUrl,
      "POST",
      { query },
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
      null,
      true
    );
  } catch (error) {
    throw new Error("Fetch operation failed: " + error.message);
  }
};
