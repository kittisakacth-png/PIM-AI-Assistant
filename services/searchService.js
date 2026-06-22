const db = require("../config/firebase");

async function searchDocuments(question) {

  const snapshot =
    await db
      .collection("documents")
      .get();

  let context = "";

  snapshot.forEach((doc) => {

    const data = doc.data();

    if (!data.content) {
      console.log(
        "Missing content:",
        doc.id
      );
      return;
    }

    context +=
      `\n[${data.fileName || "Unknown"}]\n`;

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