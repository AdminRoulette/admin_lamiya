const {
    Blog, Device, Brand, ParfumePart, DeviceOptions, DeviceImage, BlogCategories, BlogAuthors, Season, Seo
} = require('../models/models');
const apiError = require("../error/apierror");
const TelegramMsg = require("../functions/TelegramMsg");
const S3 = require("aws-sdk/clients/s3");
const tinify = require("tinify");
const Transliterations = require("../functions/SearchComponents/Transliterations");
const {Op} = require("sequelize");
const GenerateRandomCode = require("../functions/Product/GenerateRandomCode");
const CalculateMonth = require("../functions/Product/CalculateMonth");
const UploadImages = require("../functions/Product/UploadImagesToAWS");

class blogController {

    async CreateArticle(req, res, next) {
        try {
            const {
                author_id,
                category_id,
                text,
                text_ru,
                header,
                sub_header,
                header_ru,
                sub_header_ru,
                popular,
                read_time,
                content_menu,
                content_menu_ru,
                faq_ru,
                faq
            } = req.body;

            if (header.length < 10 || sub_header.length < 10 || header_ru.length < 10 || sub_header_ru.length < 10 || text.length < 100 || text_ru.length < 10 || !content_menu || !content_menu_ru || !faq_ru || !faq || !author_id || !category_id || !req.files[0]) {
                return next(apiError.badRequest("Заповніть усі данні"));
            }

            let link = await Transliterations(header)
            link = link.replaceAll('---', '-').replaceAll('--', '-')

            let fileName = link + "-hq-" + ".webp";
            const basket = process.env.NODE_ENV === "production" ? "lamiya/blog/preview" : "lamiya/blog/dev";
            await UploadImages({
                name: fileName,
                basket: basket,
                file: req.files[0],
                size: 600
            })

            const blog = await Blog.create({
                author_id,
                category_id,
                text,
                text_ru,
                header,
                sub_header,
                header_ru,
                sub_header_ru,
                popular,
                content_menu,
                faq,
                content_menu_ru,
                faq_ru,
                image: basket.replace("lamiya", "https://lamiya.s3.eu-central-1.amazonaws.com") + "/" + fileName,
                read_time: Number(read_time),
                link: link,
                word_count: text.split(" ").length
            });

            await Seo.create({
                url: `/blog/${link}`, title: "", desc: "", keywords: ""
            })
            return res.json(blog);
        } catch (e) {
            TelegramMsg("TECH", "CreateArticle Blog")
            next(apiError.badRequest(e.message));
        }
    }

    async getProduct(req, res, next) {
        try {
            const {name} = req.query;
            let productList = [];
            const where = {
                active: true,
                [Op.or]: [{name: {[Op.iLike]: `%${name}%`}}, {'$device.id$': +name ? +name : 0}, {'$brand.name$': {[Op.iLike]: `%${name}%`}}, {'$device.series$': {[Op.iLike]: `%${name}%`}}]
            }
            let products = await Device.findAll({
                where,
                order: [[Brand, 'name', 'ASC']],
                include: [{model: Brand}]
            });
            for (const product of products) {
                productList.push({
                    id: product.id,
                    name: product.name,
                })
            }
            return res.json(productList)
        } catch (e) {
            TelegramMsg("TECH", `getProduct blog ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async EditArticle(req, res, next) {
        try {
            const {
                link,
                author_id,
                category_id,
                text,
                text_ru,
                header,
                sub_header,
                header_ru,
                sub_header_ru,
                popular,
                read_time,
                content_menu,
                content_menu_ru,
                faq_ru,
                faq
            } = req.body;

            if (header.length < 10 || sub_header.length < 10 || header_ru.length < 10 || !link || sub_header_ru.length < 10 || text.length < 100 || text_ru.length < 10 || !content_menu || !content_menu_ru || !faq_ru || !faq || !author_id || !category_id) {
                return next(apiError.badRequest("Заповніть усі данні"));
            }

            //delete old img and upload new

            const blog = await Blog.findOne({where: {link}});

            let new_link = link;
            const createdAt = new Date(blog.createdAt);
            const now = new Date();
            const diffInMilliseconds = now - createdAt;
            const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
            //Перевіряю чи пройшло 24 години, щоб не змінювати посилання (СЕО)
            if (diffInHours >= 24) {
                new_link = await Transliterations(header);
                await Seo.update({
                    url: `/blog/${new_link}`,
                }, {where: {url: `/blog/${link}`}})
            }
            let updateObj = {
                author_id,
                category_id,
                text,
                text_ru,
                header,
                sub_header,
                header_ru,
                sub_header_ru,
                popular,
                content_menu,
                faq,
                content_menu_ru,
                faq_ru,
                read_time: Number(read_time),
                link: new_link,
                word_count: text.split(" ").length
            }

            if (req.files?.length > 0) {
                let fileName = new_link + "-hq-" + ".webp";
                const s3folder = process.env.NODE_ENV === "production" ? "preview" : "dev";
                let basket = `lamiya/blog/${s3folder}`;
                const accessKeyId = process.env.S3_ACCESS_KEY
                const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
                let s3Link = blog.image.split(`/blog/${s3folder}/`)[1];
                const s3 = new S3({
                    region: 'eu-central-1', accessKeyId, secretAccessKey
                })
                s3.deleteObject({
                    Bucket: basket, Key: s3Link
                }, function (err, data) {})
                s3.deleteObject({
                    Bucket: basket, Key: s3Link.replace(".webp", ".jpg")
                }, function (err, data) {})
                s3.deleteObject({
                    Bucket: basket, Key: s3Link.replace("-hq-", "-lq-")
                }, function (err, data) {})
                await UploadImages({
                    name: fileName,
                    basket: basket,
                    file: req.files[0],
                    size: 600
                })
                updateObj.image = `https://lamiya.s3.eu-central-1.amazonaws.com/blog/${s3folder}/${fileName}`;
                updateObj.link = new_link;
            }

            if (blog) {
                Blog.update(updateObj, {where: {link}}).then((blog) => {
                    return res.json("done");
                });
            } else {
                return next(apiError.badRequest("Статю не знайдено"));
            }

        } catch (e) {
            TelegramMsg("TECH", "EditArticle Blog")
            next(apiError.badRequest(e.message));
        }
    }


