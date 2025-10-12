
function CalculateMonth(Month,language) {
    if(language){
        return Month === 0 ? "января" : Month === 1 ? "февраля" : Month === 2 ? "марта" : Month === 3
            ? "апреля" : Month === 4 ? "мая" : Month === 5 ? "июня" : Month === 6 ? "июля" : Month === 7
                ? "августа" : Month === 8 ? "сентября" : Month === 9 ? "октября" : Month === 10 ? "ноября" : Month === 11 ? "декабря" : "";
    }else{
        return Month === 0 ? "січня" : Month === 1 ? "лютого" : Month === 2 ? "березня" : Month === 3
            ? "квітня" : Month === 4 ? "травня" : Month === 5 ? "червня" : Month === 6 ? "липня" : Month === 7
                ? "серпня" : Month === 8 ? "вересня" : Month === 9 ? "жовтня" : Month === 10 ? "листопада" : Month === 11 ? "грудня" : "";
    }

}

module.exports = CalculateMonth;