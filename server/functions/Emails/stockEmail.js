const {
    Device,
    Brand,
    DeviceOptions,
    DeviceImage,
    WishList,
    Basket,
    User
} = require("../../models/models");
const nodemailer = require("nodemailer");
const TelegramMsg = require("../TelegramMsg");

async function stockEmail(optionId) {
    try {
        const wishList = await WishList.findAll({
            where: {deviceoptionId: optionId, notifyInStock: true}, include: [{model: User}]
        })
        if (wishList) {
            let transporter = nodemailer.createTransport({
                service: 'gmail', auth: {
                    user: `lamiya.com.ua@gmail.com`, pass: process.env.GMAIL_PASS,
                },
            });
            const product = await DeviceOptions.findOne({
                where: {id: optionId}, include: [{
                    model: Device, include: [{model: DeviceImage}, {model: Brand}]
                }]
            })
            //WishList.update({notifyInStock: false}, {where: {deviceoptionId: optionId, notifyInStock: true}})
            for (const wish of wishList) {
                let html = `<html>
<head>
    <style>
        .table {
            border-collapse:collapse;
            padding:0;
            width:100%;
            text-align:left;
        }
        .borderTable{
            border-bottom: 1px solid #ccd0d3;
        }
        .social{
        width:32px;
        vertical-align:middle;
        padding-left:16px;
        text-align: center;
        }
        .totalPrice{
            text-align: end;
            font-size: 24px;
        }
        .buyBtn{
            font-weight: 400;
            font-size: 16px;
            border: 1px solid #000;
            border-radius: 8px;
            height: 35px;
            width: 200px;
            line-height: 35px;
            display: block;
            color: #fff !important;
            text-decoration: none;
            background-color: #000;
            text-align: center;
        }
        .buyBtn:hover{
             cursor: pointer;
             background-color: #333333;
        }
        .graySpan{
            color: #797878;font-weight: 400
        }
        .productInfo{
                padding-left: 20px;

        }
        .imgBlock{
                max-width: 150px;
                width:150px;
        }
        .productPrice{
            width: 100px;
            text-align: center;
            padding: 0;
            font-size: 24px;
            line-height: 24px;
            font-weight: 400;
        }
        .trLine{
            border-bottom: 1px solid #ccd0d3;
        }
        .infoSPan{
            text-align: left;
            font-weight: 400;
        }
        @media screen and (max-width: 666px) {
        .totalPrice{
            font-weight: 400;
            text-align: left;
        }
      
        .buyBtn{
               text-align: center;
               width: 100%;
               padding: 0;
        }
        .rowLine{
            line-height: 35px;
        }
        .imgBlock{
               width: 100%;
               max-width: 100%;
                display: table;
                text-align: center;
                margin: 10px 0;
        }
        .rowTable{
        display: table-row;
        }
            .padding{
                padding: 7px;
            }
            .name_padding{
                padding: 0 15px;
            }
            .mobileTr{
            display: table-cell;
            }
            .productInfo{
                display: table;
                text-align: left;
                width: 100%;
                padding: 10px;
            }
            .productPrice{
            margin: 20px 0 15px;
            display: table;
            width: 100%;
           
        }
        }
    </style>
</head>
<body>
<div style="width:100%;max-width: 680px;margin: 0 auto;">
    <div style="margin:15px;">
        <a href="https://lamiya.com.ua" title="Lamiya" target="_blank">
            <img style="border-radius:8px" alt="Lamiya.com.ua"
                 src="https://lamiya.s3.eu-central-1.amazonaws.com/Icons%5CEmails+png/logo.png"/>
        </a>
    </div>
    <div style="background: #f7f7f7;border-radius: 20px;padding:20px;color: #000000;font-family:Nunito Sans, Helvetica, Arial, sans-serif;">
        <table class="table">
            <tbody>
            <tr>
                <th><span style="display: block;font-size: 16px;line-height: 24px;width: 100%;font-weight: 400;">Добрий день, <b>${wish.basket.user.firstname}</b></span>
                </th>
            </tr>
            <tr>
                <td style="line-height: 5px;height: 5px;padding: 0;"></td>
            </tr>
            <tr>
                <th><span style="display: block;font-size: 14px;line-height: 24px;width: 100%;font-weight: 400;">
                    <span style="text-decoration: underline">${product.device.brand.name + ' ' + product.device.name + ' ' + product.option}</span> знову в наявності і чекає на ваше замовлення.</span></th>
            </tr> 
            <tr>
                <th><span style="display: block;font-size: 14px;line-height: 24px;width: 100%;font-weight: 400;">
                Поспішіть поповнити запаси краси.</span></th>
            </tr>
            </tbody>
        </table>

        <div style="border: 1px solid #ccd0d3;border-radius:10px;margin-bottom: 20px;margin-top: 10px">
            <table class="table">
                <tbody>
                <tr>
                    <tr class="product">
                        <th style="width: 100%">
                        <table style="border-collapse:collapse;padding:0;width:100%;text-align:center">
                            <tbody>
                            <tr class="mobileTr">
                                <th class="padding imgBlock">
                                    <a style="display: block;"
                                       href="https://lamiya.com.ua/product/${product.device.id}/${product.id}">
                                        <img style="max-height: 150px" alt="${product.device.name + ' ' + product.option}"
                                             src="${product.device.deviceimages[product?.index]?.image ? product.device.deviceimages[product.index].image : product.device.deviceimages[0].image}"/>
                                    </a>
                                </th>
                                <th class="productInfo padding">
                                    <table style="border-collapse:collapse;padding:0;width:100%;text-align:left">
                                        <tbody>
                                        <tr>
                                            <th class="name_padding">
                                                <a href="https://lamiya.com.ua/product/${product.device.id}/${product.id}"
                                                   style="color: #3e77aa;margin: 0;padding: 0;text-decoration: none;font-weight: 400;font-size: 14px;line-height: 16px;">
                                                    <span>${product.device.name + ' ' + product.option}</span>
                                                </a>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th class="name_padding">
                                            <span style="font-weight: 400;line-height: 16px;color:#797878;font-size: 12px">${product.device.series}</span>
                                            </th>
                                        </tr>
                                        <tr>
                                            <td style="line-height: 15px;height: 15px;padding: 0;"></td>
                                        </tr>
                                        <tr> 
                                            <th  class="name_padding"><a href="https://lamiya.com.ua/product/${product.device.id}/${product.id}" class="buyBtn">Купити</a></th>
                                        </tr>
                                        </tbody>
                                    </table>
                                </th>
                                <th class="productPrice">
                                    ${product.saleprice > 0 ? product.saleprice : product.price} ₴
                                </th>
                            </tr>
                            </tbody>
                        </table>
                    </th>
                    </tr>
                </tr>
            </table>
        </div>
<table class="table">
            <tbody>
            <tr>
                <th><span style="display: block;font-size: 12px;line-height: 24px;width: 100%;font-weight: 400;margin-bottom: 7px">
                    Ціна та наявність актуальні по стану на <span style="text-decoration: underline">
                    ${new Date().toLocaleDateString('ua-UA', {
                    hour: 'numeric',
                    minute: 'numeric',
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                })}
                </span></span>
                </th>
            </tr>
            </tbody>
        </table>
        <div style="border-radius: 8px;padding-top: 15px;background: rgba(242,201,76,0.2)">
            <div style="text-align: center">Напишіть нам, якщо виникли питання</div>
            <div>
                <table class="table"> 
                    <tbody>
                    <tr style="height: 80px">
                        <th title="Instagram"
                            class="social">
                            <a target="_blank"
                               href="https://instagram.com/_u/lamiya.com.ua/">
                                <img alt="Lamiya-Instagram"
                                     src="https://lamiya.s3.eu-central-1.amazonaws.com/Icons%5CEmails+png/instagram.png"/>
                            </a>
                        </th>
                        <th title="Telegram"
                            class="social">
                            <a target="_blank"
                               href="https://t.me/Lamiya_com_ua">
                                <img alt="Lamiya-Telegram"
                                     src="https://lamiya.s3.eu-central-1.amazonaws.com/Icons%5CEmails+png/Telegram.png"/>
                            </a>
                        </th>
                        <th title="TikTok"
                            class="social">
                            <a target="_blank"
                               href="https://www.tiktok.com/@lamiya.com.ua">
                                <img alt="Lamiya-TikTok-New"
                                     src="https://lamiya.s3.eu-central-1.amazonaws.com/Icons%5CEmails+png/TikTok.png"/>
                            </a>
                        </th>
                        <th title="Facebook"
                            class="social">
                            <a target="_blank"
                               href="https://www.facebook.com/lamiya.com.ua">
                                <img alt="Lamiya-Facebook"
                                     src="https://lamiya.s3.eu-central-1.amazonaws.com/Icons%5CEmails+png/fb.png"/>
                            </a>
                        </th>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
</body>
</html>`
                await transporter.sendMail({
                    from: 'Lamiya.com.ua <lamiya.com.ua@gmail.com>',
                    // to: wish.basket.user.email,
                    to: "qqalopruvet@gmail.com",
                    subject: `Товар, яким ви цікавились знову в наявності! 🎉`,
                    html: html
                });
            }
        }

    } catch (error) {
        TelegramMsg("TECH",error.message)
    }
}

module.exports = stockEmail;