    async getArticlesList(req, res, next) {
        try {
            let blog = await Blog.findAll({
                order:[['id','DESC']],
                include: [{
                    model: BlogAuthors, attributes: ['code', 'name']
                }, {
                    model: BlogCategories, attributes: ['code', 'name']
                }]
            });
            return res.json(blog);
        } catch (e) {
            TelegramMsg("TECH", "getList Blog")
            next(apiError.badRequest(e.message));
        }
    }


    async uploadImage(req, res, next) {
        try {
            let {name} = req.body;
            const images = req.files;
            let links = [];
            for (let i = 0; images.length > i; i++) {
                const s3Folder = process.env.NODE_ENV === "production" ? "images" : "dev";
                let fileName = `${await Transliterations(name)}` + "-hq-" + await GenerateRandomCode(4) + ".webp";
                await UploadImages({
                    name: fileName,
                    basket: `lamiya/blog/${s3Folder}`,
                    file: req.files[0],
                    size: 600
                })

                links.push({
                    src:  `https://lamiya.s3.eu-central-1.amazonaws.com/blog${s3Folder}/` + fileName
                })
            }
            return res.json(links)

        } catch (e) {
            TelegramMsg("TECH", `uploadImage Blog`)
            next(apiError.badRequest(e.message));
        }
    }

