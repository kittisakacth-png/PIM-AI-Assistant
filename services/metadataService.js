const axios = require("axios");

async function analyzeChunk(chunk) {

    const prompt = `
วิเคราะห์ข้อความนี้และตอบกลับเป็น JSON เท่านั้น

{
  "faculty":"",
  "major":"",
  "topic":"",
  "keywords":[]
}

ข้อความ

${chunk}
`;

    try {

        const response = await axios.post(
            "http://thaillm.or.th/api/v1/chat/completions",
            {
                model: "pathumma-thaillm-qwen3-8b-think-3.0.0",
                messages: [
                    {
                        role: "system",
                        content: "ตอบเป็น JSON เท่านั้น ห้ามมีคำอธิบาย"
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0,
                max_tokens: 200
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.THAILLM_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        let text = response.data.choices[0].message.content;

        text = text.replace(/```json/g,"")
                   .replace(/```/g,"")
                   .trim();

        return JSON.parse(text);

    } catch (err) {

        console.log(err.message);

        return {

            faculty:"",
            major:"",
            topic:"",
            keywords:[]

        };

    }

}

module.exports = {
    analyzeChunk
};