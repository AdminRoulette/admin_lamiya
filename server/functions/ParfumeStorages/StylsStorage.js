const TelegramMsg = require("../TelegramMsg");
const axios = require("axios");
const xlsx = require('xlsx');

async function StylsStorage() {
    try {
        const response = await axios.get('https://styls.com.ua/uploads/styls_PRICE_original.xls', {
            responseType: 'arraybuffer'
        });
        let List = [];
        const SkipKeywords = ['брак', 'примятые', 'декод', 'целофан','недолив',"без упаковки", "пломба", "підтікає", "примятий"];

        let course = 0;
        if (!response.data) {
            throw new Error("Файл складу парфумів відсутній")
        }
        const buf = Buffer.from(response.data);
        const wb = xlsx.read(buf);
        for (let i = 0; i < wb.SheetNames.length; i++) {

            const ExcelList = wb.SheetNames[i];
            const ws = wb.Sheets[ExcelList];
            const ExcelPage = xlsx.utils.sheet_to_json(ws, {header: 1});

            const index = ExcelList === 'НАЯВНІСТЬ Exclusive' ? 1 : 0 // +1

            if (!course) course = +ExcelPage[2][4];
            if (typeof course !== 'number' || course > 70 || course < 25) throw new Error(`Проблема з курсом $. Курс: ${course}`)

            for (let b = 8; b < ExcelPage.length; b++) {
                if (ExcelPage[b].length < 3 || !ExcelPage[b][1 + index]) continue;

                const price = Number(ExcelPage[b][2 + index]).toFixed(2)
                const code = `s${i}-${ExcelPage[b][0]}`
                let name = ExcelPage[b][1 + index];

                const hasMatch = SkipKeywords.some(word => name.includes(word));
                if (hasMatch) continue;

                const type =
                    //     : name.includes("mini ") || name.includes("Mini ") || name.includes("віалка ") || name.includes("vial ") ? "Мініатюра"
                    name.includes("парфумована вода") || name.includes("парфюмерная вода") || name.includes(" edp ") ? "Парфумована вода"
                        : name.includes("туалетна вода") || name.includes("туалетная вода") || name.includes(" edt ") ? "Туалетна вода"
                            : name.includes("одеколон") || name.includes(" edc ") ? "Одеколон"
                                : name.includes("екстракт де парфум") || name.includes(" extrait ") ? "Екстракт"
                                    : name.includes("духи") ? "Парфуми"
                                        : name.includes(" set ") || name.includes("*набір") || name.includes("3*11") || name.includes("5*11") ? "Набір"
                                            : name.includes(" deo ") ? "Дезодорант"
                                                : name.includes(" candle ") ? "Свічка"
                                                    : name.includes(" body mist ") ? "Спрей для тіла"
                                                        : name.includes(" body lotion ") ? "Лосьйон для тіла"
                                                                    :name.includes(" wash ") ? "Гель для душа"
                                                                        :name.includes(" soap ") ? "Мило"
                                                            : ""
                const tester = name.toLowerCase().includes('tester') || name.toLowerCase().includes('тестер')
                const regex = /\b(\d+(?:[.,]\d+)?)\s?ml\b/i;
                const match = name.match(regex);
                let weight = match ? parseFloat(match[1].replace(',', '.')) : null;
                if (!weight) {
                    const match2 = name.match(/\d+/);
                    weight = match2 ? parseFloat(match2[0].replace(',', '.')) : null;
                }


                if (i === 1) {
                    if (name.includes(" edt ")) {
                        name = name.split(" edt ")[0]
                    } else if (name.includes(" edp ")) {
                        name = name.split(" edp ")[0]
                    } else if (name.includes(" edc ")) {
                        name = name.split(" edc ")[0]
                    } else if (name.includes(" parfum ")) {
                        name = name.split(" parfum ")[0]
                    } else if (name.includes(" extrait de parfum ")) {
                        name = name.split(" parfum ")[0]
                    }
                } else {
                    if (name.includes("(унисекс)")) {
                        name = name.split("(унисекс)")[0]
                    } else if (name.includes("(женские)")) {
                        name = name.split("(женские)")[0]
                    } else if (name.includes("(мужские)")) {
                        name = name.split("(мужские)")[0]
                    } else if (name.includes("(унісекс)")) {
                        name = name.split("(унісекс)")[0]
                    } else if (name.includes("(жіночі)")) {
                        name = name.split("(жіночі)")[0]
                    } else if (name.includes("(чоловічі)")) {
                        name = name.split("(чоловічі)")[0]
                    }
                }


                if(ExcelPage[b][1 + index].toLowerCase().includes("*refill") || ExcelPage[b][1 + index].toLowerCase().includes(" refill")){
                    name += " Рефіл"
                }

                List.push({
                    price,
                    code,
                    list: `s${i}`,
                    type,
                    weight,
                    tester,
                    name: name.trim(),
                    full_name: ExcelPage[b][1 + index]
                })
            }
        }

        return {data: List, course: course};
    } catch (error) {
        throw new Error(`StylsStorage: ${error.message}`);
    }
}

module.exports = StylsStorage;