    async getArticle(req, res, next) {
        try {
            const {link} = req.query;
            const language = req.query.language === "true";

            if (!link) {
                return next(apiError.badRequest("Ід відсутнє"));
            }

            const blog = await Blog.findOne({
                where: {
                    link: link, // active:true
                },
                attributes: ['link', 'createdAt', 'popular', "header_ru", "header", "sub_header_ru", "sub_header", 'image', 'views_count', 'comments_count', 'word_count', 'read_time', "content_menu_ru", "content_menu", "faq_ru", "faq", 'text', 'text_ru'],
                include: [{
                    model: BlogAuthors, attributes: ['code', 'name']
                }, {
                    model: BlogCategories, attributes: ['code', 'name']
                }

                ]
            });
            if (!blog) {
                return next(apiError.badRequest("Статті не існує"));
            }
            let newDateReply = new Date(blog.createdAt);
            // return res.json({
            //     ...blog.dataValues,
            //     content_menu: JSON.parse(blog.content_menu),
            //     faq: JSON.parse(blog.faq),
            //     createdAt: `${newDateReply.getDate()} ${CalculateMonth(newDateReply.getMonth(), language)} ${newDateReply.getFullYear()}`
            // });
            return res.json({
                ...blog.dataValues,
                content_menu: JSON.parse(blog.content_menu),
                faq: JSON.parse(blog.faq),
                content_menu_ru: JSON.parse(blog.content_menu_ru),
                faq_ru: JSON.parse(blog.faq_ru),
                createdAt: `${newDateReply.getDate()} ${CalculateMonth(newDateReply.getMonth(), language)} ${newDateReply.getFullYear()}`
            });
        } catch (e) {
            TelegramMsg("TECH", `getArticle Blog ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async getProductsInfo(req, res, next) {
        try {
            const {ids} = req.query;
            let language = req.query.language === 'true';
            const productIds = ids.split(',');
            let productList = [];

            let products = await Device.findAll({
                where: {id: {[Op.in]: productIds}},
                attributes: [[`${language ? "name_ru" : "name"}`, 'name'],[`${language ? "series_ru" : "series"}`, 'series'], 'id'],
                order: [[DeviceOptions, DeviceImage, "index", "ASC"], [DeviceOptions, "index", "ASC"]],
                include: [
                    {
                        model: DeviceOptions,
                        attributes: [[`${language ? "optionName_ru" : "optionName"}`, 'optionName'], 'id', 'price', 'saleprice'],
                        required: true,
                        where: {[Op.or]: [{count: {[Op.gt]: 0}}, {sell_type: "preorder"}, {sell_type: "storage"}]},
                        include: [{model: DeviceImage, attributes: ["image"]}]
                    }]
            });
            if (products.length === 0) {
                return next(apiError.PreconditionFailed("Продукти не доступні"));
            }
            for (const product of products) {
                let options = [];
                for (const option of product.deviceoptions) {
                    options.push({
                        image:option.deviceimages[0]?.image,
                        optionName:option.optionName,
                        price:option.price,
                        saleprice:option.saleprice,
                        id:option.id,
                        gtin:option.gtin,
                    })
                }
                productList.push({
                    options,
                    id: product.id,
                    link: product.link,
                    name: product.name,
                    series: product.series
                })
            }


            return res.json(productList)
        } catch (e) {
            TelegramMsg("TECH", "getProductsInfo Blog")
            next(apiError.badRequest(e.message));
        }
    }

    async getBlogCategories(req, res, next) {
        try {
            const categories = await BlogCategories.findAll();
            return res.json(categories)
        } catch (e) {
            next(apiError.badRequest(e.message));
        }
    }

    async getBlogAuthor(req, res, next) {
        try {
            const authors = await BlogAuthors.findAll();
            return res.json(authors)
        } catch (e) {
            next(apiError.badRequest(e.message));
        }
    }

    async createAuthor(req, res, next) {
        try {
            let {name, name_ru, instagram, telegram, facebook, about, skills} = req.body;

            let fileName = await Transliterations(name) + "-hq-" + await GenerateRandomCode(4) + ".webp";
            let basket = "lamiya/blog/authors";

            await UploadImages({
                name: fileName,
                basket: basket,
                file: req.files[0],
                size: 480
            })

            let photo = "https://lamiya.s3.eu-central-1.amazonaws.com/blog/authors/" + fileName

            const authors = await BlogAuthors.create({
                name, name_ru, instagram, telegram, facebook, about, skills, photo
            });

            return res.json({...authors, photo})
        } catch (e) {
            TelegramMsg("TECH", `uploadImage Blog`)
            next(apiError.badRequest(e.message));
        }
    }

    async editAuthors(req, res, next) {
        try {
            let {name, name_ru, instagram, telegram, facebook, about, skills, id} = req.body;
            let photo = "";
            if (req.files[0]) {
                let fileName = await Transliterations(name) + "-" + await GenerateRandomCode(4) + ".webp";
                let basket = "lamiya/blog/authors";

                await UploadImages({
                    name: fileName,
                    basket: basket,
                    file: req.files[0],
                    size: 480
                })

                photo = "https://lamiya.s3.eu-central-1.amazonaws.com/blog/authors/" + fileName
            }

            await BlogAuthors.update({
                name,
                name_ru,
                instagram,
                telegram,
                facebook,
                about,
                skills,
                photo: photo ? photo : undefined
            }, {where: {id}});
            return res.json({
                id, name, name_ru, instagram, telegram, facebook, about, skills, photo: photo ? photo : undefined
            })
        } catch (e) {
            TelegramMsg("TECH", `uploadImage Blog`)
            next(apiError.badRequest(e.message));
        }
    }


    async createCategory(req, res, next) {
        try {
            let {name, name_ru} = req.body;

            const category = await BlogCategories.create({name, name_ru});
            return res.json(category)
        } catch (e) {
            TelegramMsg("TECH", `createCategory Blog`)
            next(apiError.badRequest(e.message));
        }
    }

    async editCategory(req, res, next) {
        try {
            let {name, name_ru, id} = req.body;

            await BlogAuthors.update({name, name_ru}, {where: {id}});
            return res.json({id, name, name_ru})
        } catch (e) {
            TelegramMsg("TECH", `editAuthors Blog`)
            next(apiError.badRequest(e.message));
        }
    }
}

module.exports = new blogController();