const axios = require("axios");

async function askAI(
  question,
  context = ""
) {

  const prompt = `
ข้อมูลจากเอกสาร:

${context}

คำถาม:
${question}

ตอบจากข้อมูลในเอกสารเท่านั้น
หากไม่พบข้อมูลในเอกสารให้ตอบว่า
"ไม่พบข้อมูลในเอกสาร"
`;

  const response =
    await axios.post(
      "http://thaillm.or.th/api/v1/chat/completions",
      {
        model:
          "pathumma-thaillm-qwen3-8b-think-3.0.0",

        messages: [
          {
            role: "system",
            content: `
คุณคือ PIM AI Assistant

ตอบเป็นภาษาไทย

ห้ามแสดงขั้นตอนการคิด
ห้ามแสดง reasoning
ห้ามแสดง chain of thought
ห้ามแสดง <think>

ตอบเฉพาะคำตอบสุดท้ายเท่านั้น
`
          },
          {
            role: "user",
            content: prompt
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

  const reply =
    response.data
      .choices[0]
      .message.content;

  return reply
    .replace(
      /<think>[\s\S]*?<\/think>/gi,
      ""
    )
    .trim();
}

module.exports = {
  askAI
};