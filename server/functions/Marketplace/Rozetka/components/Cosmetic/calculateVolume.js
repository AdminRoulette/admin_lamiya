const TelegramMsg = require("../../../../TelegramMsg");

async function calculateVolume(volume,id) {
    if (volume === 1) {
        return "2189640"
    }else if (volume === 2) {
        return "2189706"
    }else if (volume === 2.5) {
        return "2189712"
    }else if (volume === 3) {
        return "2189718"
    }else if (volume === 4) {
        return "2189724"
    }else if (volume === 4.5) {
        return "2189730"
    }else if (volume === 5) {
        return "2189016"
    }else if (volume === 6) {
        return "2189736"
    }else if (volume === 7) {
        return "2189742"
    }else if (volume === 7.5) {
        return "2189748"
    }else if (volume === 8) {
        return "2189754"
    }else if (volume === 10) {
        return "2189022"
    }else if (volume === 12) {
        return "2189682"
    }else if (volume === 12.5) {
        return "2189688"
    }else if (volume === 13) {
        return "2189694"
    }else if (volume === 15) {
        return "2189034"
    }else if (volume === 18) {
        return "2189772"
    }else if (volume === 19) {
        return "2212194"
    }else if (volume === 20) {
        return "2189040"
    }else if (volume === 21) {
        return "2212200"
    }else if (volume === 22) {
        return "2212206"
    }else if (volume === 23) {
        return "2212212"
    }else if (volume === 24) {
        return "2212218"
    }else if (volume === 25) {
        return "2189052"
    }else if (volume === 27) {
        return "2212230"
    }else if (volume === 28) {
        return "2212236"
    }else if (volume === 30) {
        return "2189058"
    }else if (volume === 34) {
        return "2237577"
    }else if (volume === 35) {
        return "2189064"
    }else if (volume === 36) {
        return "2217702"
    }else if (volume === 37) {
        return "3209617"
    }else if (volume === 38) {
        return "2426262"
    }else if (volume === 40) {
        return "2189070"
    }else if (volume === 44) {
        return "2189790"
    }else if (volume === 45) {
        return "2189082"
    }else if (volume === 50) {
        return "2189094"
    }else if (volume === 52) {
        return "2215770"
    }else if (volume === 55) {
        return "2189100"
    }else if (volume === 59) {
        return "2189802"
    }else if (volume === 60) {
        return "2189106"
    }else if (volume === 62) {
        return "2215788"
    }else if (volume === 65) {
        return "2189808"
    }else if (volume === 67) {
        return "2473630"
    }else if (volume === 70) {
        return "2189118"
    }else if (volume === 74) {
        return "2212656"
    }else if (volume === 75) {
        return "2189124"
    }else if (volume === 80) {
        return "2189130"
    }else if (volume === 85) {
        return "2189820"
    }else if (volume === 87) {
        return "2952286"
    }else if (volume === 88) {
        return "2189826"
    }else if (volume === 90) {
        return "2189136"
    }else if (volume === 97) {
        return "2189136"
    }else if (volume === 100) {
        return "2189142"
    }else if (volume === 105) {
        return "2189850"
    }else if (volume === 110) {
        return "2189148"
    }else if (volume === 120) {
        return "2189160"
    }else if (volume === 124) { //124 мл - передаємо як 125 бо немає в базі
        return "2189166"
    }else if (volume === 125) {
        return "2189166"
    }else if (volume === 130) {
        return "2189172"
    }else if (volume === 140) {
        return "2189178"
    }else if (volume === 145) {
        return "2189184"
    }else if (volume === 150) {
        return "2189190"
    }else if (volume === 160) {
        return "2189202"
    }else if (volume === 170) {
        return "2189208"
    }else if (volume === 180) {
        return "2189226"
    }else if (volume === 200) {
        return "2189238"
    }else if (volume === 210) {
        return "2189244"
    }else if (volume === 220) {
        return "2189250"
    }else if (volume === 236) {
        return "2206074"
    }else if (volume === 240) {
        return "2189268"
    }else if (volume === 250) {
        return "2189274"
    }else if (volume === 280) {
        return "2189328"
    }else if (volume === 300) {
        return "2189358"
    }else if (volume === 400) {
        return "2189418"
    }else if (volume === 500) {
        return "2189448"
    }else if (volume === 700) {
        return "2189484"
    }else if (volume === 1000) {
        return "2189508"
    }else {
        TelegramMsg("TECH", `Не вказане значення ваги Розетка. ${volume}. ${id}`)
        return ""
    }
}

module.exports = calculateVolume;
