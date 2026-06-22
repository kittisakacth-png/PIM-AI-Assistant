const db = require("../config/firebase");

async function saveDocument(
fileName,
content
) {

await db
.collection("documents")
.add({
fileName,
content,
createdAt:
new Date()
});

}

module.exports = {
saveDocument
};
