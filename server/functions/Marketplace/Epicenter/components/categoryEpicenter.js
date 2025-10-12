
async function categoryEpicenter(categoryId) {

    if (categoryId === 1 || categoryId === 2 || categoryId === 3 || categoryId === 102 || categoryId === 104 || categoryId === 103|| categoryId === 106) {
        return {name:"Парфумерія",categoryId:"3133"}
    }else if (categoryId === 45) {
        return {name:"Сироватка для обличчя",categoryId:"3186"}
    }else if (categoryId === 27 || categoryId === 26 || categoryId === 61 || categoryId === 81 || categoryId === 97) {
        return {name:"Бальзам для губ",categoryId:"3183"}
    }else if (categoryId === 73 || categoryId === 29) {
        return {name:"Патчі під очі",categoryId:"6574"}
    }else if (categoryId === 62) {
        return {name:"Засоби для шкіри навколо очей",categoryId:"3182"}
    }else if (categoryId === 32 || categoryId === 73) {
        return {name:"Маска для обличчя",categoryId:"3184"}
    }else if (categoryId === 49 || categoryId === 33) {
        return {name:"Тоніки та лосьйони",categoryId:"6556"}
    }else if (categoryId === 65 || categoryId === 74) {
        return {name:"Гель та пінка для вмивання",categoryId:"3181"}
    }else if (categoryId === 66) {
        return {name: "Сонцезахисні засоби", categoryId: ""}
    }else if (categoryId === 36) {
        return {name:"Міцелярна вода",categoryId:"3180"}
    }else if (categoryId === 96) {
        return {name:"Засоби для зняття макіяжу",categoryId:"3180"}
    }else if (categoryId === 5) {
        return {name:"Косметичні олії",categoryId:"6529"}
    }else if (categoryId === 7) {
        return {name:"Скраб для тіла",categoryId:"3140"}
    }else if (categoryId === 28 || categoryId === 72 || categoryId === 35) {
        return {name:"Скраб та пілінг",categoryId:"3185"}
    }else if (categoryId === 99 || categoryId === 19) {
        return {name:"Крем для тіла",categoryId:"3161"}
    }else if (categoryId === 75 || categoryId === 40) {
        return {name:"Крем для обличчя",categoryId:"3179"}
    }else if (categoryId === 16) {
        return {name:"Гель для душу",categoryId:"3139"}
    }else if (categoryId === 20) {
        return {name:"Шампунь",categoryId:"3169"}
    }else if (categoryId === 21) {
        return {name:"Кондиціонер для волосся",categoryId:"7189"}
    }else if (categoryId === 77 || categoryId === 22) {
        return {name:"Спрей для волосся",categoryId:"7135"}
    }else if (categoryId === 23) {
        return {name:"Маска для волосся",categoryId:"3172"}
    }else if (categoryId === 76 || categoryId === 46 || categoryId === 4 || categoryId === 78) {
        return {name:"Сироватка для волосся",categoryId:"6306"}
    }else if (categoryId === 6 || categoryId === 48 || categoryId === 63) {
        return {name:"Олія для волосся",categoryId:"3175"}
    }else if (categoryId === 44) {
        return {name:"Крем для рук і нігтів",categoryId:"3155"}
    }else if (categoryId === 54 || categoryId === 55|| categoryId === 105) {
        return {name:"Подарункові набори косметики",categoryId:"3163"}
    }else if (categoryId === 98) {
        return {name:"Спрей для тіла",categoryId:"7606"}
    }else if (categoryId === 129) {
        return {name:"Пудра для обличчя",categoryId:"3238"}
    }else if (categoryId === 128 || categoryId === 127) {
        return {name:"Бронзери та хайлайтери",categoryId:"3241"}
    }else if (categoryId === 51) {
        return {name:"База під макіяж",categoryId:"3237"}
    }else if (categoryId === 130|| categoryId === 131 || categoryId === 128) {
        return {name:"Коректор та консилер",categoryId:"3237"}
    }else if (categoryId === 126) {
        return {name:"Рум'яна",categoryId:"3239"}
    }else if (categoryId === 70 || categoryId === 125) {
        return {name:"Тональні засоби",categoryId:"3240"}
    }else if (categoryId === 120 || categoryId === 118 || categoryId === 117 || categoryId === 119) {
        return {name:"Олівець для брів",categoryId:"3227"}
    }else if (categoryId === 113) {
        return {name:"Туш для вій",categoryId:"3230"}
    }else if (categoryId === 116) {
        return {name:"Олівець для очей",categoryId:"3226"}
    }else if (categoryId === 115) {
        return {name:"Підводки для очей",categoryId:"3228"}
    }else if (categoryId === 114) {
        return {name:"Тіні для очей",categoryId:"3229"}
    }else if (categoryId === 121) {
        return {name:"Помада губна",categoryId:"3233"}
    }else if (categoryId === 124) {
        return {name:"Олівець для губ",categoryId:"3234"}
    }else if (categoryId === 123) {
        return {name:"Тінт для губ",categoryId:"8953"}
    }else if (categoryId === 122) {
        return {name:"Блиск для губ",categoryId:"8951"}
    }else{
        return {name:undefined,categoryId:undefined}
    }
}

module.exports = categoryEpicenter;
