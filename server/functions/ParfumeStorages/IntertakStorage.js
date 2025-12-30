const TelegramMsg = require("../TelegramMsg");
const axios = require("axios");
const xlsx = require('xlsx');
const fs = require("fs");
const iconv = require("iconv-lite");
const {create} = require("xmlbuilder2");

async function IntertakStorage() {
    try {
        let List = [];
        const SkipKeywords = [];

        const {data} = await axios.get('https://www.intertak.com.ua/promua.xml', {
            responseType: 'arraybuffer'
        });
        if (!data) {
            throw new Error("Файл складу intertak відсутній")
        }

        const xml = iconv.decode(Buffer.from(data), 'win1251');

        const doc = create(xml);
        const obj = doc.end({format: 'object'});
        const offers = obj.yml_catalog.shop.offers.offer

        for (let i = 0; i < offers.length; i++) {
                if(offers[i]?.['@'] ? offers[i]["@"].available === "false" : offers[i]["@available"] === "false") {
                    continue;
                }
                const stock = offers[i]?.['@'] ? offers[i]['@'].quantity_in_stock : offers[i]['@quantity_in_stock']
                if(!stock || stock === 0) {
                    continue;
                }
                const price = offers[i]?.['#'] ? Number(offers[i]['#'][5].price * 0.75).toFixed(2) : Number(offers[i].price* 0.75).toFixed(2)
                const code = offers[i]?.['@'] ? offers[i]['@'].id : offers[i]['@id']
                let name = offers[i]?.['#'] ? offers[i]['#'][0].name : offers[i].name

                const hasMatch = SkipKeywords.some(word => name.includes(word));
                if (hasMatch) continue;

                List.push({
                    price:+price,
                    code:`luc-${code}`,
                    list: `luc`,
                    name: name,
                })
        }

        return List;
    } catch (error) {
        throw new Error(`IntertakStorage: ${error.message}`);
    }
}

module.exports = IntertakStorage;