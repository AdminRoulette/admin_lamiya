async function StorageProductCheck(optionWeight, excelInfo, option) {

    const optionTester = option.optionName.toLowerCase().includes("тестер")

    function levenshteinDistance(str1, str2) {
        const len1 = str1.length;
        const len2 = str2.length;
        const dp = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(null));

        for (let i = 0; i <= len1; i++) {
            dp[i][0] = i;
        }
        for (let j = 0; j <= len2; j++) {
            dp[0][j] = j;
        }

        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                dp[i][j] = Math.min(dp[i - 1][j] + 1,    // Видалення
                    dp[i][j - 1] + 1,    // Вставка
                    dp[i - 1][j - 1] + cost // Заміна
                );
            }
        }

        return dp[len1][len2];
    }

    function isSimilar(str1, str2, thresholdPercentage) {
        let fixedStr1;
        let fixedStr2 = str2;
        if (str1.includes('(M)') || str1.includes('(L)') || str1.includes('(U)') || str1.includes("(L\\M)")) {
            const match = str1.match(/^[A-Z\s&0-9/`.]+?(?=\s[a-z])/);
            fixedStr1 = match ? match[0].toLowerCase().replace(`${option.device.brand.name.toLowerCase()}`, "").replace("  ", " ").trim() : '';
        } else {
            fixedStr1 = str1.toLowerCase().split(" (")[0].replace(" *тестер", "")
                .replace(`${option.device.brand.name.toLowerCase()}`, "").replace("  ", " ").trim();
        }
        if (fixedStr2.includes("eau de parfum")) {
            fixedStr1 = fixedStr1.replace("eau de parfum", "")
            fixedStr2 = fixedStr2.replace("eau de parfum", "")
        }

        const distance = levenshteinDistance(fixedStr1, fixedStr2);
        const maxLength = Math.max(fixedStr1.length, fixedStr2.length);
        let differencePercentage = (distance / maxLength) * 100;
        if (differencePercentage > thresholdPercentage) {

            const replacements = {
                'guilty 2021':"guilty pour femme",
                "paris baccarat rouge 540":"baccarat rouge 540",
                "№ 4 candy":"no. 4 Apres Candy",
                "k":"k pour homme",
                "a.banderas the icon":"the icon the perfume",
                "ysl libre l'absolu platine":"libre absolu platine",
                "ferragamo amo per lei":"amo ferragamo per lei",
                "molecule № 8":"molecule no. 8",
                "l'insoumis":"l'insomius",
                "ysl l'homme la nuit le parfum":"la nuit de l'homme le parfum",
                "ysl l'homme":"l'homme",
                "№ 4 sport":"no. 4 apres l'amour sport",
                "1888": "casamorati 1888",
                "armani acqua di gio edp": "acqua di gio",
                "e.m 01 molecules+iris": "molecule 01 + iris",
                "роз. уп": "for her eau de parfum",
                "чёрн.уп": "for her",
                "p.r. lady million gold": "million gold for her",
                "etat d*orange putan des palaces": "putain des palaces",
                "crystal bright": "bright crystal",
                "etat d*orange jasmine et cigarette": "jasmine et sigarette",
                "le vie di milano porta nuova": "le vie di milano aperitivo milanese porta nuova",
                "m.f.kurkdjian a la rose l'eau": "l'eau a la rose",
                "s. amo per lei": "amo ferragamo per lei",
                "e.m 01 molecules ginger new": "molecule 01 + ginger",
                "collection №3": "cloud collection no 3",
                "poudree": "narciso poudree",
                "e.m 03 molecules": "molecule 03",
                "blue de chanel pour homme - 2014": "bleu de chanel",
                "d&g k 2020": "k pour homme",
                "l'interdit eau de parfum rouge 2021": "l'interdit rouge",
                "pour homme blue label": "blue label pour homme",
                "d&g the one for men": "the one for men eau",
                "p.r. 1 milion homme gold 2024": "million gold for him",
                "seduction in black": "black seduction",
                "intense roses musk": "roses musk intense",
                "paco phantom elixir": "phantom elixir parfum intense",
                "a.banderas blue seduction": "blue seduction woman",
                "roberto cavalli sweet ferocious 2024": "ego stratis",
                "the icon": "the icon the perfume",
                "p.r. 1 milion homme elixir": "1 milion elixir",
                "e.m 01 escentric": "escentric 01",
                "love dont be shy extreme refill  парфюмерная вода 100ml": "love don’t be shy extreme",
                "r.c. cavalli just": "just cavalli for her",
                "red wood": "wood red pour femme",
                "be extra delicious": "be delicious extra",
                "party love": "party love limited",
                "hypnotic poison": "poison hypnotic",
                "crystal bright absolu -": "bright crystal absolu",
                "c/d addict": "addict",
                "molecules 02": "escentric 02",
                "e.m 01 molecules guaiac": "molecule 01 + guaiac wood",
                "l'eau d'issey fusion": "fusion d'issey",
                "guilty": "guilty pour femme",
                "l'eau d'issey men": "l'eau d'issey pour homme",
                "4 apres l'amour candy": "no. 4 apres candy",
                "eau de lacoste l.12.12 eau de toilette rose eau fraiche for her": "l.12.12 rose eau fraiche",
                "hawai": "insence ultramarine hawaii",
                "ck euphoria": "euphoria man",
                "crystal noir - с крышкой": "crystal noir",
                "eau de blanc eau intense l.12.12": "l.12.12 blanc eau intense",
                "black phantom": "black phantom \"memento mori\"",
                "musc noir for her rose new": "musc noir rose",
                "opium black glitter": "black opium glitter",
                "cristal": "narciso cristal",
                "no.4 sport": "no. 4 apres l'amour sport",
                "essential": "essential for men",
                "la belle": "la belle le parfum",
                "blue de chanel pour homme": "bleu de chanel",
                "black": "black woman",
                "blue de chanel pour homme parfum": "bleu de chanel parfum",
                "hugo energise": "energise men",
                "boss jeans": "jeans man",
                "boss the scent le parfum": "the scent le parfum for her",
                "p.r. 1 milion homme": "one million",
                "for him bleu noir": "bleu noir",
                "attar fleur santal": "fleur de santal",
                "maison m. margiela beach walk": "replica beach walk",
                "c/d dior sport homme": "homme sport",
                "e.m 03 escentric": "escentric 03",
                "e.m 05 escentric": "escentric 05",
                "e.m 04 molecules": "molecule 04",
                "etat libre d'orange archives 69": "arcives 69",
                "l'homme la nuit le parfum": "la nuit de l'homme le parfum",
                "d&g k pour homme intense": "k intense",
                "c/d poison pure": "pure poison",
                "nobile la danza libellule": "la danza delle libellule",
                "no.4 neon": "no. 4 apres l'amour neon",
                "cedrat boise intense": "intence cedrat boise",
                "italica": "casamorati italica",
                "welton l'amour absolu": "l'amour absolu extract",
                "ck in 2 u for her": "in2u",
                "n 5": "no 5",
                "№5": "no 5",
                "c/d sauvage edp": "sauvage",
                "212 men heroes 2021": "212 men heroes forever young",
                "estee l. pleasure men": "pleasures for men",
                "d&g the one only 2": "the only one 2",
                "champs-elysees new design": "champs elysees",
                "etat d*orange sous le point mirabeu": "sous le pont mirabeau",
                "viva la fleur": "viva la juicy la fleur",
                "eau de noir l.12.12": "l.12.12 noir",
                "eau de blanc l.12.12": "l.12.12 blanc",
                "001": "001 eau de cologne",
                "chiap & chic -": "cheap and chic",
                "penhaligon's portraits the uncompromising sohan": "portraits sohan",
                "paco ultrared": "ultrared women",
                "roja scandal parfum pour homme cologne": "scandal pour homme",
                "laudano": "laudano nero",
                "intence men 2013": "man intense",
                "набір the ritual of ayurveda": "набір ritual (шампунь 50мл+кондиціонер 70мл+гель-пінка 70 мл+олійка 30 мл)",
                "shadow": "shadow for her",
                "набір the ritual of hammam": "набір ritual (пінка 50мл+крем 70мл+скраб 70мл+свічка)",
                "alexandre j royal": "le royal",
                "набір the ritual of karma": "набір ritual (крем 70мл+пінка 50мл+спрей 20мл+олійка 50мл)",
                "набір the ritual of sakura": "набір ritual (пінка 50мл+крем 70мл+шампунь 70мл+кондиціонер 70мл)",
                "etat libre d'orange i am trash - les fleurs du dechet": "i am trashles fleurs du dechet",
                "isle": "isle of man",
                "histories de parfums this is not a blue bottle": "this is not a blue bottle 1.1",
                "e.m 01 molecules+patchuli": "molecule 01 + patchouli",
                "e.m 01 molecules+mandarin": "molecule 01 + mandarin",
                "j. h. a g. vanila vibes": "vanilla vibes",
                "e.m 02 molecules": "molecule 02",
                "de parfum sweet explosion": "sweet xplosion",
                "art coll ruh zadeh & m.micallef": "ruh zadeh & martine micallef",
                "paris aqua media cologne forte": "aqua media forte",
                "roja elysium pour femme  парфюмерная вода 75ml": "roja elisium pour femme",
                "weekend": "weekend for woman",
                "muse": "the muse",
                "abercrombie&fitch 1892 blue for women": "first instinct blue women",
                "maison m. margiela jazz club": "replica jazz club",
                "ch": "ch men",
                "allure sport superleggera new   парфюмерная вода 100ml": "allure homme sport superleggera",
                "212 sexy": "212 sexy men",
                "c/d dune men": "dune pour homme",
                "sauvage": "sauvage parfum",
                "charmingly red": "charmingly red delicious",
                "e.m 01 molecules": "molecule 01",
                "e.m 05 molecules": "molecule 05",
                "e.m 01 molecules black tea new": "molecule 01 + black tea",
                "armani acqua di gio profondo": "acqua di gio profondo",
                "nobile ponteveccio woman": "pontevecchio",
                "armani si intense": "si intence",
                "irresistible eau de toilette fraiche": "irresistible fraiche",
                "eclat d'arpege mon eclat": "eclat mon eclat d'arpege",
                "eau de lacoste l.12.12 rose": "l.12.12 rose",
                "m.f.kurkdjian aqua vitae forte": "aqua vitae cologne forte",
                "xs black pour homme 2018": "black xs 2018",
                "amo": "amo ferragamo",
                "incanto bloom": "incanto bloom edition",
                "opium black le parfum": "black opium le parfum",
                "opium black": "black opium",
                "opium black over red": "black opium over red",
                "armani code parfum pour homme": "code parfume",
                "fahrenheit": "fahrenheit parfume",
                "naxos": "1861 naxos"
            }
            for (let key in replacements) {
                if (fixedStr1 === key) {
                    fixedStr1 = fixedStr1.replace(fixedStr1, replacements[key]);
                    break;
                }
            }

            const distance = levenshteinDistance(fixedStr1, fixedStr2);
            const maxLength = Math.max(fixedStr1.length, fixedStr2.length);
            differencePercentage = (distance / maxLength) * 100;
        }
        return differencePercentage <= thresholdPercentage;
    }


    if (!(excelInfo.name.toLowerCase().includes(option.device.name.toLowerCase())
        || isSimilar(excelInfo.name.trim(), option.device.name.toLowerCase().trim(), 40)
        || excelInfo.name.includes("Rituals Набір"))) {
        throw new Error("Ім'я")
    }

    if ((optionWeight !== excelInfo.weight) && excelInfo.weight) {
        throw new Error(`Вага ${optionWeight} !== ${excelInfo.weight}`)
    }

    if (!(!optionTester || excelInfo.tester)) {
        throw new Error("Тестер")
    }
    return excelInfo.price;
}

module.exports = StorageProductCheck;