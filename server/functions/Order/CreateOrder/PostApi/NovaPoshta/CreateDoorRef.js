const axios = require("axios");

async function CreateDoorRef({ streetRef, house, apartment,counterpartyRef }) {
    try {
        const { data } = await axios.post(
            process.env.NOVA_POSHTA_URL,
            {
                "apiKey": process.env.NOVA_POSHTA_API_KEY,
                "modelName": "AddressGeneral",
                "calledMethod": "save",
                "methodProperties": {
                    "CounterpartyRef" : counterpartyRef,
                    "StreetRef" : streetRef,
                    "BuildingNumber" : apartment,
                    "Flat" : house
                }
            },
            {
                headers: {
                    "Content-Type": "application/json"
                },
            }
        );

        const res = data?.data;

        if (data.success === true && Array.isArray(res) && res.length > 0) {
            return res[0].Ref;
        } else {
            throw new Error("Нова Пошта: порожня відповідь від API. Адреса до дверей");
        }
    } catch (error) {
        const message = error.response?.data?.errors?.[0] || error.message || "Невідома помилка при створенні адреси до дверей";
        throw new Error(`Нова Пошта: помика вулиці. ${message}`);
    }
}

module.exports = CreateDoorRef;
