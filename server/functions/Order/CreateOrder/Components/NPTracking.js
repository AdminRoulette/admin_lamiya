const axios = require("axios");

async function NPTracking({ttn}) {
    return new Promise(async (resolve, reject) => {

        await axios.post(`${process.env.NOVA_POSHTA_URL}`, {
            "apiKey": process.env.NOVA_POSHTA_API_KEY,
            "modelName": "TrackingDocument",
            "calledMethod": "getStatusDocuments",
            "methodProperties": {
                "Documents": [{
                    "DocumentNumber": ttn,
                    "Phone": "380688877766"
                }]
            }
        }, {
            headers: {
                "Content-Type": "application/json"
            },
        }).then(async ({data}) => {
            resolve(data);
        }).catch(error => {
            reject(new Error("Error Np Post TrackingDocument"));
        })
    })
}

module.exports = NPTracking;