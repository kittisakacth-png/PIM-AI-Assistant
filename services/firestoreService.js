const db = require("../config/firebase");
const { extractKeywords } = require("./keywordService");
async function saveDocument(fileName, chunks) {

    const documentRef = await db
        .collection("documents")
        .add({

            fileName,

            totalChunks: chunks.length,

            createdAt: new Date()

        });

    const batch = db.batch();

    chunks.forEach((chunk, index) => {

        const ref = db
            .collection("chunks")
            .doc();
        
            batch.set(ref, {

    documentId: documentRef.id,

    fileName,

    chunkIndex: index,

    content: chunk,

    keywords: extractKeywords(chunk),

    createdAt: new Date()

});

        

    });

    await batch.commit();

}

module.exports = {
    saveDocument
};