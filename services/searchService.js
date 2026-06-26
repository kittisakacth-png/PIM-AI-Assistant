const db = require("../config/firebase");

async function searchDocuments(question) {

    const snapshot =
        await db.collection("documents").get();

    let bestContext = "";
    let bestScore = 0;

    const keywords = question
        .toLowerCase()
        .replace(/[^\u0E00-\u0E7Fa-zA-Z0-9 ]/g, "")
        .split(/\s+/)
        .filter(Boolean);

    snapshot.forEach(doc => {

        const data = doc.data();

        if (!data.content) return;

        const content =
            data.content.toLowerCase();

        let score = 0;

        keywords.forEach(word => {

            if (content.includes(word)) {

                score++;

            }

        });

        if (score > bestScore) {

            bestScore = score;

            const index =
                content.indexOf(keywords[0]);

            if (index >= 0) {

                const start =
                    Math.max(0, index - 500);

                const end =
                    Math.min(content.length, index + 1200);

                bestContext =
                    data.content.substring(start, end);

            } else {

                bestContext =
                    data.content.substring(0, 1500);

            }

        }

    });

    console.log(
        "Search Score:",
        bestScore
    );

    return bestContext;

}

module.exports = {
    searchDocuments
};