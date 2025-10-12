const axios = require("axios");

async function CreateRecipientUkr({firstName, lastName, mobile, warehouseRef,fop}) {
    let ukrURL;
    let ukrToken;
    let ukrBearer;

    if (process.env.NODE_ENV === "production") {
        ukrToken = fop.ukr_token;
        ukrBearer = fop.ukr_bearer;
        ukrURL = process.env.UKR_POSHTA_URL;
    } else {
        ukrToken = process.env.UKR_POSHTA_TOKEN_DEV;
        ukrBearer = process.env.UKR_POSHTA_BEARER_TOKEN_DEV;
        ukrURL = process.env.UKR_POSHTA_URL_DEV;
    }
    try {
        const { data: addressData } = await axios.post(
            `${ukrURL}/addresses`,
            { postcode: warehouseRef },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${ukrBearer}`,
                },
            }
        );
        console.log(addressData)
        const { data: recipientData } = await axios.post(
            `${ukrURL}/clients?token=${ukrToken}`,
            {
                type: "INDIVIDUAL",
                firstName,
                lastName,
                middleName: " ",
                addressId: addressData.id,
                phoneNumber: mobile,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${ukrBearer}`,
                },
            }
        );
        return { Recipient: recipientData.uuid };
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
    }
}

module.exports = CreateRecipientUkr;