const {Device, DeviceOptions, StockHistory, ParfumePart} = require("../../../../models/models");
const TelegramMsg = require("../../../TelegramMsg");
const CalculateSellBottlePrice = require("../../../Product/CalculateSellBottlePrice");


async function CancelProductCount({OptionId, count, orderId,special_type,product_name,userId,actionText}) {
    try {
        const option = await DeviceOptions.findOne({
            where: {id: OptionId}, include: [{
                model: Device,include: [
                    {
                        model: ParfumePart
                    },{
                        model:DeviceOptions
                    }]
            }]
        })
        if (special_type === "on_tab") {
            const newRefundCount = option.device.parfumepart.refund_count + (option.weight * count)
            const totalPartCount = option.device.parfumepart.partcount + newRefundCount;
            await ParfumePart.update(
                {refund_count: newRefundCount},
                {where: {deviceId: option.device.id}}
            )
            for(const anotherOption of option.device.deviceoptions){
                if(anotherOption.sell_type === "on_tab") {
                    const on_tab_count = Math.floor(totalPartCount / anotherOption.weight);
                    await DeviceOptions.update({count: on_tab_count}, {where: {id: anotherOption.id}})
                }
            }

        }else if (special_type === "sell_bottle"){
            const match = product_name.match(/\b([0-9]{1,3})\b/);
            const bottle_volume = Number(match[0]);
            const partCount = option.device.parfumepart.partcount;
            const refundCount = option.device.parfumepart.refund_count;
            const isUpdateSellBottle = partCount === 0;
            if(isUpdateSellBottle){
                await ParfumePart.update(
                    {partcount: bottle_volume},
                    {where: {deviceId: option.device.id}}
                )
            }else{
                await ParfumePart.update(
                    {refund_count: bottle_volume + refundCount},
                    {where: {deviceId: option.device.id}}
                )
            }
            for(const anotherOption of option.device.deviceoptions){
                if(anotherOption.sell_type === "on_tab") {
                    const on_tab_count = Math.floor((partCount + refundCount + bottle_volume) / anotherOption.weight);
                    await DeviceOptions.update({count: on_tab_count}, {where: {id: anotherOption.id}})
                }else if(anotherOption.sell_type === "sell_bottle"){
                    if(isUpdateSellBottle) {
                        await DeviceOptions.update(
                            {
                                count: 1,
                                optionName: `Залишок у флаконі ${bottle_volume} мл`,
                                optionName_ru: `Остаток во флаконе ${bottle_volume} мл`,
                                price: await CalculateSellBottlePrice(option.device.parfumepart.on_tab_price,bottle_volume),
                                startPrice: bottle_volume * option.device.parfumepart.on_tab_price,
                                weight: bottle_volume
                            },
                            {where: {id: anotherOption.id}}
                        )
                    }
                }
            }
        }else{
            await DeviceOptions.update({count: option.count + count}, {where: {id: option.id}})
        }
        await StockHistory.create({
            option_id: option.id,
            order_id: orderId,
            old_count: `${option.count}`,
            new_count: `${option.count + count}`,
            user_id:userId,
            action: actionText,
        })

        return option.device.id;
    } catch (error) {
        TelegramMsg("TECH", `CancelProductCount ${error.message}`)
    }

}

module.exports = CancelProductCount;
