const axios = require("axios");
const TelegramMsg = require("../../TelegramMsg");
let ukrToken;
let ukrBearer;
let ukrURL;
let sender;
if (process.env.NODE_ENV === "production") {
    ukrToken = process.env.UKR_POSHTA_TOKEN
    ukrBearer=process.env.UKR_POSHTA_BEARER_TOKEN
    ukrURL=process.env.UKR_POSHTA_URL;
    sender = process.env.UKR_POSHTA_SENDER;
} else {
    ukrToken = process.env.UKR_POSHTA_TOKEN_DEV;
    ukrBearer=process.env.UKR_POSHTA_BEARER_TOKEN_DEV;
    ukrURL=process.env.UKR_POSHTA_URL_DEV;
    sender = process.env.UKR_POSHTA_SENDER_DEV;
}

class EditOrder {

    async deleteUkrPostTTN({uuid}) {
        try {
            await axios.delete(`${ukrURL}/shipments/${uuid}?token=${ukrToken}`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${ukrBearer}`,
                },
            })
        } catch (error) {
            TelegramMsg("TECH", `Помилка при видаленні ТТН Укр Пошта ${error.response?.data?.message || error.message}`)
        }
    }
    async deleteNovaPostTTN({Ref,np_api_key}) {
        try {
            const { data } = await axios.post(
                process.env.NOVA_POSHTA_URL,
                {
                    apiKey: np_api_key,
                    modelName: "InternetDocumentGeneral",
                    calledMethod: "delete",
                    methodProperties: {
                        DocumentRefs: Ref,
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
            TelegramMsg("TECH", `Помилка при видаленні ТТН НП ${error.response?.data?.errors?.[0] || error.message}`)
        }
    }

}

module.exports = new EditOrder;