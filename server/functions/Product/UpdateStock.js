const {Device, ParfumePart, DeviceOptions} = require("../../models/models");
const {Op} = require("sequelize");
const TelegramMsg = require("../TelegramMsg");
const axios = require("axios");

function UpdateStock(IdsArray) {
    try {
        Device.findAll({
            attributes: ['id'],
            where: {active: true, id: {[Op.in]: IdsArray}},
            include: [
                {
                    model: ParfumePart, required: false, attributes: ["partcount", 'refund_count']
                },
                {
                    model: DeviceOptions, attributes: ["count", 'id', 'sell_type']
                }
            ]
        }).then(async devices => {
            for (let device of devices) {
                let stock = device.parfumepart?.partcount > 3 ||
                device.parfumepart?.refund_count > 3;

                for (const option of device.deviceoptions) {
                    if (!stock && (option.count > 0 || option.sell_type === "storage" || option.sell_type === "preorder")) stock = true;
                }

                if (stock !== device.stock) {
                    await Device.update(
                        {stock: stock},
                        {where: {id: device.id}}
                    );
                    await axios.post(`http://localhost:9200/products/_update/${device.id}`, {
                        doc:{
                            stock:stock
                        }
                    },{
                        auth: {
                            username: 'elastic',
                            password: process.env.ELASTIC_PASS,
                        }
                    }).catch(()=>{});
                }
            }
        })
    }catch (error) {
        console.log(error);
        TelegramMsg("TECH",`UpdateStock ${error?.message}`)
    }
}

module.exports = UpdateStock;