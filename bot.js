// Replace this with your actual OpenAI key
const OPENAI_API_KEY = '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 ';

const fetch = require('node-fetch');

async function chatWithGPT(userPrompt) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${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 }`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a helpful recipe assistant. You give healthy food suggestions.
            If the user mentions they are diabetic, you offer ingredient substitutions like:
            - Sugar → Stevia or Erythritol
            - White rice → Brown rice
            - Refined flour → Almond flour
            Also check meals using TheMealDB API`
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

// Example usage
chatWithGPT("I am diabetic. Suggest me an alternative for sugar in desserts.").then(console.log);
