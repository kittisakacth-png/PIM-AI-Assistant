require("dotenv").config();
const {
  pdfToText
} = require(
  "./services/pdfService"
);
const {
    splitIntoChunks
} = require("./services/chunkService");
const { searchDocuments }
  = require("./services/searchService");
const {
  saveDocument
} = require(
  "./services/firestoreService"
);
const documentRoutes =
  require("./routes/documentRoutes");
const express = require("express");
const axios = require("axios");
const multer = require("multer");
const cors = require("cors");

const { askAI } = require("./ai");

const app = express();

app.use(cors());
app.use(express.json());

console.log(
process.env.LINE_CHANNEL_ACCESS_TOKEN
? "TOKEN FOUND"
: "TOKEN NOT FOUND"
);

const upload = multer({
dest: "uploads/"
});

app.get("/", (req, res) => {
res.send("PIM AI Assistant Running");
});

app.post("/webhook", async (req, res) => {

console.log("WEBHOOK HIT");

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

  const context =
  await searchDocuments(
    userMessage
  );
  console.log("========== CONTEXT ==========");
console.log(context);
console.log("========== END ==========");

let aiReply;

if (context) {

  aiReply =
    await askAI(
      userMessage,
      context
    );

} else {

  aiReply =
    await askAI(
      userMessage
    );

}

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
app.post(
"/upload-pdf",
upload.single("pdf"),
async (req, res) => {

console.log("UPLOAD API HIT");

try {

  console.log(
    "Uploaded:",
    req.file.originalname
  );

  const fileName =
Buffer.from(
    req.file.originalname,
    "latin1"
).toString("utf8");

console.log(
    "Uploaded:",
    fileName
);
const text = await pdfToText(
    req.file.path
);

const chunks = splitIntoChunks(text);

console.log(
    "Chunks:",
    chunks.length
);
await saveDocument(
    fileName,
    text
);

console.log(
  "Saved To Firestore"
);


  console.log(
    "PDF Loaded"
  );

  console.log(
    "Text Length:",
    text.length
  );

  res.json({

    success: true,

    file: fileName,

    length: text.length,

    chunks: chunks.length

});

} catch (error) {

  console.log(
    "PDF ERROR"
  );

  console.error(error);

  res.status(500).json({
    error:
      error.message
  });

}

}
);


const PORT =
process.env.PORT || 3000;


app.use(
  "/documents",
  documentRoutes
);

app.listen(PORT, () => {
console.log(
`Server running on port ${PORT}`
);
});
