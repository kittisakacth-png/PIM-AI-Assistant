const axios = require("axios");

async function askAI(
  question,
  context = ""
) {

  let prompt;

  if (context) {

    prompt = `
ข้อมูลจากเอกสาร:

${context}

คำถาม:
${question}

ตอบคำถามโดยอ้างอิงข้อมูลจากเอกสารด้านบน

หากพบข้อมูลที่เกี่ยวข้อง
ให้สรุปคำตอบสั้น ๆ และเข้าใจง่าย
`;

  } else {

    prompt = `
คำถาม:
${question}

ตอบตามความรู้ทั่วไป
โดยใช้ภาษาไทยสุภาพ กระชับ และเข้าใจง่าย
`;

  }

  try {

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

console.log("AI RAW RESPONSE:");
console.log(reply);


   let answer = reply;

// ลบ reasoning ทั้งหมด
answer = answer.replace(
  /<think>[\s\S]*?<\/think>/gi,
  ""
);

return answer.trim();

  } catch (error) {

    console.log(
      "THAILLM ERROR:"
    );

    console.log(
      error.response?.data ||
      error.message
    );

    return "ขออภัย ระบบ AI ไม่สามารถตอบได้ชั่วคราว";

  }

}

module.exports = {
  askAI
};