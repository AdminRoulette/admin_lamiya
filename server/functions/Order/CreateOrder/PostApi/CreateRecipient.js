const CreateRecipientNp = require("./NovaPoshta/CreateRecipientNp");
const CreateRecipientUkr = require("./UkrPoshta/CreateRecipientUkr");

async function CreateTTN({ firstName, lastName, mobile, postMethod, warehouseRef,fop }) {
    try {
        if (postMethod.startsWith("ukr")) {
            return await CreateRecipientUkr({ warehouseRef, firstName, lastName, mobile,fop });
        }

        if (postMethod.startsWith("np")) {
            return await CreateRecipientNp({ firstName, lastName, mobile,fop});
        }
        console.log("--------------------------------")
        throw new Error(`Невідомий метод доставки: ${postMethod}`);
    } catch (error) {
        throw new Error(`Помилка створення отримувача: ${error.message}`);
    }
}

module.exports = CreateTTN;
