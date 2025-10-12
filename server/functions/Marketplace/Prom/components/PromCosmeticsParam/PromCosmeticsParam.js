const calculateClassifications = require("../../../Rozetka/components/Cosmetic/calculateClassifications");
const promSkinProblems = require("./components/promSkinProblems");
const promPurposes = require("./components/promPurposes");
const promSkinTypes = require("./components/promSkinTypes");
const promClassifications = require("./components/promClassifications");
const promFormulas = require("./components/promFormulas");
const promAdditionalEffect = require("./components/promAdditionalEffect");
const promColors = require("./components/promColors");
const promSPFs = require("./components/promSPFs");
const promEffect = require("./components/promEffect");
const promCreamTypes = require("./components/promCreamTypes");
const promHairPurposes = require("./components/promHairPurpose");
const promHairTypes = require("./components/promHairTypes");
const promHairProblems = require("./components/promHairProblems");
const promShampooTypes = require("./components/promShampooTypes");
const promSkinProblemsAndStatus = require("./components/promSkinProblemsAndStatus");
const promSkrubTypes = require("./components/promSkrubTypes");
const promTexture = require("./components/promTexture");
const promColorTypes = require("./components/promColorTypes");
const promPomadaTypes = require("./components/promPomadaTypes");
const promBrushTypes = require("./components/promBrushTypes");
const promShadowsTypes = require("./components/promShadowTypes");
const promApplicator = require("./components/promApplicator");
const promEyelinerTypes = require("./components/promEyelinerTypes");
const promBlushTypes = require("./components/promBlushTypes");
const promMakeUpColors = require("./components/promMakeUpColors");
const promTon = require("./components/promTon");
const promShadowColors = require("./components/promShadowColors");
const promCorrectColors = require("./components/promCorrectColors");

