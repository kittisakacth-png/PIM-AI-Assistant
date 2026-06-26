const fs = require("fs");
const pdf = require("pdf-parse");

async function pdfToText(filePath) {

    const buffer = fs.readFileSync(filePath);

    const data = await pdf(buffer);

    let text = data.text || "";

    // ลบ \r
    text = text.replace(/\r/g, "");

    // ลบบรรทัดว่างหลายบรรทัด
    text = text.replace(/\n{3,}/g, "\n\n");

    // ลบช่องว่างเกิน
    text = text.replace(/[ \t]{2,}/g, " ");

    text = text.trim();

    if (!text) {

        throw new Error(
            "ไม่สามารถอ่านข้อความจาก PDF ได้"
        );

    }

    return text;

}

module.exports = {
    pdfToText
};