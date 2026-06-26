function extractKeywords(text) {

    if (!text) {
        return [];
    }

    const words = text
        .replace(/[^\u0E00-\u0E7Fa-zA-Z0-9 ]/g, " ")
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length >= 2);

    return [...new Set(words)];

}

module.exports = {
    extractKeywords
};