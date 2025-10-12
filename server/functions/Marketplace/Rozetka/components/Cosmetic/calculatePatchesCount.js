const TelegramMsg = require("../../../../TelegramMsg");

async function calculatePatchesCount(count,id) {
    if (count === 70) {
        return "3281539"
    } else if (count === 60) {
        return "734125"
    }  else if (count === 51) {
        return "3313633"
    } else if (count === 44) {
        return "3281485"
    } else if (count === 30) {
        return "2490416"
    } else if (count === 35) {
        return "2169105"
    } else if (count === 36) {
        return "3273679"
    } else if (count === 24) {
        return "1613982"
    } else if (count === 25) {
        return "3146550"
    } else if (count === 15) {
        return "971652"
    } else if (count === 12) {
        return "475534"
    }else if (count === 2) {
        return "476428"
    }else if (count === 3) {
        return "475527"
    }else if (count === 4) {
        return "478031"
    }else if (count === 5) {
        return "577119"
    }else if (count === 6) {
        return "475541"
    } else {
        TelegramMsg("TECH", `Не вказана кіл-сть Розетка. ${id} - ${count}`)
        return ""
    }
}

module.exports = calculatePatchesCount;
