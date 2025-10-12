const axios = require("axios");

async function CreateTTNNovaPost({
                                     deliveryPay,
                                     weight,
                                     Cost,
                                     ttnRef,
                                     Recipient,
                                     ContactRecipient,
                                     RecipientsPhone,
                                     moneyBack,
                                     cityRecipient,
                                     RecipientAddress,
                                     calledMethod,
                                     fop
                                 }) {
    try {
        const { data } = await axios.post(
            process.env.NOVA_POSHTA_URL,
            {
                apiKey: fop.np_api_key,
                modelName: "InternetDocument",
                calledMethod: calledMethod,
                methodProperties: {
                    Ref: ttnRef ? ttnRef : undefined,
                    CitySender: fop.np_city_ref,
                    Sender: fop.np_sender_ref,
                    SenderAddress: fop.np_sender_address_ref,
                    ContactSender: fop.np_sender_contact_ref,
                    SendersPhone: fop.sender_phone,

                    CityRecipient: cityRecipient,
                    Recipient: Recipient,
                    RecipientAddress: RecipientAddress,
                    ContactRecipient: ContactRecipient,
                    RecipientsPhone: RecipientsPhone,

                    PayerType: deliveryPay === 'recipient' ? "Recipient" : "Sender",
                    PaymentMethod: deliveryPay ? "Cash" : "NonCash",
                    CargoType: "Parcel",
                    Weight: String(weight),
                    ServiceType: "WarehouseWarehouse",
                    SeatsAmount: "1",
                    Description: "Замовлення Lamiya.com.ua",
                    Cost: String(Cost),
                    AfterpaymentOnGoodsCost: moneyBack ? String(moneyBack) : undefined,
                    OptionsSeat: [
                        {
                            volumetricWidth: "15",
                            volumetricLength: "22",
                            volumetricHeight: "3",
                            weight: String(weight)
                        }
                    ]
                }
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        const res = data?.data;
        if (data.success && Array.isArray(res) && res.length > 0) {
            return res[0];
        } else {
            throw new Error(data.errors?.[0]);
        }
    } catch (error) {
        const message = error.response?.data?.errors?.[0] || error.message || "Помилка при створенні ТТН НП";
        throw new Error(message);
    }
}

module.exports = CreateTTNNovaPost;
