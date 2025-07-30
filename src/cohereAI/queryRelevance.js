import config from "../config/config.js";

export default async function queryRelevance(userQuery, roleKeywords) {
  if (!userQuery || !Array.isArray(roleKeywords)) {
    throw new Error(
      "Invalid arguments: userQuery must be a string and roleKeywords must be an array",
    );
  }

  const systemPrompt = `You are a relevance filter. Reply only true or false. Core topics: ${roleKeywords.join(", ")}. Return true if the input shows interest,or has any relation to these topics, their ecosystem (tools, libraries, workflows), or the broader field. If unsure, default to true. Example: react, tailwind — "chai aur javascript" = true. Don't reject based on names.Reply only true or false in lowercase with no punctuations whatsover`;

  try {
    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.aiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command-r-plus",
        temperature: 0,
        message: userQuery,
        preamble: systemPrompt,
        chat_history: [],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cohere API error ${response.status}: ${errorText}`);
    }

    const { text } = await response.json();
    if (typeof text !== "string") {
      throw new Error("Invalid Cohere response: missing 'text'");
    }

    const normalized = text.trim().toLowerCase().replace(/^"|"$/g, "");
    if (normalized === "true") return true;
    if (normalized === "false") return false;

    throw new Error(`Unexpected response from Cohere: "${text}"`);
  } catch (error) {
    console.error("FUNCTION FAILED :", error);
    throw error;
  }
}
