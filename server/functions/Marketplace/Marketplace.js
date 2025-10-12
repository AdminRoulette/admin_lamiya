const {
    Device,
    Brand,
    Category,
    DeviceImage,
    BodyCarePart,
    DeviceOptions,
    Product_Category,
    FilterValues, Filters, OrderDevice
} = require("../../models/models");
const accessKeyId = process.env.S3_ACCESS_KEY
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
const S3 = require("aws-sdk/clients/s3");
const RozetkaHeaderXML = require("./Rozetka/RozetkaHeaderXML");
const RozetkaXML = require("./Rozetka/RozetkaXML");
const TelegramMsg = require("../TelegramMsg");
const EpicenterXML = require("./Epicenter/EpicenterXML");
const PromCategories = require("./Prom/PromCategories");
const PromXML = require("./Prom/PromXML");
const {create} = require('xmlbuilder2');
const GoogleMerchant = require("./Google/GoogleMerchant");
const path = require("path");
const fs = require("fs");
const KastaXML = require("./Kasta/KastaXML");
const kastaHeaderXML = require("./Kasta/kastaHeaderXML");

async function Marketplace() {
    try {
        let now = new Date();
        const options = {
            timeZone: 'Europe/Kyiv',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const formattedDate = formatter.format(now).replace(',', '');

        const TEMP_FILE_GOOGLE_PATH = path.join(__dirname, 'temp_google_feed.xml');
        const TEMP_FILE_ROZETKA_PATH = path.join(__dirname, 'temp_rozetka_feed.xml');
        const TEMP_FILE_EPICENTER_PATH = path.join(__dirname, 'temp_epicenter_feed.xml');
        const TEMP_FILE_PROM_PATH = path.join(__dirname, 'temp_prom_feed.xml');
        const TEMP_FILE_KASTA_PATH = path.join(__dirname, 'temp_kasta_feed.xml');

        const fileStreamGoogle = fs.createWriteStream(TEMP_FILE_GOOGLE_PATH);
        const fileStreamRozetka = fs.createWriteStream(TEMP_FILE_ROZETKA_PATH);
        const fileStreamEpicenter = fs.createWriteStream(TEMP_FILE_EPICENTER_PATH);
        const fileStreamProm = fs.createWriteStream(TEMP_FILE_PROM_PATH);
        const fileStreamKasta = fs.createWriteStream(TEMP_FILE_KASTA_PATH);

        fileStreamGoogle.write('<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">\n<channel>\n<title>Lamiya.com.ua</title>\n<link>https://lamiya.com.ua</link>\n');
        fileStreamRozetka.write('<yml_catalog date="' + formattedDate + '"><shop>\n');
        fileStreamProm.write('<yml_catalog date="' + formattedDate + '"><shop>\n');
        fileStreamKasta.write('<yml_catalog date="' + formattedDate + '"><shop>\n');
        fileStreamEpicenter.write('<yml_catalog date="' + formattedDate + '"><offers>\n');

        fileStreamRozetka.write(create().ele(await RozetkaHeaderXML()).end({headless: true, prettyPrint: true}));
        fileStreamProm.write(create().ele(await PromCategories()).end({headless: true, prettyPrint: true}));
        fileStreamKasta.write(create().ele(await kastaHeaderXML()).end({headless: true, prettyPrint: true}));

        fileStreamRozetka.write('\n<currencies>\n<currency id="UAH" rate="1"/>\n</currencies>\n<name>Iveris</name>\n<url>https://lamiya.com.ua</url>\n<offers>\n');
        fileStreamProm.write('\n<offers>\n');
        fileStreamKasta.write('\n<currencies>\n<companyName>Lamiya</companyName>\n<currency id="UAH" rate="1"/>\n</currencies>\n<name>lamiya.com.ua</name>\n<url>https://lamiya.com.ua</url><offers>\n');

        let offset = 0
        const limit = 300;
        while (true) {
            const products = await getProductsList(offset);
            for (let productItem of products) {
                const groupedObject = {};
                for (const value of productItem.filter_values) {
                    const val = value.dataValues;
                    const filterCode = val.filter.dataValues.code;

                    if (!groupedObject[filterCode]) {
                        groupedObject[filterCode] = [];
                    }

                    groupedObject[filterCode].push({
                        id: val.id,
                        name: val.name,
                        name_ru: val.name_ru,
                    });
                }

                const product = {
                    ...productItem.dataValues,
                    filters:groupedObject
                };
                fileStreamGoogle.write(create().ele({item: await GoogleMerchant(product.deviceoptions, product)}).end({
                    headless: true,
                    prettyPrint: true
                }));
                for (const option of product.deviceoptions) {
                        fileStreamProm.write(create().ele(await PromXML(option, product)).end({
                            headless: true,
                            prettyPrint: true
                        }));

                    if (!(product.company === 'hillary' || option.sell_type === "on_tab")) {
                        fileStreamKasta.write(create().ele(await KastaXML(option, product)).end({
                            headless: true,
                            prettyPrint: true
                        }));
                    }
                    if (option.sell_type !== "on_tab") {
                            fileStreamRozetka.write(create().ele(await RozetkaXML(option, product)).end({
                                headless: true,
                                prettyPrint: true
                            }));
                        fileStreamEpicenter.write(create().ele(await EpicenterXML(option, product)).end({
                            headless: true,
                            prettyPrint: true
                        }));
                    }
                }
            }
            if (products.length < limit) {
                break;
            }
            offset += limit;
        }

        async function getProductsList(offset) {
            return await Device.findAll({
                limit: 300,
                offset,
                where: {active: true},
                order: [['id', 'ASC'],[DeviceOptions, 'index', 'ASC'],[DeviceOptions, DeviceImage, 'index', 'ASC'], [Product_Category,'category', "level", "ASC"], [Product_Category, "id", "ASC"], [FilterValues, 'id', 'ASC']],
                attributes: ['name', 'name_ru', 'disc', 'disc_ru', 'series', 'series_ru', 'link', 'id', 'company', 'countryId', 'brandId'],
                include: [{
                    model: FilterValues, through:{attributes: []}, attributes: ["name","name_ru", 'id'],
                    include: [{
                        model: Filters, attributes: ["code", 'id','name']
                    }]
                }, {
                    model: Brand, required: true, attributes: ["name",'name_ru', 'id']
                }, {model: BodyCarePart, required: false},
                    {
                        model: Product_Category,
                        order: [['category', "level", "ASC"], ["id", "ASC"]],
                        include: [{
                            model: Category, attributes: ['name', 'id', 'level'], as: 'category'
                        }]
                    }, {
                        model: DeviceOptions,
                        order: [['index', 'ASC']],
                        where: {sell_bottle: false},
                        include: [{model: DeviceImage, order: [['index', 'ASC']], attributes: ["image"]}]
                    }
                ]
            })
        }


        fileStreamGoogle.write('</channel>\n</rss>\n');
        fileStreamRozetka.write('</offers>\n</shop>\n</yml_catalog>\n');
        fileStreamEpicenter.write('</offers>\n</yml_catalog>\n');
        fileStreamProm.write('</offers>\n</shop>\n</yml_catalog>\n');
        fileStreamKasta.write('</offers>\n</shop>\n</yml_catalog>\n');

        fileStreamGoogle.end();
        fileStreamRozetka.end();
        fileStreamEpicenter.end();
        fileStreamProm.end();
        fileStreamKasta.end();

        const deleteFile = (filePath) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Ошибка при удалении файла ${filePath}:`, err);
                }
            });
        };

        async function uploadXML(url, devUrl, path) {
            const uploadParams = {
                Bucket: 'lamiya/Marketplaces',
                Body: fs.createReadStream(path),
                Key: process.env.NODE_ENV === "production" ? url : devUrl,
                ACL: 'public-read',
                ContentType: 'application/xml'
            };
            await s3.upload(uploadParams).promise()
            deleteFile(path);
        }

        const s3 = new S3({
            region: 'eu-central-1', accessKeyId, secretAccessKey
        })

        await uploadXML("rozetkaXMLfile.xml", "devRozetkaXMLfile.xml", TEMP_FILE_ROZETKA_PATH)
        await uploadXML("epicenterXMLfile.xml", "devEpicenterXMLfile.xml", TEMP_FILE_EPICENTER_PATH)
        await uploadXML("promXMLfile.xml", "devPromXMLfile.xml", TEMP_FILE_PROM_PATH)
        await uploadXML("kastaXMLfile.xml", "devKastaXMLfile.xml", TEMP_FILE_KASTA_PATH)
        await uploadXML("googleXMLfile.xml", "devGoogleXMLfile.xml", TEMP_FILE_GOOGLE_PATH)


        return "done"
    } catch (error) {
        TelegramMsg("TECH", `Error Marketplace ${error.message}`)
    }
}

module.exports = Marketplace;
