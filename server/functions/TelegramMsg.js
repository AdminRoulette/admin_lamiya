const axios = require("axios");
const https = require("https");
const agent = new https.Agent({
    family: 4
});

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
        }, {
            httpsAgent: agent,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        console.error('Telegram error:', e?.response?.data || e.message);
    }
}

module.exports = TelegramMsg;
