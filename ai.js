const axios = require("axios");

async function askAI(message) {

  const response =
    await axios.post(
      "http://thaillm.or.th/api/v1/chat/completions",
      {
        model:
          "pathumma-thaillm-qwen3-8b-think-3.0.0",
        messages: [
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 512,
        temperature: 0.3
      },
      {
        headers: {
          Authorization:
            `Bearer ${process.env.THAILLM_API_KEY}`,
          "Content-Type":
            "application/json"
        }
      }
    );

  return response.data
    .choices[0]
    .message.content;
}

module.exports = {
  askAI
};