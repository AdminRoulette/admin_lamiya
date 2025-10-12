const axios = require("axios");

async function CreateRecipientNp({ firstName, lastName, mobile,fop }) {
    try {

        const { data } = await axios.post(
            process.env.NOVA_POSHTA_URL,
            {
                apiKey: fop.np_api_key,
                modelName: "Counterparty",
                calledMethod: "save",
                methodProperties: {
                    FirstName: firstName,
                    MiddleName: "",
                    LastName: lastName,
                    Phone: mobile,
                    CounterpartyType: "PrivatePerson",
                    CounterpartyProperty: "Recipient"
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
            const contactPerson = res[0].ContactPerson;

            if (contactPerson?.success === true && Array.isArray(contactPerson.data) && contactPerson.data.length > 0) {
                return {
                    Recipient: res[0].Ref,
                    contactRecipientRef: contactPerson.data[0].Ref
                };
            } else {
                throw new Error("Нова Пошта: контактна особа відсутня.");
            }
        } else {
            throw new Error("Нова Пошта: порожня відповідь від API.");
        }
    } catch (error) {
        const message = error.response?.data?.errors?.[0] || error.message || "Невідома помилка при створенні отримувача НП";
        throw new Error(message);
    }
}

module.exports = CreateRecipientNp;
