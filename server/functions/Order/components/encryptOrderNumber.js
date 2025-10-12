const TelegramMsg = require("../../TelegramMsg");

async function encryptOrderNumber(id) {
    try {
            const num = parseInt(id, 10);
            const xor = num ^ Number(process.env.SECRET_ORDER_ID);
            return xor.toString(36);

    } catch (error) {
        TelegramMsg("TECH", `encryptOrderNumber ${error.message}`)
    }
}

module.exports = encryptOrderNumber;
