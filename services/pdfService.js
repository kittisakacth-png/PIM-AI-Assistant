const fs = require("fs");
const pdf = require("pdf-parse");

async function pdfToText(filePath) {

const buffer =
fs.readFileSync(filePath);

const data =
await pdf(buffer);

return data.text;
}

module.exports = {
pdfToText
};
