const db = require("../config/firebase");

function calculateScore(question, paragraph) {

    let score = 0;

    const keywords = question
        .toLowerCase()
        .replace(/[^\u0E00-\u0E7Fa-zA-Z0-9 ]/g, "")
        .split(/\s+/)
        .filter(word => word.length > 1);

    const text = paragraph.toLowerCase();

    keywords.forEach(keyword => {

        const matches =
            text.match(
                new RegExp(keyword, "g")
            );

        if (matches) {

            score += matches.length;

        }

    });

    return score;

}

async function searchDocuments(question) {

    const snapshot =
        await db.collection("documents").get();

    const paragraphs = [];

    snapshot.forEach(doc => {

        const data = doc.data();

        if (!data.content) return;

        const split = data.content
            .split(/\n\s*\n/)
            .map(p => p.trim())
            .filter(p => p.length > 30);

        split.forEach(paragraph => {

            paragraphs.push({
                text: paragraph,
                score: calculateScore(
                    question,
                    paragraph
                )
            });

        });

    });

    paragraphs.sort(
        (a, b) =>
            b.score - a.score
    );

    const top =
        paragraphs
            .slice(0, 5);

    console.log("========== SEARCH ==========");

    top.forEach(item => {

        console.log(
            "Score:",
            item.score
        );

        console.log(
            item.text.substring(0,200)
        );

        console.log("----------------");

    });

    return top
        .map(x => x.text)
        .join("\n\n----------------\n\n");

}

module.exports = {
    searchDocuments
};