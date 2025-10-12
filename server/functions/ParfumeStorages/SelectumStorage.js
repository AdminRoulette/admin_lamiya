const axios = require("axios");
const xlsx = require('xlsx');

async function SelectumStorage() {
    try {
        let List = [];
        const SkipKeywords = ['целофан',"прим'яті"];
        const response = await axios.get('https://selectum.com.ua/files/Price.xlsx', {
            responseType: 'arraybuffer'
        });
        if (!response.data) {
            throw new Error("Файл складу парфумів відсутній")
        }
        const buf = Buffer.from(response.data);
        const wb = xlsx.read(buf);
        const ws = wb.Sheets[wb.SheetNames[0]];
        const ExcelPage = xlsx.utils.sheet_to_json(ws, {header: 1});

        for (let b = 4; b < ExcelPage.length; b++) {
            if (ExcelPage[b].length < 3) continue;

            const price = (+ExcelPage[b][8]*0.95).toFixed(2)
            const code = `sel-${ExcelPage[b][2]}`
            let name = ExcelPage[b][5] ? ExcelPage[b][4].split(ExcelPage[b][5])[0].trim() : ExcelPage[b][4];
            const tester = ExcelPage[b][4].toLowerCase().includes('тестер')

            const hasMatch = SkipKeywords.some(word => ExcelPage[b][4].includes(word));
            if(hasMatch) continue;

            const type = ExcelPage[b][6] === 'edp' || ExcelPage[b][6] === 'elixir de parfum' ? "Парфумована вода"
                : ExcelPage[b][6] === 'edt' ? "Туалетна вода"
                    : ExcelPage[b][6] === 'edc' || ExcelPage[b][6] === 'cologne' || ExcelPage[b][6] === "cologne intense" ? "Одеколон"
                        :ExcelPage[b][6] === 'extrait de parfum' ? "Екстракт"
                            :ExcelPage[b][6] === 'parfum' ? "Парфуми"
                                : ""

            const regex = /\b(\d+(?:[.,]\d+)?)\s?(ml|g)\b/i;
            const match = ExcelPage[b][7] ? ExcelPage[b][7].match(regex) : null;
            let weight = match ? parseFloat(match[1].replace(',', '.')) : null;

            if(name.includes("змінний блок")){
                name += "Рефіл"
            }


            List.push({price, code, list: `sel`, type, weight, tester, full_name:ExcelPage[b][4], name})
        }

        return List;
    } catch (error) {
        throw new Error(`SelectumStorage: ${error.message}`);
    }
}

module.exports = SelectumStorage;