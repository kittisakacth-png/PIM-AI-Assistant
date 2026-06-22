const db = require("../config/firebase");

async function searchDocuments(question) {

  const snapshot =
    await db.collection("documents").get();

  let bestMatch = "";

  snapshot.forEach((doc) => {

    const data = doc.data();

    if (
      !data.content ||
      typeof data.content !== "string"
    ) {
      return;
    }

    const content =
      data.content.toLowerCase();

    const keywords =
      question
        .toLowerCase()
        .split(" ");

    const found =
      keywords.some(
        word =>
          content.includes(word)
      );

    if (found) {

      bestMatch =
        data.content.substring(
          0,
          1500
        );

    }

  });

  return bestMatch;
}

module.exports = {
  searchDocuments
};