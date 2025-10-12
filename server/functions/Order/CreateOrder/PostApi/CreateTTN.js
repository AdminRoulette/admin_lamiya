const CreateTTNUkrPost = require("./UkrPoshta/CreateTTNUkrPost");
const CreateTTNNovaPost = require("./NovaPoshta/CreateTTNNovaPost");

async function CreateTTN({
                             postMethod,
                             warehouseRef,
                             deliveryPay,
                             weight,
                             totalPrice,
                             moneyBack,
                             recipient,
                             mobile,
                             cityRef,
                            fop
                         }) {
    try {
        if (postMethod.startsWith("ukr")) {
            const ukrRes = await CreateTTNUkrPost({
                recipient: recipient.Recipient,
                whoPayDelivery: deliveryPay,
                weight,
                declaredPrice: totalPrice,
                postPay: moneyBack,
                type: postMethod === 'ukr_s' ? "STANDARD" : "EXPRESS",
                fop
            });

            return {
                ttn: ukrRes.barcode,
                deliveryPrice: Math.ceil(ukrRes.deliveryPrice),
                ttnRef: ukrRes.uuid
            };
        }

        if (postMethod.startsWith("np")) {
            const novaRes = await CreateTTNNovaPost({
                deliveryPay,
                weight: weight / 1000,
                Cost: totalPrice,
                Recipient: recipient.Recipient,
                ContactRecipient: recipient.contactRecipientRef,
                RecipientsPhone: mobile,
                RecipientAddress: warehouseRef,
                moneyBack,
                cityRecipient: cityRef,
                calledMethod: "save",
                fop
            });

            return {
                ttn: novaRes.IntDocNumber,
                deliveryPrice: Math.ceil(novaRes.CostOnSite),
                ttnRef: novaRes.Ref
            };
        }
        throw new Error(`Невідомий метод доставки: ${postMethod}`);
    } catch (error) {
        throw new Error(`Помилка створення ТТН: ${error.message}`);
    }
}

module.exports = CreateTTN;
