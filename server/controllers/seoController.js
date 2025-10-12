const {Seo} = require("../models/models");
const apiError = require("../error/apierror");
const TelegramMsg = require("../functions/TelegramMsg");
const axios = require("axios");

class seoController {

    async getSeo(req, res,next) {
        try {
            const url = req.body.url.replace("http://localhost:3000", "").replace("https://lamiya.com.ua", "")
            const seo = await Seo.findOne({
                where: {url},
                attributes: ['title', 'keywords', 'desc']
            });
            if (seo) {
                return res.json(seo);
            } else {
                await Seo.findOne({
                    where: {url: "/"},
                    attributes: ['title', 'keywords', 'desc']
                }).then((seoData) => {
                    return res.json(seoData);
                })
            }
        } catch (e) {
            TelegramMsg("TECH",`getSeo ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async importSeoFromGoogle(req, res,next) {
        try {
            const spreadsheetId = '1HoGRbqiehSg0kOk5-f_UsKai9_G5pFPqbG5lwVE8E3s';
            const range = 'import!A2:E501';
            const accessToken = 'AIzaSyAzqiaT5VyygmU_HVvdJnt6pmuue7RfcvA';
            let createCount = 0;
            let updateCount = 0;
            const {data} = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${accessToken}`, {})
            for(let i=0; i<data.values.length; i++){
                const item = data.values[i];
                if(item[0].startsWith('/') && item[1].length !== 0 && item[2].length !== 0){
                    const seo = await Seo.findOne({
                        where: {url: item[0]}
                    })
                    if(seo){
                        updateCount++;
                        await Seo.update(
                            {
                                url:item[0],
                                title:item[1],
                                desc:item[2],
                                header:item[3],
                                keywords:item[4]
                            },
                            {where: {id:seo.id}}
                        )
                    }else{
                        createCount++;
                        await Seo.create(
                            {
                                url:item[0],
                                title:item[1],
                                desc:item[2],
                                header:item[3],
                                keywords:item[4]
                            }
                        )
                    }
                }else{
                    if(!item[0].startsWith('/') ){
                        return next(apiError.badRequest(`Не правильна URL в рядку №${i + 2}`));
                    }else if(item[1].length === 0){
                        return next(apiError.badRequest(`Пустий тайтл в рядку №${i + 2}`));
                    }else if(item[2].length === 0){
                        return next(apiError.badRequest(`Пустий опис в рядку №${i + 2}`));
                    }

                }
            }
            return res.json(`Успішне завантаження. Оновлено ${updateCount} рядків. Створено ${createCount} нових рядків`);
        } catch (e) {
            TelegramMsg("TECH",`importSeoFromGoogle ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async getSeoList(req, res,next) {
        try {
            const seo = await Seo.findAll({
                order:[['id', 'DESC']]
            });
            return res.json(seo);
        } catch (e) {
            TelegramMsg("TECH",`getSeoList ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }
    async seoEdit(req, res,next) {
        try {
            const {id,url,title,desc,keywords,article,header} = req.body
            if(url.length > 255 || title.length > 255 || desc.length > 1000 || keywords.length > 1000 || article.length > 10000 || header.length > 255){
                return res.status(401).json({message: "field length exceeded"})
            }
            const seo = await Seo.update(
                {
                    url,
                    title,
                    desc,
                    keywords,
                    article,
                    header
                },
                {where: {id}}
            )
            return res.json("edited");
        } catch (e) {
            TelegramMsg("TECH",`seoEdit ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async seoCreate(req, res,next) {
        try {
            const {url,title,desc,keywords,article,header} = req.body
            if(url.length > 255 || title.length > 255 || desc.length > 1000 || keywords.length > 1000 || article.length > 10000 || header.length > 255){
                return res.status(401).json({message: "field length exceeded"})
            }
           const seo = await Seo.create(
                {
                    url,
                    title,
                    desc,
                    keywords,
                    article,
                    header
                }
            )
            return res.json(seo);
        } catch (e) {
            TelegramMsg("TECH",`seoCreate ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

}

module.exports = new seoController();
