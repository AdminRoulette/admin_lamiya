const TelegramMsg = require("../../../../TelegramMsg");

async function calculateParfumeYear(year) {
    if (year === 1) {
        return ""
    }else if (year === 2) {
        return ""
    }else {
        TelegramMsg("TECH", `Не відоме значення year у парфума Розетка. ${year}`)
        return ""
    }
}

module.exports = calculateParfumeYear;
