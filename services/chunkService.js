function cleanText(text) {

    return text
        .replace(/\r/g, "")
        .replace(/\t/g, " ")
        .replace(/[ ]{2,}/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

}

function splitLongText(text, maxLength = 1200) {

    const chunks = [];

    let current = "";

    const paragraphs = text.split(/\n\s*\n/);

    paragraphs.forEach(p => {

        if ((current + "\n\n" + p).length <= maxLength) {

            current += "\n\n" + p;

        } else {

            if (current.trim()) {

                chunks.push(current.trim());

            }

            current = p;

        }

    });

    if (current.trim()) {

        chunks.push(current.trim());

    }

    return chunks;

}

function splitIntoChunks(text) {

    text = cleanText(text);

    // ตรวจว่ามี FAQ หรือไม่
    const qaBlocks = text.split(/(?=\bQ[:：])/i);

    if (qaBlocks.length > 1) {

        const chunks = [];

        qaBlocks.forEach(block => {

            const clean = block.trim();

            if (clean.length < 50) return;

            if (clean.length <= 1500) {

                chunks.push(clean);

            } else {

                chunks.push(...splitLongText(clean));

            }

        });

        console.log("FAQ Chunks:", chunks.length);

        return chunks;

    }

    // ถ้าไม่ใช่ FAQ ใช้วิธีเดิม
    return splitLongText(text);

}

module.exports = {
    splitIntoChunks
};