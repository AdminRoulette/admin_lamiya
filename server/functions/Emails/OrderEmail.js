const {
    Orders,
    OrderDevice,
    Device,
    Brand,
    DeliveryOrder,
    DeviceOptions,
    DeviceImage,
    nova_poshta_warehouses,
    nova_poshta_cities,
    ukr_poshta_warehouses,
    ukr_poshta_cities
} = require("../../models/models");
const nodemailer = require("nodemailer");
const TelegramMsg = require("../TelegramMsg");
const OrderCityName = require("../Order/components/OrderCityName");


async function OrderEmail({orderId, language}) {
    try {
        let productList = "";
        let ttn = "";
        let payment = "";
        //РУ\ЮА мова в посиланнях та тексті
        const order = await Orders.findOne({
            order: [[OrderDevice, DeviceOptions, Device, DeviceImage, 'index', 'ASC'],[OrderDevice,'id','ASC']],
            where: {id: orderId},
            include: [{
                model: DeliveryOrder,
                attributes: ['full_delivery_address',"ttn", 'mobile', 'firstName', 'lastName', 'email', 'cityRef', 'warehouseRef'],
            }, {
                model: OrderDevice, attributes: ['count', "price", "salePrice", 'deviceoptionId'], include: [{
                    model: DeviceOptions, include: [{
                        model: Device, attributes: ['name', 'series', 'id'], include: [{
                            model: Brand, attributes: ["name"]
                        }, {
                            model: DeviceImage, attributes: ["img"]
                        }]
                    }]
                }]
            }]
        })

        let cityName = order.delivery_order.full_delivery_address;
        if (order.delivery_order?.ttn) {
            ttn = `<tr>
                <th>
                    <span style="display: block;font-size: 16px;line-height: 24px;width: 100%;font-weight: 400;">
                        ТТН: <b>${order.delivery_order.ttn}</b>
                    </span>
                </th>
            </tr>`
        }
        if (order.paymentType === 'account') {
            payment = `<table style="border-collapse:collapse;padding:0;width:100%;text-align:left">
                                        <tbody>
                                            <tr>
                                                <th>
                                                    <span class="infoSPan"><b>На розрахунковий рахунок</b></span>
                                                </th>
                                            </tr>
                                            <tr>
                                                <th style="text-align: left">
                                                    <span class="infoSPan">IBAN: UA353220010000026002330154511</span>
                                                </th>
                                             </tr>
                                             <tr>
                                                <th style="text-align: left">
                                                    <span class="infoSPan">ФОП Безсмертна А.О.</span>
                                                </th>
                                             </tr>
                                             <tr>
                                                <th style="text-align: left">
                                                    <span class="infoSPan">Код ЄДРПОУ \ ІПН:3565302184</span>
                                                </th>
                                             </tr>
                                             <tr>
                                                <th style="text-align: left">
                                                    <span class="infoSPan">Призначення платежу: Замовлення №${orderId} ${order.delivery_order.lastName} ${order.delivery_order.firstName}</span>
                                                </th>
                                             </tr>
                                        </tbody>
                                    </table>`
        } else {
            payment = `<span class="infoSPan">${order.paymentType === 'mono' ? "Картою онлайн на сайті" : order.paymentType === 'moneyback' || order.paymentType === 'cash' ? "Під час отримання товару" : ""}</span>`
        }
        for (const orderDevElem of order.order_devices) {
            productList += `<tr class="product">
                        <th style="width: 100%">
                        <table style="border-collapse:collapse;padding:0;width:100%;text-align:center">
                            <tbody>
                            <tr class="mobileTr">
                                <th class="padding imgBlock">
                                    <a style="display: block;"
                                       href="https://lamiya.com.ua${language ? "/ru/" : "/"}product/${orderDevElem.deviceoption.device.id}/${orderDevElem.deviceoption.id}">
                                        <img style="max-height: 150px; aspect-ratio: 1/1; object-fit: contain" alt="${orderDevElem.deviceoption.device.name + ' ' + orderDevElem.deviceoption.option}"
                                             src="${orderDevElem.deviceoption.device.deviceimages[orderDevElem.deviceoption?.index]?.image ? orderDevElem.deviceoption.device.deviceimages[orderDevElem.deviceoption.index].image : orderDevElem.deviceoption.device.deviceimages[0].image}"/>
                                    </a>
                                </th>
                                <th class="productInfo padding">
                                    <table style="border-collapse:collapse;padding:0;width:100%;text-align:left">
                                        <tbody>
                                        <tr>
                                            <th>
                                                <a href="https://lamiya.com.ua${language ? "/ru/" : "/"}product/${orderDevElem.deviceoption.device.id}/${orderDevElem.deviceoption.id}"
                                                   style="color: #3e77aa;margin: 0;padding: 0;text-decoration: none;font-weight: 400;font-size: 14px;line-height: 16px;">
                                                    <span>${orderDevElem.deviceoption.device.name + ' ' + orderDevElem.deviceoption.option}</span>
                                                </a>
                                            </th>
                                        </tr>
                                        <tr>
                                            <td style="line-height: 10px;height: 10px;padding: 0;"></td>
                                        </tr>
                                        <tr>
                                            <th><span style="font-weight: 400;font-size: 14px;line-height: 16px;">Ціна: ${orderDevElem.saleprice > 0 ? orderDevElem.saleprice : orderDevElem.price} ₴</span>
                                            </th>
                                        </tr>
                                        <tr>
                                            <td style="line-height: 10px;height: 10px;padding: 0;"></td>
                                        </tr>
                                        <tr>
                                            <th><span style="font-weight: 400;font-size: 14px;line-height: 16px;">Кількість: ${orderDevElem.count} шт</span>
                                            </th>
                                        </tr>
                                        </tbody>
                                    </table>
                                </th>
                                <th class="productPrice">
                                    ${orderDevElem.saleprice > 0 ? orderDevElem.saleprice : orderDevElem.price * orderDevElem.count} ₴
                                </th>
                            </tr>
                            </tbody>
                        </table>
                    </th>
                    </tr>`
        }
        let transporter = nodemailer.createTransport({
            service: 'gmail', auth: {
                user: `lamiya.com.ua@gmail.com`, pass: process.env.GMAIL_PASS,
            },
        });
        await transporter.sendMail({
            from: 'Lamiya.com.ua <lamiya.com.ua@gmail.com>',
            to: order.delivery_order.email,
            subject: `Інформація про ваше замовлення №${orderId}`,
            html: `<html>
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
        .mobileTr{
            border-bottom: 1px solid #ccd0d3;
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
            
            .mobileTr{
            display: table-cell;
            }
            .table{
                /*margin: 10px;*/
            }   
            .product{
                /*//display: table-cell;*/
            }
            .productInfo{
                display: table;
                text-align: left;
                width: 100%;
                margin-left: 15px;
            }
            .productPrice{
            text-align: left;
            width: 100%;
            padding: 15px;
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
                <th><span style="display: block;font-size: 24px;line-height: 28px;width: 100%;font-weight: 400;">Дякуємо за ваше замовлення!</span>
                </th>
            </tr>
            <tr>
                <td style="line-height: 10px;height: 10px;padding: 0;"></td>
            </tr>
            <tr>
                <th><span style="display: block;font-size: 14px;line-height: 24px;width: 100%;font-weight: 400;">
                    Ваше замовлення <b>№${orderId}</b> прийняте та буде укомплектоване найближчим часом.</span></th>
            </tr>
            <tr>
                <th><span style="display: block;font-size: 14px;line-height: 24px;width: 100%;font-weight: 400;">Ви можете відстежити статус свого замовлення в <a
                    style="color: #3e77aa;text-decoration: none;"
                        href="${language ? "https://lamiya.com.ua/ru/cabinet/orders" : "https://lamiya.com.ua/cabinet/orders"}">особистому
                кабінеті</a></span></th>
            </tr>
            <tr>
                <td style="line-height: 5px;height: 5px;padding: 0;"></td>
            </tr>
            ${ttn}
            </tbody>
        </table>

        <div style="border: 1px solid #ccd0d3;border-radius:10px;margin-bottom: 20px;margin-top: 10px">
            <table class="table">
                <tbody>
                <tr style="border-bottom: 1px solid #ccd0d3">
                    <th style="padding: 15px">
                        <table class="table">
                            <tbody>
                            <tr style="font-size: 15px">
                                <th><span>Замовлення №${orderId}</span></th>
                                <th style="text-align: end"><span style="color: #797878;">${new Date(order.createdAt).toLocaleDateString('ua-UA', 
                {year: 'numeric', month: 'numeric', day: 'numeric'})}</span></th>
                            </tr>
                            </tbody>
                        </table>
                    </th>
                </tr>
                <tr>
                    ${productList}
                </tr>

                <tr>
                    <th class="trLine" style="padding: 15px">
                        <table class="table">
                            <tbody>
                            <tr>
                                <th class="rowTable rowLine" style="width:200px;text-align: left"><span class="graySpan">Доставка</span>
                                </th>
                                <th class="rowTable">
                                <table class="table">
                                    <tbody>
                                <tr>
                                    <th><span class="infoSPan">${order.postMethod.startsWith('np') ? "Нова пошта" : order.postMethod.startsWith('ukr') ? "Укрпошта" : "Самовивіз з магазину"}</span></th>
                                </tr>
                                <tr>
                                    <th style="text-align: left"><span class="infoSPan">${cityName}</span></th>
                                </tr>
                            </tbody>
                        </table>
                                </th>
                            </tr>
                            </tbody>
                        </table>
                    </th>
                </tr>
                <tr>
                    <th class="trLine" style="padding: 15px">
                        <table class="table">
                            <tbody>
                            <tr>
                                <th class="rowTable rowLine" style="width:200px;text-align: left"><span class="graySpan">Оплата</span>
                                </th>
                                <th class="rowTable">
                                    ${payment}
                                </th>
                            </tr>
                            </tbody>
                        </table>
                    </th>
                </tr>
                <tr>
                    <th class="trLine" style="padding: 15px">
                        <table class="table">
                            <tbody>
                            <tr>
                                <th class="rowTable" style="width:200px;text-align: left">
                                    <span class="graySpan rowLine">Отримувач</span>
                                </th>
                                <th class="rowTable">
                                    <table style="border-collapse:collapse;padding:0;width:100%;text-align:left">
                                        <tbody>
                                            <tr>
                                                <th>
                                                    <span class="infoSPan">${order.delivery_order.lastName} ${order.delivery_order.firstName}</span>
                                                </th>
                                            </tr>
                                            <tr>
                                                <th style="text-align: left"><span class="infoSPan">${order.delivery_order.mobile}</span></th>
                                             </tr>
                                        </tbody>
                                    </table>
                                </th>
                            </tr>
                            </tbody>
                        </table>
                    </th>
                </tr>
                <tr>
                    <td style="line-height: 10px;height: 10px;padding: 0;"></td>
                </tr>
                <tr>
                    <th class="trLine" style="padding: 15px">
                        <table class="table">
                            <tbody>
                            <tr>
                                <th class="rowTable" style="width:300px;text-align: left">
                                    <span class="graySpan rowLine">Загальна сума замовлення
                                    </span>
                                </th>
                                <th class="rowTable totalPrice">
                                    <span>${order.totalPrice} ₴</span>
                                </th>
                            </tr>
                            </tbody>
                        </table>
                    </th>
                </tr>
            </table>
        </div>

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
        });
    } catch (error) {
        TelegramMsg("TECH",error.message)
    }
}

module.exports = OrderEmail;
