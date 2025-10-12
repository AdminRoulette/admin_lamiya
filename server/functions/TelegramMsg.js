const axios = require("axios");

async function TelegramMsg(id, text) {
    try {
        const chat_id = process.env[`TELEGRAM_CHAT_ID_${id}`];
        if (!chat_id) {
            throw new Error(`Chat ID for ${id} not found`);
        }
        await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_API_TOKEN}/sendMessage`, {
            chat_id,
            text: text,
            parse_mode: 'HTML'
        });
    } catch (e) {
        console.error('Telegram error:', e?.response?.data || e.message);
    }
}

module.exports = TelegramMsg;
