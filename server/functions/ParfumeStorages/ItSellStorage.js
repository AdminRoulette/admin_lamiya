const TelegramMsg = require("../TelegramMsg");
const axios = require("axios");
const xlsx = require('xlsx');
const fs = require("fs");
const iconv = require("iconv-lite");
const {create} = require("xmlbuilder2");

async function ItSellStorage() {
    try {
        let List = [];
        const SkipKeywords = [];
        const page = await axios.get('https://itsellopt.ua/price_list', {
            responseType: 'text',
            validateStatus: () => true
        })
        console.log(page.request._header)
        console.log(page.request.path)
        console.log(page.request.res.responseUrl)
        console.log(page.request._redirectable._currentUrl)

        return
        const filePath = page.request.res.responseUrl
        const fixed = decodeURIComponent(escape(filePath));

        const response = await axios.get(`${encodeURI(fixed)}`, {
            responseType: 'arraybuffer'
        });
        if (!response.data) {
            throw new Error("Файл складу ItSell відсутній")
        }

        const buf = Buffer.from(response.data);
        const wb = xlsx.read(buf);
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

                const hasMatch = SkipKeywords.some(word => name.includes(word));
                if (hasMatch) continue;

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