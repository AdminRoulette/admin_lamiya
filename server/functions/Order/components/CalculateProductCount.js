const {ParfumePart, DeviceOptions, StockHistory, Device} = require("../../../models/models");
const TelegramMsg = require("../../TelegramMsg");
const CalculateSellBottlePrice = require("../../Product/CalculateSellBottlePrice");

async function CalculateProductCount({oldOptionElem, count, orderId,userId,actionText}) {
    try {
        //Дурна логіка на те щоб порахувати залишок мл для розпиву\залишок товару у клкості
        //Подумати чи можна це робити по іншому
        const deviceId = oldOptionElem.device.id;
        let device = await Device.findOne({
            where: {id: deviceId},
            order: [[DeviceOptions, 'price', 'DESC']],
            include: [
                {
                    model: DeviceOptions
                }, {
                    model: ParfumePart
                }]
        });
        if (oldOptionElem.sell_type === "on_tab") {
            const currentPartCount = device?.parfumepart?.partcount;
            const currentRefundCount = device?.parfumepart?.refund_count;
            const sellMilliliters = oldOptionElem.weight * count;
            const PartCount = currentPartCount + currentRefundCount - sellMilliliters;

            if (PartCount < 0) TelegramMsg("TECH", `Сток розпива в мінусі deviceId:${deviceId}`)

            let remainingMilliliters = sellMilliliters;
            let updatedRefundCount = Math.max(currentRefundCount - remainingMilliliters, 0);
            remainingMilliliters = Math.max(remainingMilliliters - currentRefundCount, 0);
            let updatedPartCount = currentPartCount - remainingMilliliters;

            await ParfumePart.update(
                {partcount: updatedPartCount, refund_count: updatedRefundCount},
                {where: {deviceId: deviceId}}
            )

            for (const optionElem of device.deviceoptions) {
                if (optionElem.sell_type === "on_tab") {
                    const newCount = Math.floor(PartCount / (optionElem.weight));
                    await DeviceOptions.update(
                        {count: newCount},
                        {where: {id: optionElem.id}}
                    )
                } else if (optionElem.sell_type === "sell_bottle") {
                    await DeviceOptions.update(
                        {
                            count: updatedPartCount > 0 ? 1 : 0,
                            optionName: `Залишок у флаконі ${updatedPartCount} мл`,
                            optionName_ru: `Остаток во флаконе ${updatedPartCount} мл`,
                            startPrice: updatedPartCount * device.parfumepart?.on_tab_price,
                            price:await CalculateSellBottlePrice(device?.parfumepart.on_tab_price, updatedPartCount),
                            weight: updatedPartCount
                        },
                        {where: {id: optionElem.id}}
                    )
                }
            }
        } else if (oldOptionElem.sell_type === "sell_bottle"){
            const currentRefundCount = device?.parfumepart?.refund_count;
            for (const optionElem of device.deviceoptions) {
                if (optionElem.sell_type === "on_tab") {
                    const newCount = Math.floor(currentRefundCount / (optionElem.weight));
                    await DeviceOptions.update(
                        {count: newCount},
                        {where: {id: optionElem.id}}
                    )
                } else if (optionElem.sell_type === "sell_bottle") {
                    await DeviceOptions.update(
                        {
                            count: 0,
                            optionName: `Залишок у флаконі 0 мл`,
                            optionName_ru: `Остаток во флаконе 0 мл`,
                            price: 0,
                            startPrice: 0,
                            weight: 0
                        },
                        {where: {id: optionElem.id}}
                    )
                }
            }
            await ParfumePart.update(
                {partcount: 0},
                {where: {deviceId: deviceId}}
            )
        }if(!((oldOptionElem.sell_type === "storage" || oldOptionElem.sell_type === "preorder") && count === 0)) {
            const newCount = oldOptionElem.count - count;
            await DeviceOptions.update(
                {count: newCount},
                {where: {id: oldOptionElem.id}}
            )
            if (newCount < 0) {
                TelegramMsg("TECH", `Сток в мінусі DeviceOptions:${oldOptionElem.id}`)
            }
        }
        await StockHistory.create(
            {
                option_id: oldOptionElem.id,
                order_id: orderId,
                old_count: `${oldOptionElem.count}`,
                new_count: `${oldOptionElem.count - count}`,
                user_id: userId,
                action: actionText,
            }
        )
        return deviceId;

    } catch (error) {
        TelegramMsg("TECH", `CalculateProductCount ${error.message}`)
    }
}

module.exports = CalculateProductCount;
