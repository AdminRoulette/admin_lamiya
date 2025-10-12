const CreateRecipient = require("../PostApi/CreateRecipient");
const CreateTTN = require("../PostApi/CreateTTN");
const {
    DeliveryOrder, ukr_poshta_warehouses, ukr_poshta_cities, nova_poshta_warehouses, nova_poshta_cities,
    nova_poshta_streets
} = require("../../../../models/models");
const CreateDoorRef = require("../PostApi/NovaPoshta/CreateDoorRef");

async function RecipientAndTTN({
                                   firstName, lastName, mobile, postMethod, cityRef,
                                   warehouseRef, deliveryPay, weight, totalPrice, moneyBack, ttn, fop,
                                   streetRef,
                                   apartment,
                                   house,
                                   orderId
                               }) {
    try {
        let ttnData;
        const recipient = await CreateRecipient({
            firstName, lastName, mobile, postMethod, warehouseRef, fop
        });

        const doorRef =  postMethod === 'np_d' && await CreateDoorRef({
            counterpartyRef: recipient.Recipient,
            streetRef: streetRef,
            house: house,
            apartment: apartment
        })

        if (!ttn) {
            ttnData = await CreateTTN({
                mobile, postMethod,
                warehouseRef:postMethod === 'np_d' ? doorRef :warehouseRef,
                deliveryPay, weight,
                totalPrice, moneyBack, recipient, cityRef, fop
            });
        }

        const delivery_price = ttnData?.deliveryPrice || 0;

        if (ttnData || ttn) {
            let full_address = '';
            let full_address_ru = '';

            if (postMethod === 'np_d') {
                const address = await nova_poshta_streets.findOne({
                    where: {ref: streetRef},
                    attributes: ["name"],
                    include: [{
                        model: nova_poshta_cities, attributes: ["fullName", 'fullName_ru']
                    }]
                });

                full_address = `${address?.nova_poshta_city?.fullName || ''}, ${address?.name || ''}, буд. ${house}, кв. ${apartment}`;
                full_address_ru = `${address?.nova_poshta_city?.fullName_ru || ''}, ${address?.name || ''}, дом ${house}, кв. ${apartment}`;
            } else if (postMethod.startsWith('np')) {
                const address = await nova_poshta_warehouses.findOne({
                    where: {warehouse_id: warehouseRef},
                    attributes: ["name", "name_ru"],
                    include: [{
                        model: nova_poshta_cities, attributes: ["fullName", 'fullName_ru']
                    }]
                });

                full_address = `${address?.nova_poshta_city?.fullName || ''}, ${address?.name || ''}`;
                full_address_ru = `${address?.nova_poshta_city?.fullName_ru || ''}, ${address?.name_ru || ''}`;
            } else if (postMethod.startsWith('ukr')) {
                const address = await ukr_poshta_warehouses.findOne({
                    where: {postcode: warehouseRef},
                    attributes: ["name"],
                    include: [{
                        model: ukr_poshta_cities, attributes: ["fullName"]
                    }]
                });

                full_address = `${address?.ukr_poshta_city?.fullName || ''}, ${address?.name || ''}`;
                full_address_ru = full_address; // немає ру назви у укр пошти
            }

            await DeliveryOrder.update({
                firstName: firstName,
                lastName: lastName,
                mobile: mobile,
                ttn: ttn ? ttn : ttnData.ttn,
                cityRef: cityRef,
                full_delivery_address: full_address,
                full_delivery_address_ru: full_address_ru,
                streetRef,
                apartment,
                house,
                warehouseRef: postMethod === 'np_d' ? doorRef :warehouseRef,
                ttnRef: ttnData?.ttnRef || "",
                recipientRef: recipient.Recipient,
                contactRecipientRef: recipient.contactRecipientRef,
                deliveryPrice: delivery_price,
                deliveryPay: deliveryPay,
                moneyBack: moneyBack,
            }, {where: {orderId}})
        }

        return {deliveryPrice:delivery_price,ttn:ttn ? ttn : ttnData.ttn};
    } catch (error) {
        console.error("Ошибка при создании TTN или получателя:", error.message);
        throw new Error("Не вдалося створити ТТН або одержувача: " + error.message);
    }
}

module.exports = RecipientAndTTN;