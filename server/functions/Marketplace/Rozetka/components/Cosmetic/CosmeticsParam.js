const calculateVolume = require("./calculateVolume");
const calculatePatchesCount = require("./calculatePatchesCount");
const calculateSPF = require("./calculateSPF");
const calculateFormulas = require("./calculateFormulas");
const calculateSkinTypes = require("./calculateSkinTypes");
const calculatePurpose = require("./calculatePurpose");
const calculateEcoTrends = require("./calculateEcoTrends");
const calculateFeatures = require("./calculateFeatures");
const calculatePurposeBody = require("./calculatePurposeBody");
const calculateFeaturesBody = require("./calculateFeaturesBody");
const calculatePurposeHair = require("./calculatePurposeHair");
const calculateFeaturesHair = require("./calculateFeaturesHair");
const calculateHairTypes = require("./calculateHairTypes");
const calculateHairEffect = require("./calculateHairEffect");
const calculateClassifications = require("./calculateClassifications");
const calculateSprayEffect = require("./calculateSprayEffect");
const calculateColors = require("./calculateColors");
const calculateTextures = require("./calculateTextures");

async function CosmeticsParam(option, product, paramArray) {

    if (!product.product_categories.some(item => item.categoryId === 54 || item.categoryId === 55 || item.categoryId === 106 || item.categoryId === 105)) {
        paramArray.push({
            '#': Number(option.weight),
            '@paramid': '199674',
            '@name': "Об'єм",
            '@valueid': await calculateVolume(Number(option.weight), product.id)
        })
    }
    if (product.bodycarepart?.composition) {
        paramArray.push({
            '#': `${product.bodycarepart?.composition ? product.bodycarepart.composition
                .replaceAll(`"`, "&quot;")
                .replaceAll(">", "&gt;")
                .replaceAll("<", "&lt;")
                .replaceAll(`'`, "&apos;")
                .replaceAll("&", "&amp;") : ""}`,
            '@paramid': '56287', '@name': "Склад"
        })
    }
    if (product.bodycarepart?.applicationmethod) {
        paramArray.push({
            '#': `${product.bodycarepart?.applicationmethod ? product.bodycarepart.applicationmethod
                .replaceAll(`"`, "&quot;")
                .replaceAll(">", "&gt;")
                .replaceAll("<", "&lt;")
                .replaceAll(`'`, "&apos;")
                .replaceAll("&", "&amp;") : ""}`,
            '@paramid': '69438', '@name': "Спосіб застосування"
        })
    }

    if(product.filters?.pcs && product.filters?.pcs?.length > 0) {
        paramArray.push({
            '#': Number(product.filters?.pcs[0]),
            '@paramid': '92802',
            '@name': 'Кількість в упаковці, шт.',
            '@valueid': await calculatePatchesCount(Number(product.filters?.pcs[0]), product.id)
        })
    }

    const categoryId = product.product_categories[0].categoryId;
    if (categoryId === 26 || categoryId === 97 || categoryId === 81 || categoryId === 61) {
        paramArray.push({
            '#': "Обличчя",
            '@name': "Сфера застосування", '@paramid': "200756", '@valueid': "2329888"
        })
        paramArray.push({
            '#': "1",
            '@name': "Кількість капсул/ампул, шт", '@paramid': "92802", '@valueid': "475520"
        })
        await calculateClassifications(product.filters?.classification, paramArray)
        await calculatePurpose(product.filters?.purpose, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculateSkinTypes(product.filters?.skin, paramArray);
        await calculateFormulas(product.filters?.spf, paramArray);
        await calculateSPF(product.filters?.spf, paramArray);
        await calculateFeatures(product.filters?.feature, paramArray, product.filters?.spf?.length > 0);
    } else if (categoryId === 27) {
        paramArray.push({
            '#': "Бальзам для губ",
            '@name': "Вид", '@paramid': "201106", '@valueid': "2312608"
        })
        await calculateClassifications(product.filters?.classification, paramArray)
        await calculateSPF(product.filters?.spf, paramArray);
        await calculateFormulas(product.filters?.spf, paramArray);
        await calculateSkinTypes(product.filters?.skin, paramArray);
        await calculatePurpose(product.filters?.purpose, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculateFeatures(product.filters?.feature, paramArray, product.filters?.spf?.length > 0);

    } else if (categoryId === 73 || categoryId === 29) {
        paramArray.push({
            '#': "Патчі",
            '@name': "Вид", '@paramid': "200636", '@valueid': "2265578"

        })
        paramArray.push({
            '#': categoryId === 29 ? "Зона навколо очей" : "Обличчя",
            '@name': "Сфера застосування",
            '@paramid': "200756",
            '@valueid': categoryId === 29 ? "2267114" : "2329888"
        })
        await calculateClassifications(product.filters?.classification, paramArray)
        await calculateFormulas(product.filters?.spf, paramArray);
        await calculateSkinTypes(product.filters?.skin, paramArray);
        await calculatePurpose(product.filters?.purpose, paramArray);
    } else if (categoryId === 40 || categoryId === 75 || categoryId === 30 || categoryId === 62) {
        paramArray.push({
            '#': product.product_categories.some(item => item.categoryId === 75) ? "Бальзам" : product.product_categories.some(item => item.categoryId === 30) ? "Флюїд" : "Крем",
            '@name': "Вид",
            '@paramid': "200666",
            '@valueid': product.product_categories.some(item => item.categoryId === 75) ? "2265776" : product.product_categories.some(item => item.categoryId === 30) ? "2265806" : "2265770"
        })

        paramArray.push({
            '#': product.product_categories.some(item => item.categoryId === 107) ? "Зона навколо очей" : "Обличчя",
            '@name': "Сфера застосування",
            '@paramid': "200756",
            '@valueid': product.product_categories.some(item => item.categoryId === 107) ? "2267114" : "2329888"
        })
        await calculateClassifications(product.filters?.classification, paramArray)
        await calculateSPF(product.filters?.spf, paramArray);
        await calculateFormulas(product.filters?.spf, paramArray);
        await calculateSkinTypes(product.filters?.skin, paramArray);
        await calculatePurpose(product.filters?.purpose, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculateFeatures(product.filters?.feature, paramArray, product.filters?.spf?.length > 0);
    } else if (categoryId === 32) {
        paramArray.push({
            '#': "Обличчя",
            '@name': "Сфера застосування", '@paramid': "200756", '@valueid': "2329888"
        })
        await calculateClassifications(product.filters?.classification, paramArray)
        await calculateFormulas(product.filters?.spf, paramArray);
        await calculateSkinTypes(product.filters?.skin, paramArray);
        await calculatePurpose(product.filters?.purpose, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
    } else if (categoryId === 49 || categoryId === 33) {
        paramArray.push({
            '#': product.name.toLowerCase().includes("тонер") ? "Тонер" : "Тонік",
            '@name': "Вид",
            '@paramid': "200540",
            '@valueid': product.name.toLowerCase().includes("тонер") ? "2265026" : "2265020"
        })
        await calculateClassifications(product.filters?.classification, paramArray)
        await calculateSPF(product.filters?.spf, paramArray);
        await calculateFormulas(product.filters?.spf, paramArray);
        await calculateSkinTypes(product.filters?.skin, paramArray);
        await calculatePurpose(product.filters?.purpose, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculateFeatures(product.filters?.feature, paramArray, product.filters?.spf?.length > 0);
    } else if (categoryId === 120 || categoryId === 119 || categoryId === 118 || categoryId === 117) {
        //216448	Вид	ComboBox	main	N/D	3236233	Маска
        // 216448	Вид	ComboBox	main	N/D	2796767	Тинт
        // 216448	Вид	ComboBox	main	N/D	2796788	Олівець
        // 216448	Вид	ComboBox	main	N/D	4086713	Маркер
        // 216448	Вид	ComboBox	main	N/D	2796760	Туш
        // 216448	Вид	ComboBox	main	N/D	2796753	Гель
        // 216448	Вид	ComboBox	main	N/D	4155490	Мило
        // 216448	Вид	ComboBox	main	N/D	2796809	Пудра
        // 216448	Вид	ComboBox	main	N/D	2796795	Тіні
        // 216448	Вид	ComboBox	main	N/D	3236239	Олія
        // 216448	Вид	ComboBox	main	N/D	2796774	Помада
        // 216448	Вид	ComboBox	main	N/D	3236245	Скраб
        // 216448	Вид	ComboBox	main	N/D	4124533	Крем
        // 216448	Вид	ComboBox	main	N/D	2796781	Коректор
        // 216448	Вид	ComboBox	main	N/D	2796802	Підводка
        // 216455	Тип	List	main	N/D	2796823	Для укладки
        // 216455	Тип	List	main	N/D	2796830	Фіксувальний
        // 216455	Тип	List	main	N/D	2796816	Відтінковий
        // 216729	Фініш	List	main	N/D	2846558	Вирівнювальна
        // 216729	Фініш	List	main	N/D	2846565	Глянцева
        // 216729	Фініш	List	main	N/D	2846607	Матова


        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculateColors(product.filters?.color, paramArray);
    } else if (categoryId === 36) {
        paramArray.push({
            '#': "Вода",
            '@name': "Вид", '@paramid': "200588", '@valueid': "2265284"
        })
        await calculateClassifications(product.filters?.classification, paramArray)
        await calculateFormulas(product.filters?.spf, paramArray);
        await calculateSkinTypes(product.filters?.skin, paramArray);
        await calculatePurpose(product.filters?.purpose, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculateFeatures(product.filters?.feature, paramArray, product.filters?.spf?.length > 0);
    } else if (categoryId === 45) {
        //200600	Тип	ComboBox	main	N/D	2265350	Масажна
        // 200600	Тип	ComboBox	main	N/D	2265356	Косметичне
        // 200600	Тип	ComboBox	main	N/D	2265362	Гідрофільне
        // 200600	Тип	ComboBox	main	N/D	2265368	Батер


    } else if (categoryId === 5) {
        paramArray.push({
            '#': "Косметична",
            '@name': "Тип", '@paramid': "201679", '@valueid': "2359915"
        })
        await calculateFormulas(product.filters?.spf, paramArray);
        await calculatePurposeBody(product.filters?.purpose, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
    } else if (categoryId === 7) {

        paramArray.push({
            '#': "Скраб",
            '@name': "Вид", '@paramid': "201703", '@valueid': "2360173"
            //Є 4 види
            //2360179	Пілінг
            // 2360173	Скраб
            // 2360185	Гомаж
            // 3398797	Убтан
        })
        await calculateFormulas(product.filters?.spf, paramArray);
        await calculateSkinTypes(product.filters?.skin, paramArray);
        await calculatePurposeBody(product.filters?.purpose, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
    } else if (categoryId === 99) {
        paramArray.push({
            '#': "Тіло",
            '@name': "Сфера застосування", '@paramid': "200756", '@valueid': "2703657"
        })

        paramArray.push({
            '#': "Крем",
            '@name': "Вид", '@paramid': "201500", '@valueid': "2357750"

            //201500	Вид	ComboBox	main	N/D	2403264	Пудра
            // 201500	Вид	ComboBox	main	N/D	2357750	Крем
            // 201500	Вид	ComboBox	main	N/D	2357756	Молочко
            // 201500	Вид	ComboBox	main	N/D	2357762	Бальзам
            // 201500	Вид	ComboBox	main	N/D	2357774	Гель
            // 201500	Вид	ComboBox	main	N/D	2357798	Лосьйон
            // 201500	Вид	ComboBox	main	N/D	3970163	Сироватка
            // 201500	Вид	ComboBox	main	N/D	4545747	Батер
            // 201500	Вид	ComboBox	main	N/D	3657996	Шимер
            // 201500	Вид	ComboBox	main	N/D	2357780	Мус
            // 201500	Вид	ComboBox	main	N/D	2357810	Мазь
            // 201500	Вид	ComboBox	main	N/D	2357804	Вазелін
            // 201500	Вид	ComboBox	main	N/D	2357786	Флюїд
            // 201500	Вид	ComboBox	main	N/D	3065063	Піна
            // 201500	Вид	ComboBox	main	N/D	2357792	Суфле
            // 201500	Вид	ComboBox	main	N/D	2357768	Емульсія
        })

        await calculateFormulas(product.filters?.spf, paramArray);
        await calculateSkinTypes(product.filters?.skin, paramArray);
        await calculatePurposeBody(product.filters?.purpose, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculateFeaturesBody(product.filters?.feature, paramArray);
    } else if (categoryId === 16) {
        paramArray.push({
            '#': "Гель",
            '@name': "Вид", '@paramid': "201763", '@valueid': "2360503"
        })
        await calculateFormulas(product.filters?.spf, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculatePurposeBody(product.filters?.purpose, paramArray);
    } else if (categoryId === 20) {
        await calculateHairEffect(product.filters?.purpose, paramArray);
        await calculateHairTypes(product.filters?.hair, paramArray);
        await calculateFeaturesHair(product.filters?.feature, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculatePurposeHair(product.filters?.purpose, paramArray);
    } else if (categoryId === 21) {
        paramArray.push({
            '#': "Кондиціонер",
            '@name': "Вид", '@paramid': "202806", '@valueid': "2427201"
        })
        await calculateHairEffect(product.filters?.purpose, paramArray);
        await calculateHairTypes(product.filters?.hair, paramArray);
        await calculateFeaturesHair(product.filters?.feature, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculatePurposeHair(product.filters?.purpose, paramArray)
    } else if (categoryId === 22 || categoryId === 77) {
        await calculateHairEffect(product.filters?.purpose, paramArray);
        await calculateHairTypes(product.filters?.hair, paramArray);
        await calculateFeaturesHair(product.filters?.feature, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculatePurposeHair(product.filters?.purpose, paramArray)
    } else if (categoryId === 23 || categoryId === 46) {
        await calculateHairEffect(product.filters?.purpose, paramArray);
        await calculateHairTypes(product.filters?.hair, paramArray);
        await calculateFeaturesHair(product.filters?.feature, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculatePurposeHair(product.filters?.purpose, paramArray)
    } else if (categoryId === 76 || categoryId === 4 || categoryId === 78) {
        paramArray.push({
            '#': product.product_categories.some(item => item.categoryId === 107) ? "Філер" : "Сироватка",
            '@name': "Вид",
            '@paramid': "202920",
            '@valueid': product.product_categories.some(item => item.categoryId === 107) ? "4269913" : "2426172"
        })
        await calculateHairEffect(product.filters?.purpose, paramArray);
        await calculateHairTypes(product.filters?.hair, paramArray);
        await calculateFeaturesHair(product.filters?.feature, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculatePurposeHair(product.filters?.purpose, paramArray)
    } else if (categoryId === 48 || categoryId === 63 || categoryId === 6) {
        await calculateHairEffect(product.filters?.purpose, paramArray);
        await calculateHairTypes(product.filters?.hair, paramArray);
        await calculateFeaturesHair(product.filters?.feature, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculatePurposeHair(product.filters?.purpose, paramArray)
    } else if (categoryId === 19) {
        await calculateFormulas(product.filters?.spf, paramArray);
        await calculatePurposeBody(product.filters?.purpose, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
    } else if (categoryId === 44) {
        paramArray.push({
            '#': "Крем",
            '@name': "Вид", '@paramid': "201883", '@valueid': "2371837"
        })
        paramArray.push({
            '#': "Зволожувальний,Поживний",
            '@name': "Призначення", '@paramid': "201901", '@valueid': "2372047,2372077"
        })
        paramArray.push({
            '#': "Швидко вбирається,Для зимового догляду",
            '@name': "Особливості", '@paramid': "201889", '@valueid': "2371903,2371897"
        })
        await calculateFormulas(product.filters?.spf, paramArray);
        await calculateSkinTypes(product.filters?.skin, paramArray);
    } else if (categoryId === 28 || categoryId === 72) {
        if (categoryId === 28) {
            paramArray.push({
                '#': "Скраб",
                '@name': "Вид", '@paramid': "200558", '@valueid': "2265128"
            })
        }
        await calculateClassifications(product.filters?.classification, paramArray)
        await calculatePurpose(product.filters?.purpose, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculateSkinTypes(product.filters?.skin, paramArray);
        await calculateFormulas(product.filters?.spf, paramArray);
    } else if (categoryId === 51) {
        paramArray.push({
            '#': "База під макіяж",
            '@name': "Вид", '@paramid': "216399", '@valueid': "2797061"
        })

        // 216729	Ефект	List	main	N/D	2846530	3D-ефект
        // 216729	Ефект	List	main	N/D	2846558	Вирівнювальна
        // 216729	Ефект	List	main	N/D	2846586	Коригувальна
        // 216729	Ефект	List	main	N/D	2846600	Матувальна
        // 216729	Ефект	List	main	N/D	2846628	Освітлювальна
        // 216729	Ефект	List	main	N/D	2846670	Зволожувальна
        // 216729	Ефект	List	main	N/D	3463003	Фіксувальна
        // 216729	Ефект	List	main	N/D	2846544	Блюр-ефект


        await calculateTextures(product.filters?.texture, paramArray);
        await calculateColors(product.filters?.color, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
    } else if (categoryId === 54) {
        paramArray.push({
            '#': "Косметичний",
            '@name': "Вид подарункового набору", '@paramid': "257807", '@valueid': "4762895"
        })

        await calculateClassifications(product.filters?.classification, paramArray)
        await calculateFormulas(product.filters?.spf, paramArray);
        await calculateSkinTypes(product.filters?.skin, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
    } else if (categoryId === 55) {
        paramArray.push({
            '#': "Подарункова упаковка",
            '@name': "Упаковка", '@paramid': "202998", '@valueid': "4562889"
        })
        paramArray.push({
            '#': "Подарунковий",
            '@name': "Особливості", '@paramid': "202992", '@valueid': "2426478"
        })
        await calculateFormulas(product.filters?.spf, paramArray);
        await calculateHairTypes(product.filters?.hair, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculatePurposeHair(product.filters?.purpose, paramArray)
    } else if (categoryId === 66) {
        paramArray.push({
            '#': "Обличчя",
            '@name': "Сфера застосування", '@paramid': "200756", '@valueid': "2329888"
        })
        paramArray.push({
            '#': "Для солярію,Для засмаги",
            '@name': "Призначення", '@paramid': "202668", '@valueid': "2413926,2413932"
        })
        await calculateClassifications(product.filters?.classification, paramArray)
        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculateSkinTypes(product.filters?.skin, paramArray);
        await calculateFormulas(product.filters?.spf, paramArray);
        await calculateSPF(product.filters?.spf, paramArray);
        await calculateFeatures(product.filters?.feature, paramArray, product.filters?.spf?.length > 0);
    } else if (categoryId === 70) {
        paramArray.push({
            '#': "BB-крем",
            '@name': "Вид", '@paramid': "216420", '@valueid': "2796991"
        })

        await calculateSkinTypes(product.filters?.skin, paramArray);
        await calculateColors(product.filters?.color, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
    } else if (categoryId === 98) {
        paramArray.push({
            '#': "Спрей",
            '@name': "Вид", '@paramid': "201745", '@valueid': "2360443"
        })
        await calculateSprayEffect(product.filters?.purpose, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculateFormulas(product.filters?.spf, paramArray);
    } else if (categoryId === 123) {
//216476	Вид	ComboBox	main	N/D	2795115	Тінт-блиск
// 216476	Вид	ComboBox	main	N/D	2795136	Тінт-фломастер
// 216476	Вид	ComboBox	main	N/D	3653506	Тинт-кушон
// 216476	Вид	ComboBox	main	N/D	2795122	Тінт-бальзам

        await calculateTextures(product.filters?.texture, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculateColors(product.filters?.color, paramArray);
    } else if (categoryId === 121) {
        if(product.filters?.purpose.some(item=> item.id === 987)) {
            paramArray.push({
                '#': "Для збільшення губ",
                '@name': "Призначення", '@paramid': "216722", '@valueid': "2806827"
            })
        }

// Вид	List	main	N/D	2846530	3D-ефект
// Вид	List	main	N/D	2846558	Вирівнювальна
// Вид	List	main	N/D	2846565	Глянцева
// Вид	List	main	N/D	2846607	Матова
// Вид	List	main	N/D	2846642	Перламутрова
// Вид	List	main	N/D	2846656	Сатинова
// Вид	List	main	N/D	2846691	Шиммерна

        await calculateFormulas(product.filters?.spf, paramArray);
        await calculateTextures(product.filters?.texture, paramArray);

        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculateColors(product.filters?.color, paramArray);
    } else if (categoryId === 122) {
        paramArray.push({
            '#': "Для збільшення губ",
            '@name': "Призначення", '@paramid': "216722", '@valueid': "2806827"
        })
        // 216729	Вид	List	main	N/D	2846530	3D-ефект
        // 216729	Вид	List	main	N/D	2846558	Вирівнювальна
        // 216729	Вид	List	main	N/D	2846565	Глянцева
        // 216729	Вид	List	main	N/D	2846607	Матова


        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculateColors(product.filters?.color, paramArray);
    } else if (categoryId === 124) {
//216729	Фініш	List	main	N/D	2846558	Вирівнювальна
// 216729	Фініш	List	main	N/D	2846565	Глянцева
// 216729	Фініш	List	main	N/D	2846607	Матова
// 216736	Основа	List	main	N/D	2846495	Силіконова
// 216736	Основа	List	main	N/D	2846425	Воскова
// 216736	Основа	List	main	N/D	2846439	Гелева
// 216736	Основа	List	main	N/D	2846460	Кремова
// 216736	Основа	List	main	N/D	2846481	Плівка

        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculateColors(product.filters?.color, paramArray);
    } else if (categoryId === 113) {
        //216434	Ефект	List	main	N/D	4887414	3D
        // 216434	Ефект	List	main	N/D	2796844	Об'ємний
        // 216434	Ефект	List	main	N/D	2796872	Накладних вій
        // 216434	Ефект	List	main	N/D	2796837	Подовжуючий
        // 216434	Ефект	List	main	N/D	2796851	Підкручувальний
        // 216434	Ефект	List	main	N/D	4887419	4D
        await calculateEcoTrends(product.filters?.feature, paramArray);
    } else if (categoryId === 114) {
        //216729	Фініш	List	main	N/D	2846558	Вирівнювальна
        // 216729	Фініш	List	main	N/D	2846607	Матова
        // 216729	Фініш	List	main	N/D	2846614	Металік
        // 216729	Фініш	List	main	N/D	2846642	Перламутрова
        // 216729	Фініш	List	main	N/D	2846656	Сатинова
        // 216729	Фініш	List	main	N/D	2846691	Шиммерна

        await calculateTextures(product.filters?.texture, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculateColors(product.filters?.color, paramArray);
    } else if (categoryId === 115) {
        //216729	Фініш	List	main	N/D	2846621	Неонова
        // 216729	Фініш	List	main	N/D	2846558	Вирівнювальна
        // 216729	Фініш	List	main	N/D	2846565	Глянцева
        // 216729	Фініш	List	main	N/D	2846607	Матова

        await calculateTextures(product.filters?.texture, paramArray);
        await calculateColors(product.filters?.color, paramArray);
    } else if (categoryId === 116) {
//216729	Фініш	List	main	N/D	2846558	Вирівнювальна
// 216729	Фініш	List	main	N/D	2846565	Глянцева
// 216729	Фініш	List	main	N/D	2846607	Матова
// 216729	Фініш	List	main	N/D	2846614	Металік
// 216729	Фініш	List	main	N/D	2846642	Перламутрова
// 216729	Фініш	List	main	N/D	2846691	Шиммерна


        //216462	Вид	ComboBox	main	N/D	2796732	Механічний олівець
        // 216462	Вид	ComboBox	main	N/D	2796746	Стругачка для олівця
        // 216462	Вид	ComboBox	main	N/D	2796739	Олівець-кайал
        // 216462	Вид	ComboBox	main	N/D	4883619	Класичний олівець
        await calculateTextures(product.filters?.texture, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculateColors(product.filters?.color, paramArray);
    } else if (categoryId === 125) {
        //216406	Вид	ComboBox	main	N/D	2797019	Тональний крем
        // 216406	Вид	ComboBox	main	N/D	2797040	Тональна основа
        // 216406	Вид	ComboBox	main	N/D	2797012	Тональний флюїд
        // 216406	Вид	ComboBox	main	N/D	2797026	Тональний мус
        // 216406	Вид	ComboBox	main	N/D	4891779	Тональний кушон

        await calculateFormulas(product.filters?.spf, paramArray);
        await calculateSkinTypes(product.filters?.skin, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
    } else if (categoryId === 130 || categoryId === 131) {
        paramArray.push({
            '#': categoryId === 130 ? "Консилер" : "Коректор",
            '@name': "Вид",
            '@paramid': "216371",
            '@valueid': categoryId === 130 ? "2794408" : "2794394"
        })

        // 216722	Призначення	List	main	N/D	4889829	Від темних кіл
        // 216722	Призначення	List	main	N/D	2806799	Для стробінгу
        // 216722	Призначення	List	main	N/D	2806806	Для контурингу
        // 216722	Призначення	List	main	N/D	4889844	Від почервоніння
        // 216722	Призначення	List	main	N/D	4889859	Від пігментних плям

        // 216729	Ефект	List	main	N/D	2846558	Вирівнювальна
        // 216729	Ефект	List	main	N/D	2846586	Коригувальна
        // 216729	Ефект	List	main	N/D	2846600	Матувальна
        // 216729	Ефект	List	main	N/D	2846628	Освітлювальна

        await calculateSkinTypes(product.filters?.skin, paramArray);
        await calculateTextures(product.filters?.texture, paramArray);

        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculateColors(product.filters?.color, paramArray);
    } else if (categoryId === 129) {
        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculateSkinTypes(product.filters?.skin, paramArray);
    } else if (categoryId === 126) {

        await calculateTextures(product.filters?.texture, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculateColors(product.filters?.color, paramArray);
    } else if (categoryId === 128 || categoryId === 127) {
        if (categoryId === 128) {
            paramArray.push({
                '#': "Хайлайтер",
                '@name': "Вид",
                '@paramid': "216392",
                '@valueid': "2794786"
            })
        }
//216392	Вид	ComboBox	main	N/D	2794772	Люмінайзер
// 216392	Вид		2794786	Хайлайтер
// 216392	Вид	ComboBox	main	N/D	2794800	Шимер


        await calculateTextures(product.filters?.texture, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculateColors(product.filters?.color, paramArray);
    } else if (categoryId === 105) {

    } else if (categoryId === 71 || categoryId === 65 || categoryId === 35 || categoryId === 96 || categoryId === 74) {
        paramArray.push({
            '#': product.product_categories.some(item => item.categoryId === 65) ? "Пінка"
                : product.product_categories.some(item => item.categoryId === 35) ? "Пудра"
                    : product.product_categories.some(item => item.categoryId === 74) ? "Гель" : "",
            '@name': "Вид",
            '@paramid': "202920",
            '@valueid': product.product_categories.some(item => item.categoryId === 65) ? "2265620"
                : product.product_categories.some(item => item.categoryId === 35) ? "2317774"
                    : product.product_categories.some(item => item.categoryId === 74) ? "2265614" : ""
        })

        await calculatePurpose(product.filters?.purpose, paramArray);
        await calculateEcoTrends(product.filters?.feature, paramArray);
        await calculateSkinTypes(product.filters?.skin, paramArray);
        await calculateFeatures(product.filters?.feature, paramArray, product.filters?.spf?.length > 0);
        await calculateFormulas(product.filters?.spf, paramArray);
    }

}

module.exports = CosmeticsParam;
