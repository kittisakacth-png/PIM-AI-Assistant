require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("PIM AI Assistant Running");
});

app.post("/webhook", async (req, res) => {

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

      await axios.post(
        "https://api.line.me/v2/bot/message/reply",
        {
          replyToken:
            event.replyToken,
          messages: [
            {
              type: "text",
              text:
                `คุณพิมพ์ว่า: ${userMessage}`
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
    }
  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log(
    "Server running on port 3000"
  );
});