
async function categoriesGoogle(category) {

    if (category.id === 1 || category.id === 2 || category.id === 3) {
        return {name:"Парфумерія",categoryId:"3133"}
    }else if (category.id === 4 || category.id === 43) {
        return {name:"Сироватка для обличчя",categoryId:"3186"}
    }else if (category.id === 27 || category.id === 28) {
        return {name:"Бальзам для губ",categoryId:"3183"}
    }else if (category.id === 29 || category.id === 73) {
        return {name:"Патчі під очі",categoryId:"6574"}
    }else if (category.id === 40 || category.id === 51) {
        return {name:"Крем для обличчя",categoryId:"3179"}
    }else if (category.id === 32) {
        return {name:"Маска для обличчя",categoryId:"3184"}
    }else if (category.id === 39) {
        return {name:"Тоніки та лосьйони",categoryId:"6556"}
    }else if (category.id === 49) {
        return {name:"Тонер для обличчя",categoryId:"5056"}
    }else if (category.id === 38) {
        return {name:"Гель та пінка для вмивання",categoryId:"3181"}
    }else if (category.id === 66) {
        return {name: "Сонцезахисні засоби", categoryId: ""}
    }else if (category.id === 35) {
        return {name:"Пудра для обличчя",categoryId:"3238"}
    }else if (category.id === 36) {
        return {name:"Міцелярна вода",categoryId:"3180"}
    }else if (category.id === 45 || category.id === 71) {
        return {name:"Засоби для зняття макіяжу",categoryId:"3180"}
    }else if (category.id === 5 ||  category.id === 12) {
        return {name:"Косметичні олії",categoryId:"6529"}
    }else if (category.id === 7 || category.id === 8 || category.id === 13) {
        return {name:"Скраб для тіла",categoryId:"3140"}
    }else if (category.id === 11 || category.id === 14 || category.id === 17 || category.id === 18 || category.id === 19) {
        return {name:"Крем для тіла",categoryId:"3161"}
    }else if (category.id === 16) {
        return {name:"Гель для душу",categoryId:"3139"}
    }else if (category.id === 20 || category.id === 47) {
        return {name:"Шампунь",categoryId:"3169"}
    }else if (category.id === 21 || category.id === 101) {
        return {name:"Кондиціонер для волосся",categoryId:"7189"}
    }else if (category.id === 22 || category.id === 76 || category.id === 78) {
        return {name:"Спрей для волосся",categoryId:"7135"}
    }else if (category.id === 23) {
        return {name:"Маска для волосся",categoryId:"3172"}
    }else if (category.id === 26 || category.id === 46) {
        return {name:"Сироватка для обличчя",categoryId:"3186"}
    }else if (category.id === 6) {
        return {name:"Олія для волосся",categoryId:"3175"}
    }else if (category.id === 44) {
        return {name:"Крем для рук і нігтів",categoryId:"3155"}
    }else if (category.id === 33) {
        return {name:"Термальна вода",categoryId:"6540"}
    }else if (category.id === 54 || category.id === 55|| category.id === 105) {
        return {name:"Подарункові набори косметики",categoryId:"3163"}
    }else if (category.id === 70) {
        return {name:"BB-, CC-креми",categoryId:"6875"}
    }else if (category.id === 98) {
        return {name:"Спрей для тіла",categoryId:"7606"}
    }else if (category.id === 99) {
        return {name:"Молочко і лосьйон для тіла",categoryId:"3145"}
    }else{
        return undefined
    }
}

module.exports = categoriesGoogle;
