const {SearchResult} = require('../models/models');
const apiError = require("../error/apierror");
const TelegramMsg = require("../functions/TelegramMsg");

class searchController {

    async SearchList(req, res, next) {
        try {
            await SearchResult.findAll({
                order: [["count", "DESC"]]
            }).then(async (data) => {
                return res.json(data)
            })

        } catch (e) {
            TelegramMsg("TECH",`SearchList ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }
}

module.exports = new searchController();