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
            maxRedirects: 0,
            validateStatus: (status) => status >= 200 && status < 400,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            }
        })
        const redirectUrl = page.headers.location;
        console.log('Redirect URL:', redirectUrl);

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