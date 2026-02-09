const TelegramMsg = require("../TelegramMsg");
const axios = require("axios");
const xlsx = require('xlsx');
const fs = require("fs");
const iconv = require("iconv-lite");
const {create} = require("xmlbuilder2");


async function ItSellStorage() {
    try {

        const filePath = './storage-files/it.xls';
        const buffer = fs.readFileSync(filePath);

        let List = [];
        const SkipKeywords = [];

        if (!buffer) {
            throw new Error("Файл складу парфумів відсутній")
        }
        const buf = Buffer.from(buffer);
        const wb = xlsx.read(buf, {
            type: 'buffer',
            cellDates: true,
            cellNF: false,
            cellText: false
        });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const ExcelPage = xlsx.utils.sheet_to_json(ws, {header: 1});
        for (let i = 8; i < ExcelPage.length; i++) {
                if(!ExcelPage[i][0]) {
                    continue;
                }

                const price = Number(ExcelPage[i][10]).toFixed(2)
                const sell_price = Number(ExcelPage[i][11]).toFixed(2)
                const code = ExcelPage[i][0]
                let name = ExcelPage[i][3]

                // const hasMatch = SkipKeywords.some(word => name.includes(word));
                // if (hasMatch) continue;

                List.push({
                    price,
                    sell_price,
                    code:`it-${code}`,
                    list: `it`,
                    name: name,
                })
        }

        return List;
    } catch (error) {
        throw new Error(`ItSellStorage: ${error.message}`);
    }
}

module.exports = ItSellStorage;