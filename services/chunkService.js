function cleanText(text) {

    return text
        .replace(/\r/g, "")
        .replace(/\t/g, " ")
        .replace(/[ ]{2,}/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

}

function splitIntoChunks(text) {

    text = cleanText(text);

    const paragraphs = text
        .split(/\n\s*\n/)
        .map(p => p.trim())
        .filter(p => p.length > 50);

    const chunks = [];

    let currentChunk = "";

    paragraphs.forEach(paragraph => {

        if ((currentChunk + paragraph).length < 800) {

            currentChunk += "\n\n" + paragraph;

        } else {

            chunks.push(currentChunk.trim());

            currentChunk = paragraph;

        }

    });

    if (currentChunk.length > 0) {

        chunks.push(currentChunk.trim());

    }

    return chunks;

}

module.exports = {
    splitIntoChunks
};