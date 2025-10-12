const axios = require("axios");

async function CreateTTNUkrPost({recipient, whoPayDelivery, weight, declaredPrice, postPay, type, fop}) {
    try {
        let ukrURL;
        let ukrToken;
        let ukrBearer;
        let sender;
        if (process.env.NODE_ENV === "production") {
            ukrToken = fop.ukr_token;
            ukrBearer = fop.ukr_bearer;
            ukrURL = process.env.UKR_POSHTA_URL;
            sender = fop.ukr_sender_uuid;
        } else {
            ukrToken = process.env.UKR_POSHTA_TOKEN_DEV;
            ukrBearer = process.env.UKR_POSHTA_BEARER_TOKEN_DEV;
            ukrURL = process.env.UKR_POSHTA_URL_DEV;
            sender = process.env.UKR_POSHTA_SENDER_DEV;
        }

        const {data} = await axios.post(
            `${ukrURL}/shipments?token=${ukrToken}`,
            {
                sender: {
                    uuid: sender
                },
                recipient: {
                    uuid: recipient
                },
                description: "Замовлення Lamiya.com.ua",
                deliveryType: "W2W",
                type: type,
                checkOnDeliveryAllowed: true,
                checkOnDelivery: true,
                onFailReceiveType: "RETURN_AFTER_7_DAYS",
                transferPostPayToBankAccount: postPay ? true : undefined,
                postPay: postPay ? postPay : undefined,
                paidByRecipient: whoPayDelivery === "recipient", //True – оплата одержувачем. False – оплата відправником
                listOfEnclosedItems: true,
                parcels: [
                    {
                        weight: weight + 50,  // вес как строка
                        length: 10,
                        width: 7,
                        height: 4,
                        declaredPrice: declaredPrice,
                        description: "Замовлення Lamiya.com.ua"
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${ukrBearer}`,
                },
            }
        );
        return data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Помилка створення ТТН УкрПошти";
        throw new Error(message);
    }
}

module.exports = CreateTTNUkrPost;
