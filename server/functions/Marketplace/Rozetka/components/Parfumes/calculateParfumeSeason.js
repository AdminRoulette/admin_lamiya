
async function calculateParfumeSeason(parfumeSeason,paramArray) {
    if(!parfumeSeason){
        return false;
    }
    let SeasonArr = [];
    for(const season of parfumeSeason){
        if(season.id === 10){
            SeasonArr.push({name:"Осінні", code:"4352322"});
        }
        if (season.id === 9) {
            SeasonArr.push({name:"Зимні", code:"4352325"});
        }
        if (season.id === 11) {
            SeasonArr.push({name:"Весняні", code:"4352328"});
        }
        if (season.id === 8) {
            SeasonArr.push({name:"Літні", code:"4352331"});
        }
    }

    if (SeasonArr.length > 0) {
        const names = SeasonArr.map(item => item.name).join(',');
        const codes = SeasonArr.map(item => item.code).join(',');

        paramArray.push({
            '#': names,
            '@paramid': '253317',
            '@name': 'Сезонність',
            '@valueid': codes

        })
    }
    return true;
}

module.exports = calculateParfumeSeason;
