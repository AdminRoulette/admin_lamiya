const {BasketDevice} = require('./../models/models');

module.exports = async function (req, res, next) {
    try {
        const {deviceoptionId} = req.params;
        const user = req.user;
        const deviceItem = await BasketDevice.findOne({where: {userId: user.id, deviceoptionId: deviceoptionId}});
        if(deviceItem) {
            return next();
        }
        return res.json("Product didn't find in basket of user");
    } catch (e) {
        res.json(e);
    }
};
