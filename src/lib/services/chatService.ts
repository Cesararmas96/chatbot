import { getApiData } from "$lib/services/getData.js";

// export const fetchChatData = async (bot: string, llm: string, query: string) => {
  export const fetchChatData = async (chatbotname: string, bot: string, query: string) => {
  // const apiUrl = `${import.meta.env.VITE_API_AI_URL}/${ApiChatBot[bot]}?use_llm=${llm}`;
  const apiUrl = `${import.meta.env.VITE_API_AI_URL}/api/v1/chat/${chatbotname}`;
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
