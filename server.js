require("dotenv").config();
const { askAI } =
  require("./ai");

console.log(
  process.env.LINE_CHANNEL_ACCESS_TOKEN
    ? "TOKEN FOUND"
    : "TOKEN NOT FOUND"
);

const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("PIM AI Assistant Running");
});

app.post("/webhook", async (req, res) => {

  console.log("WEBHOOK HIT");
  console.log(
    JSON.stringify(req.body, null, 2)
  );

  const events = req.body.events;

  if (!events) {
    return res.sendStatus(200);
  }

  for (const event of events) {

    if (
      event.type === "message" &&
      event.message.type === "text"
    ) {

      const userMessage =
        event.message.text;
const aiReply =
  await askAI(
    userMessage
  );
      try {

        await axios.post(
          "https://api.line.me/v2/bot/message/reply",
          {
            replyToken:
              event.replyToken,
            messages: [
              {
                type: "text",
                text: aiReply
              }
            ]
          },
          {
            headers: {
              Authorization:
                `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
              "Content-Type":
                "application/json"
            }
          }
        );

        console.log(
          "Reply Success"
        );

      } catch (error) {

        console.log(
          "Reply Error"
        );

        console.log(
          error.response?.data ||
          error.message
        );

      }
    }
  }

  res.sendStatus(200);

});

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});