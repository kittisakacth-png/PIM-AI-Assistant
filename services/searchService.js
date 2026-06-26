const db = require("../config/firebase");

// คำพ้องที่ใช้บ่อย
const aliases = {
    cj: [
        "cj",
        "convergent journalism",
        "convergent journalism and digital media",
        "วารสารศาสตร์คอนเวอร์เจนท์",
        "วารสารศาสตร์คอนเวอร์เจนท์และสื่อดิจิทัล"
    ],

    dccb: [
        "dccb",
        "digital communication",
        "digital communication for corporate and brand",
        "สื่อสารองค์กร",
        "การสื่อสารดิจิทัลเพื่อองค์กรและแบรนด์"
    ],

    internship: [
        "ฝึกงาน",
        "สถานที่ฝึกงาน",
        "ฝึกงานที่ไหน",
        "ฝึกงานที่ใด",
        "internship"
    ]
};

function normalizeQuestion(question) {

    let q = question.toLowerCase();

    Object.values(aliases).forEach(list => {

        const master = list[0];

        list.forEach(word => {

            q = q.replaceAll(
                word.toLowerCase(),
                master
            );

        });

    });

    return q;

}

async function searchDocuments(question) {

    const q = normalizeQuestion(question);

    const keywords = q
        .replace(/[^\u0E00-\u0E7Fa-zA-Z0-9 ]/g, " ")
        .split(/\s+/)
        .filter(x => x.length > 1);

    const snapshot = await db
        .collection("chunks")
        .get();

    const results = [];

    snapshot.forEach(doc => {

        const data = doc.data();

        let score = 0;

        let content =
            (data.content || "")
                .toLowerCase();

        content = normalizeQuestion(content);

        keywords.forEach(keyword => {

            if (content.includes(keyword)) {

                score += 10;

            }

        });

        // โบนัสถ้าเจอคำถามแบบฝึกงาน
        if (
            q.includes("internship") &&
            content.includes("internship")
        ) {

            score += 30;

        }

        // โบนัสถ้าเป็น CJ
        if (
            q.includes("cj") &&
            content.includes("cj")
        ) {

            score += 40;

        }

        if (score > 0) {

            results.push({

                score,

                content: data.content,

                fileName: data.fileName,

                chunkIndex: data.chunkIndex

            });

        }

    });

    results.sort((a,b)=>b.score-a.score);

    const top = results.slice(0,5);

    console.log("========== SEARCH ==========");

    top.forEach(item=>{

        console.log("----------------");

        console.log("Score:",item.score);

        console.log("Chunk:",item.chunkIndex);

        console.log(item.content.substring(0,250));

    });

    return top
        .map(x=>x.content)
        .join("\n\n====================\n\n");

}

module.exports = {
    searchDocuments
};