async function PromCosmeticsParam(option, product, paramArray) {
    const categoryId = product.product_categories[0].categoryId;

    paramArray.push({
        '#': option.weight,
        '@name': 'Об`єм',
        '@unit': 'мл'
    })

    paramArray.push({
        '#': option.weight,
        '@name': 'Вага',
        '@unit': 'мл'
    })


    if (categoryId === 26 || categoryId === 61 || categoryId === 81 || categoryId === 97) {

        paramArray.push({
            '#': "Унісекс",
            '@name': 'Стать'
        })

        paramArray.push({
            '#': "Обличчя",
            '@name': 'Область застосування'
        })

        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вік'
        })

        paramArray.push({
            '#': "Універсальний",
            '@name': 'Час застосування'
        })

        if(product?.filters?.formula?.some(item => item.id === 12)){
            paramArray.push({
                '#': "Колагеновий",
                '@name': 'Вид догляду'
            })
        }

        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }

        await promClassifications(product?.filters?.classification, paramArray)
        await promSkinTypes(product?.filters?.skin, paramArray)
        await promSkinProblemsAndStatus(product?.filters?.purpose, product?.filters?.skin, paramArray)
        await promPurposes(product?.filters?.purpose, paramArray)
        await promAdditionalEffect(product?.filters?.purpose, paramArray)
        await promFormulas(product?.filters?.formula, paramArray)

    }else if (categoryId === 28 || categoryId === 27) {
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вікова група'
        })
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вік'
        })
        paramArray.push({
            '#': "Унісекс",
            '@name': 'Стать'
        })
        paramArray.push({
            '#': "Універсальний",
            '@name': 'Час застосування'
        })
        paramArray.push({
            '#': "Губи",
            '@name': 'Область застосування'
        })

        paramArray.push({
            '#': categoryId === 28 ? "Скраб" : "Бальзам",
            '@name': 'Вид засобу по догляду за шкірою губ'
        })

        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }

        await promClassifications(product?.filters?.classification, paramArray)
        await promColors(product?.filters?.color, paramArray)
        await promSPFs(product?.filters?.spf, paramArray)
        await promSkinProblemsAndStatus(product?.filters?.purpose, product?.filters?.skin, paramArray)
    }else if (categoryId === 73 || categoryId === 29) {
        paramArray.push({
            '#': "Універсальний",
            '@name': 'Час застосування'
        })
        paramArray.push({
            '#': "Унісекс",
            '@name': 'Стать'
        })
        paramArray.push({
            '#': categoryId === 29 ? "Шкіра навколо очей" : "Обличчя",
            '@name': 'Область застосування'
        })
        await promPurposes(product?.filters?.purpose, paramArray)
        await promSkinProblemsAndStatus(product?.filters?.purpose, product?.filters?.skin, paramArray)
    }else if (categoryId === 75 || categoryId === 40 || categoryId === 62 || categoryId === 30) {
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вікова група'
        })
        paramArray.push({
            '#': "Унісекс",
            '@name': 'Стать'
        })
        paramArray.push({
            '#': "Універсальний",
            '@name': 'Час застосування'
        })
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вік'
        })
        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }
        await promSkinTypes(product?.filters?.skin, paramArray)
        await promSkinProblemsAndStatus(product?.filters?.purpose, product?.filters?.skin, paramArray)
        await promPurposes(product?.filters?.purpose, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
        await promFormulas(product?.filters?.formula, paramArray)
        await promCreamTypes(product?.filters?.purpose, paramArray)
    }else if (categoryId === 32) {
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вікова група'
        })
        paramArray.push({
            '#': "Унісекс",
            '@name': 'Стать'
        })
        paramArray.push({
            '#': "Універсальний",
            '@name': 'Час застосування'
        })
        paramArray.push({
            '#': "Обличчя",
            '@name': 'Область застосування'
        })
        paramArray.push({
            '#': option.weight,
            '@name': 'Кількість в упаковці', '@unit':'шт.'
        })
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вік'
        })
        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }

        await promSkinTypes(product?.mask, paramArray)
        await promSkinProblemsAndStatus(product?.filters?.purpose, product?.filters?.skin, paramArray)
        await promSkinTypes(product?.filters?.skin, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
        await promAdditionalEffect(product?.filters?.purpose, paramArray)
        await promPurposes(product?.filters?.purpose, paramArray)
    }else if (categoryId === 49 || categoryId === 33) {
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вікова група'
        })
        paramArray.push({
            '#': "Унісекс",
            '@name': 'Стать'
        })
        paramArray.push({
            '#': "Обличчя",
            '@name': 'Область застосування'
        })
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вік'
        })
        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }
        await promSkinTypes(product?.filters?.skin, paramArray)
        await promSkinProblemsAndStatus(product?.filters?.purpose, product?.filters?.skin, paramArray)
        await promPurposes(product?.filters?.purpose, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
    }else if (categoryId === 117 || categoryId === 120 || categoryId === 118) {
        paramArray.push({
            '#': categoryId === 117 ? "Тіні" : categoryId === 120 ? "Олівець" : "Помадка",
            '@name': 'Тип'
        })

        paramArray.push({
            '#': "Для очей і брів",
            '@name': 'Область застосування олівця'
        })

        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }

        if(product?.filters?.feature?.some(item => item.filter_id === 146)){
            paramArray.push({
                '#': "Так",
                '@name': 'Водостійкість'
            })
        }
        await promClassifications(product?.filters?.classification, paramArray)

    }else if (categoryId === 36 || categoryId === 65 || categoryId === 96) {
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вікова група'
        })
        paramArray.push({
            '#': "Унісекс",
            '@name': 'Стать'
        })
        paramArray.push({
            '#': "Обличчя",
            '@name': 'Область застосування'
        })
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вік'
        })
        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }
        if(product?.filters?.feature?.some(item => item.id === 1004)){
            paramArray.push({
                '#': "Так",
                '@name': 'Видалення водостійкого макіяжу'
            })
        }


        paramArray.push({
            '#': categoryId === 65 ? "Пінка" : categoryId === 36 ? "Міцелярна вода" : categoryId === 96 ? "Гідрофільна олія" : "",
            '@name': 'Тип засобу для зняття макіяжу'
        })

        paramArray.push({
            '#': "Обличчя",
            '@name': 'Тип засобу для зняття макіяжу'
        })
        await promSkinTypes(product?.filters?.skin, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
        await promAdditionalEffect(product?.filters?.purpose, paramArray)
    }else if (categoryId === 5 || categoryId === 45) {

        paramArray.push({
            '#': categoryId === 5 ? "Тіло,Шия,Живіт,Груди,Руки,Ноги" : categoryId === 45 ? "Обличчя,Шия" : "",
            '@name': 'Область застосування'
        })
        await promSkinProblemsAndStatus(product?.filters?.purpose, product?.filters?.skin, paramArray)
        await promSkinTypes(product?.filters?.skin, paramArray)
        await promPurposes(product?.filters?.purpose, paramArray)
        await promEffect(product?.filters?.purpose, paramArray)
    }else if (categoryId === 16) {
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вікова група'
        })
        paramArray.push({
            '#': "Унісекс",
            '@name': 'Стать'
        })
        paramArray.push({
            '#': "Тіло",
            '@name': 'Область застосування'
        })
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вік'
        })
        paramArray.push({
            '#': "Гель",
            '@name': 'Тип засобу для душа'
        })
        await promSkinTypes(product?.filters?.skin, paramArray)
        await promPurposes(product?.filters?.purpose, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
        await promEffect(product?.filters?.purpose, paramArray)
    }else if (categoryId === 7) {
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вікова група'
        })
        paramArray.push({
            '#': "Унісекс",
            '@name': 'Стать'
        })
        paramArray.push({
            '#': "Тіло,Шия,Сідниці,Стегна,Ноги,Руки",
            '@name': 'Область застосування'
        })
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вік'
        })


        await promSkrubTypes(product?.filters?.chastunku, paramArray)
        await promSkinProblemsAndStatus(product?.filters?.purpose, product?.filters?.skin, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
        await promSkinTypes(product?.filters?.skin, paramArray)
        await promPurposes(product?.filters?.purpose, paramArray)
        await promEffect(product?.filters?.purpose, paramArray)
    }else if (categoryId === 99) {
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вікова група'
        })
        paramArray.push({
            '#': "Унісекс",
            '@name': 'Стать'
        })
        paramArray.push({
            '#': "Універсальний",
            '@name': 'Час застосування'
        })
        paramArray.push({
            '#': "Тіло,Сідниці,Стегна,Ноги,Руки",
            '@name': 'Область застосування'
        })
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вік'
        })
        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }
        await promSkinTypes(product?.filters?.skin, paramArray)
        await promPurposes(product?.filters?.purpose, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
        await promSkinProblemsAndStatus(product?.filters?.purpose, product?.filters?.skin, paramArray)
        await promEffect(product?.filters?.purpose, paramArray)
        await promFormulas(product?.filters?.formula, paramArray)
        await promCreamTypes(product?.filters?.purpose, paramArray)
    }else if (categoryId === 20) {
        paramArray.push({
            '#': "Унісекс",
            '@name': 'Стать'
        })
        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }
        await promShampooTypes(product?.filters?.shampoo, paramArray)
        await promHairPurposes(product?.filters?.purpose, paramArray)
        await promHairTypes(product?.filters?.hair, paramArray)
        await promHairProblems(product?.filters?.purpose,product?.filters?.hair, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
    }else if (categoryId ===  21) {
        paramArray.push({
            '#': "Унісекс",
            '@name': 'Стать'
        })
        paramArray.push({
            '#': "Волосся",
            '@name': 'Область застосування'
        })
        paramArray.push({
            '#': "Кондиционер",
            '@name': 'Тип бальзаму/кондиціонера'
        })
        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }
        if(product?.filters?.feature?.some(item => item.id === 143)){
            paramArray.push({
                '#': "незмивний",
                '@name': 'Спосіб застосування'
            })
            paramArray.push({
                '#': "Незмивний",
                '@name': 'Тип застосування'
            })
        }


        await promTexture(product?.filters?.texture, paramArray)
        await promHairPurposes(product?.filters?.purpose, paramArray)
        await promHairTypes(product?.filters?.hair, paramArray)
        await promHairProblems(product?.filters?.purpose,product?.filters?.hair, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
    }else if (categoryId === 23) {
        paramArray.push({
            '#': "Унісекс",
            '@name': 'Стать'
        })
        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }
        await promHairProblems(product?.filters?.purpose,product?.filters?.hair, paramArray)
        await promHairPurposes(product?.filters?.purpose, paramArray)
        await promHairTypes(product?.filters?.hair, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
    }else if (categoryId === 4 || categoryId === 22 || categoryId === 77 || categoryId === 46
        || categoryId === 78 || categoryId === 6 || categoryId === 63 || categoryId === 48
        || categoryId === 76) {
        paramArray.push({
            '#': "Унісекс",
            '@name': 'Стать'
        })
        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }
        //<attribute id="4414" nameRU="Тип средства" type="singleselect" nameUK="Тип засобу">
        // <attribute_value id="28026" nameRU="Крем" nameUK="Крем"/>
        // <attribute_value id="28027" nameRU="Бальзам" nameUK="Бальзам"/>
        // <attribute_value id="28028" nameRU="Гель" nameUK="Гель"/>
        // <attribute_value id="28029" nameRU="Масло" nameUK="Масло"/>
        // <attribute_value id="28030" nameRU="Пенка" nameUK="Пінка"/>
        // <attribute_value id="28032" nameRU="Скраб" nameUK="Скраб"/>
        // <attribute_value id="28033" nameRU="Лосьон" nameUK="Лосьйон"/>
        // <attribute_value id="28034" nameRU="Мусс" nameUK="Мус"/>
        // <attribute_value id="28035" nameRU="Молочко" nameUK="Молочко"/>
        // <attribute_value id="28036" nameRU="Крем-бальзам" nameUK="Крем-бальзам"/>
        // <attribute_value id="28037" nameRU="Крем-масло" nameUK="Крем-масло"/>
        // <attribute_value id="28038" nameRU="Крем-гель" nameUK="Крем-гель"/>
        // <attribute_value id="28039" nameRU="Спрей" nameUK="Спрей"/>
        // <attribute_value id="28040" nameRU="Сыворотка" nameUK="Сироватка"/>
        // <attribute_value id="28041" nameRU="Маска" nameUK="Маска"/>
        // <attribute_value id="28042" nameRU="Шампунь" nameUK="Шампунь"/>
        // <attribute_value id="28043" nameRU="Мыло" nameUK="Мило"/>
        // <attribute_value id="28044" nameRU="Бальзам-ополаскиватель" nameUK="Бальзам-ополіскувач"/>
        // <attribute_value id="28045" nameRU="Кондиционер" nameUK="Кондиціонер"/>
        // <attribute_value id="28046" nameRU="Эмульсия" nameUK="Емульсія"/>
        // <attribute_value id="28047" nameRU="Тоник" nameUK="Тонік"/>
        // <attribute_value id="36837" nameRU="Пена" nameUK="Піна"/>
        // <attribute_value id="71292" nameRU="Флюид" nameUK="Флюїд"/>
        // <attribute_value id="208020" nameRU="Пудра-камуфляж" nameUK="Пудра-камуфляж"/>
        // <attribute_value id="275445" nameRU="Концентрат" nameUK="Концентрат"/>
        // <attribute_value id="276914" nameRU="Пилинг-крем" nameUK="Пілінг-крем"/>
        // <attribute_value id="279943" nameRU="Маска-сыворотка" nameUK="Маска-сироватка"/>
        // <attribute_value id="301017" nameRU="Капсулы" nameUK="Капсули"/>
        // <attribute_value id="302383" nameRU="Кератин" nameUK=""/>
        // <attribute_value id="306280" nameRU="Реконструктор" nameUK="Реконструктор"/>
        // <attribute_value id="311389" nameRU="Бустер" nameUK="Бустер"/>
        // <attribute_value id="311390" nameRU="Филлер" nameUK="Філлер"/>
        // </attribute>
        paramArray.push({
            '#': categoryId === 4 ? "Сироватка" : categoryId === 22 ? "Спрей" : categoryId === 77 ?"Спрей": categoryId === 46
                ?"Філлер": categoryId === 6 ?"Масло": categoryId === 63 ?"Масло": categoryId === 48
                    ?"Масло": categoryId === 76 ?"Сироватка": "" ,
            '@name': 'Тип засобу'
        })
        await promHairProblems(product?.filters?.purpose,product?.filters?.hair, paramArray)
        await promHairPurposes(product?.filters?.purpose, paramArray)
        await promHairTypes(product?.filters?.hair, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
        await promEffect(product?.filters?.purpose, paramArray)
    }else if (categoryId === 19) {
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вікова група'
        })
        paramArray.push({
            '#': "Тіло",
            '@name': 'Область застосування'
        })

        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }
        await promSkinProblemsAndStatus(product?.filters?.purpose, product?.filters?.skin, paramArray)
        await promEffect(product?.filters?.purpose, paramArray)
        //<attribute id="3325" nameRU="Вид маски по консистенции" type="singleselect" nameUK="Вид маски по консистенції">
        // <attribute_value id="22384" nameRU="Кремообразные" nameUK="Кремоподібні"/>
        // <attribute_value id="22385" nameRU="Сухие" nameUK="Сухі"/>
        // <attribute_value id="22386" nameRU="Грязевые" nameUK="Грязьові"/>
        // <attribute_value id="22387" nameRU="Гелеобразные" nameUK="Гелевидні"/>
        // <attribute_value id="22388" nameRU="Жидкие маски (маски-пленки)" nameUK="Рідкі маски (маски-плівки)"/>
        // <attribute_value id="22389" nameRU="Термоактивные" nameUK="Термоактивні"/>
        // <attribute_value id="22390" nameRU="Пастообразные" nameUK="Пастоподібні"/>
        // <attribute_value id="22391" nameRU="Порошкообразные" nameUK="Порошкоподібні"/>
        // <attribute_value id="22392" nameRU="Парафиновые" nameUK="Парафінові"/>
        // <attribute_value id="163358" nameRU="Маска-муляж" nameUK="Маска-муляж"/>
        // </attribute>

        //<attribute id="3343" nameRU="Вид маски по назначению" type="singleselect" nameUK="Вид маски за призначенням">
        // <attribute_value id="22433" nameRU="Питательная" nameUK="Поживна"/>
        // <attribute_value id="22434" nameRU="Увлажняющая" nameUK="Зволожуюча"/>
        // <attribute_value id="22435" nameRU="Очищающая" nameUK="Очищаюча"/>
        // <attribute_value id="22436" nameRU="Отбеливающая" nameUK="Відбілююча"/>
        // <attribute_value id="22437" nameRU="Омолаживающая" nameUK="Омолоджуюча"/>
        // <attribute_value id="22438" nameRU="Отшелушивающая" nameUK="Відлущуюча"/>
        // <attribute_value id="22439" nameRU="Стягивающая" nameUK="Стягуюча"/>
        // <attribute_value id="22440" nameRU="Тонизирующая" nameUK="Тонізуюча"/>
        // <attribute_value id="22441" nameRU="Лечебная" nameUK="Лікувальна"/>
        // <attribute_value id="22442" nameRU="Лифтинговая" nameUK="Ліфтингова"/>
        // <attribute_value id="22443" nameRU="Рассасывающая" nameUK="Розсмоктуюча"/>
        // <attribute_value id="39644" nameRU="Антицеллюлитная" nameUK="Антицелюлітна"/>
        // </attribute>
        await promSkinTypes(product?.filters?.skin, paramArray)
        await promPurposes(product?.filters?.purpose, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
    }else if (categoryId === 44) {
        paramArray.push({
            '#': "Універсальний",
            '@name': 'Час застосування'
        })
        paramArray.push({
            '#': "Руки",
            '@name': 'Область застосування'
        })
        await promPurposes(product?.filters?.purpose, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
        await promSkinProblemsAndStatus(product?.filters?.purpose, product?.filters?.skin, paramArray)
        await promEffect(product?.filters?.purpose, paramArray)
        await promCreamTypes(product?.filters?.purpose, paramArray)
    }else if (categoryId === 72) {
        paramArray.push({
            '#': "Унісекс",
            '@name': 'Стать'
        })
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вікова група'
        })
        paramArray.push({
            '#': "Обличчя",
            '@name': 'Область застосування'
        })
        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вік'
        })
        await promClassifications(product?.filters?.classification, paramArray)
        await promSkinProblems(product?.filters?.purpose, paramArray) // -- ????? Проблема шкіри
        await promSkinTypes(product?.filters?.skin, paramArray)
        await promPurposes(product?.filters?.purpose, paramArray)
    }else if (categoryId === 51) {

        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вікова група'
        })
        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }
        await promClassifications(product?.filters?.classification, paramArray)
        await promSkinTypes(product?.filters?.skin, paramArray)
        await promAdditionalEffect(product?.filters?.purpose, paramArray)
        await promSPFs(product?.filters?.spf, paramArray)
        paramArray.push({
            '#': "Тональная основа",
            '@name': 'Тип засобу'
        })
    }else if (categoryId === 54 || categoryId === 55 || categoryId === 105) {
        paramArray.push({
            '#': "Унісекс",
            '@name': 'Стать'
        })
        paramArray.push({
            '#': categoryId === 54 ? "Догляд за обличчям" : categoryId === 55 ? "Догляд за волоссям" : categoryId === 105 ? "Догляд за тілом": "",
            '@name': 'Застосування'
        })
        await promHairPurposes(product?.filters?.purpose, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
        await promPurposes(product?.filters?.purpose, paramArray)
        await promSkinProblems(product?.filters?.purpose, paramArray) // -- ????? Проблема шкіри
    }else if (categoryId === 66) {
        paramArray.push({
            '#': "Обличчя",
            '@name': 'Область застосування'
        })
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вікова група'
        })
        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }
        await promSPFs(product?.filters?.spf, paramArray)
        await promAdditionalEffect(product?.filters?.purpose, paramArray)
        await promSkinTypes(product?.filters?.skin, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
    }else if (categoryId === 98) {
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вікова група'
        })
        paramArray.push({
            '#': "Унісекс",
            '@name': 'Стать'
        })
        paramArray.push({
            '#': "Універсальний",
            '@name': 'Час застосування'
        })
        paramArray.push({
            '#': "Тіло",
            '@name': 'Область застосування'
        })
        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }
        await promPurposes(product?.filters?.purpose, paramArray)
        await promSkinProblems(product?.filters?.purpose, paramArray) // -- ????? Проблема шкіри
        await promSkinTypes(product?.filters?.skin, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
    }else if (categoryId === 121 || categoryId === 123) {
        paramArray.push({
            '#': "Олівець/стик",
            '@name': 'Тип'
        })

        await promColors(product?.filters?.color, paramArray)
        await promPomadaTypes(product?.filters?.purpose,product?.filters?.feature, paramArray)
        await promColorTypes(product?.filters?.shade, paramArray)
        await promSPFs(product?.filters?.spf, paramArray)
        await promAdditionalEffect(product?.filters?.purpose, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
    }else if (categoryId === 122) {
        await promColors(product?.filters?.color, paramArray)
        await promColorTypes(product?.filters?.shade, paramArray)
        await promSPFs(product?.filters?.spf, paramArray)
        await promAdditionalEffect(product?.filters?.purpose, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
    }else if (categoryId === 124) {
        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }

        if(product?.filters?.feature?.some(item => item.filter_id === 146)){
            paramArray.push({
                '#': "Так",
                '@name': 'Водостійкість'
            })
        }

        paramArray.push({
            '#': "Для губ",
            '@name': 'Область застосування олівця'
        })

            //<attribute id="8732" nameRU="Тип карандаша" type="singleselect" nameUK="Тип олівця">
        // <attribute_value id="70643" nameRU="Односторонний" nameUK="Односторонній"/>
        // <attribute_value id="70644" nameRU="Двусторонний" nameUK="Двосторонній"/>
        // <attribute_value id="70645" nameRU="С кисточкой" nameUK="З пензликом"/>
        // <attribute_value id="70646" nameRU="С аппликатором" nameUK="З аплікатором"/>
        // </attribute>
        // <attribute id="18922" nameRU="Вид стержня" type="multiselect" nameUK="Вид стержню">
        // <attribute_value id="313787" nameRU="Пудровый" nameUK="Пудровий"/>
        // <attribute_value id="313790" nameRU="Восковый" nameUK="Восковий"/>
        // </attribute>
        await promMakeUpColors(product?.filters?.color, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
    }else if (categoryId === 113) {
        if(product?.filters?.brush?.some(item => item.filter_id === 164)){
            paramArray.push({
                '#': "Силікон",
                '@name': 'Матеріал щетини'
            })
        }


        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }

        if(product?.filters?.feature?.some(item => item.filter_id === 146)){
            paramArray.push({
                '#': "Так",
                '@name': 'Водостійкість'
            })
        }
        await promMakeUpColors(product?.filters?.color, paramArray)
        await promBrushTypes(product?.filters?.mascara, paramArray)
        await promAdditionalEffect(product?.filters?.purpose, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
    }else if (categoryId === 114) {
        paramArray.push({
            '#': "Повіки",
            '@name': 'Область застосування'
        })

        await promShadowColors(product?.filters?.color, paramArray)
        await promShadowsTypes(product?.shadow, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
    }else if (categoryId === 115) {
        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }
        await promClassifications(product?.filters?.classification, paramArray)
        await promColorTypes(product?.filters?.shade, paramArray)
        await promEyelinerTypes(product?.filters?.eyeliner, paramArray)
        await promApplicator(product?.filters?.format, paramArray)
    }else if (categoryId === 116) {

        paramArray.push({
                        '#': "Для очей",
                        '@name': 'Область застосування олівця'
                    })

        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }

        if(product?.filters?.feature?.some(item => item.filter_id === 146)){
            paramArray.push({
                '#': "Так",
                '@name': 'Водостійкість'
            })
        }
        await promMakeUpColors(product?.filters?.color, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
    }else if (categoryId === 70 || categoryId === 125) {
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вікова група'
        })

        await promTon(product?.filters?.color, paramArray)
        await promCreamTypes(product?.filters?.purpose, paramArray)
        await promSkinTypes(product?.filters?.skin, paramArray)
        await promSPFs(product?.filters?.spf, paramArray)
        await promAdditionalEffect(product?.filters?.purpose, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
    }else if (categoryId === 130 || categoryId === 131 || categoryId === 127 || categoryId === 128) {
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вікова група'
        })
        paramArray.push({
            '#': "Обличчя",
            '@name': 'Область застосування'
        })
        paramArray.push({
            '#': categoryId === 130 ? "Консилер" : categoryId === 131 ? "Корректор"  : categoryId === 128 ? "Хайлайтер" : "",
            '@name': 'Тип засобу'
        })

        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }
        if(product?.filters?.feature?.some(item => item.filter_id === 146)){
            paramArray.push({
                '#': "Так",
                '@name': 'Водостійкість'
            })
        }

        await promCorrectColors(product?.filters?.color, paramArray)
        await promSPFs(product?.filters?.spf, paramArray)
        await promAdditionalEffect(product?.filters?.purpose, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
        await promSkinTypes(product?.filters?.skin, paramArray)
    }else if (categoryId === 129) {
        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }
        await promTon(product?.filters?.color, paramArray)
        await promSPFs(product?.filters?.spf, paramArray)
        await promAdditionalEffect(product?.filters?.purpose, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
        await promSkinTypes(product?.filters?.skin, paramArray)
    }else if (categoryId === 126) {
        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }
        await promTon(product?.filters?.color, paramArray)
        await promBlushTypes(product?.filters?.texture, paramArray)
        await promSPFs(product?.filters?.spf, paramArray)
        await promAdditionalEffect(product?.filters?.purpose, paramArray)
        await promClassifications(product?.filters?.classification, paramArray)
    }else if (categoryId === 71 || categoryId === 35 || categoryId === 74) {
        paramArray.push({
            '#': option.weight,
            '@name': 'Маса', '@unit': 'мл'
        })
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вікова група'
        })
        paramArray.push({
            '#': "Унісекс",
            '@name': 'Стать'
        })
        if(product?.filters?.feature?.some(item => item.id === 138)){
            paramArray.push({
                '#': "Так",
                '@name': 'Гіпоалергенний'
            })
        }
        paramArray.push({
            '#': categoryId === 35 ? "Очищаюча пудра" : categoryId === 74 ? "Гель" : "",
            '@name': 'Тип засобу для вмивання'
        })
        paramArray.push({
            '#': "Без обмежень",
            '@name': 'Вік'
        })
        await promClassifications(product?.filters?.classification, paramArray)
        await promPurposes(product?.filters?.purpose, paramArray)
        await promSkinProblems(product?.filters?.purpose, paramArray) // -- ????? Проблема шкіри
        await promSkinTypes(product?.filters?.skin, paramArray)
    }else if (categoryId === 119) {
        paramArray.push({
            '#': "Гель",
            '@name': 'Тип'
        })
    }else {
        return ""
    }
}

module.exports = PromCosmeticsParam;
