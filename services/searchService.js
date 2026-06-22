const db = require("../config/firebase");

async function searchDocuments(question) {

  const snapshot =
    await db.collection("documents").get();

  let context = "";

  snapshot.forEach((doc) => {

    const data = doc.data();

    console.log(
      "DOC:",
      doc.id,
      Object.keys(data)
    );

    if (
      !data.content ||
      typeof data.content !== "string"
    ) {
      console.log(
        "SKIP DOC:",
        doc.id
      );
      return;
    }

    context +=
      `\n[${data.fileName || doc.id}]\n`;

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