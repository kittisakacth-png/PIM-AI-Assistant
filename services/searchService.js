const db = require("../config/firebase");

async function searchDocuments(question) {

const snapshot =
await db
.collection("documents")
.get();

let context = "";

snapshot.forEach((doc) => {

const data =
  doc.data();

context +=
  `\n[${data.fileName}]\n`;

context +=
  data.content.substring(
    0,
    3000
  );

context += "\n";

});

return context;
}

module.exports = {
searchDocuments
};
