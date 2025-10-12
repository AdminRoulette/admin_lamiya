const {
    Country,
    FilterCategoryValue, FilterValues, Filters, FilterProductValue
} = require("../../models/models");
const TelegramMsg = require("../../functions/TelegramMsg");
const apiError = require("../../error/apierror");
const {Op} = require("sequelize");


class filtersController {

    async getCategoryFilters(req, res, next) {
        try {
            const {id} = req.query;
            const groupedMap = new Map();

            const filters = await Filters.findAll({
                order:[['name','ASC']],
                raw: true
            });

            for (const f of filters) {
                groupedMap.set(f.code, {
                    id: f.id,
                    code: f.code,
                    name: f.name,
                    name_ru: f.name_ru,
                    values: []
                });
            }
            const filter_values = await FilterValues.findAll({
                order:[['name','ASC']],
                include:[{
                    model:Filters
                },{
                    model:FilterCategoryValue,
                    required: true,
                    where:{category_id:id}
                }],
                raw:true
            })
            const valuesIds = filter_values.map(item => item.id);

            const not_select_filter_values = await FilterValues.findAll({
                order:[['name','ASC']],
                include:[{
                    model:Filters
                }],
                where:{id:{[Op.notIn]:valuesIds}},
                raw:true
            })

            for (const val of filter_values) {
                groupedMap.get(val['filter.code']).values.push({
                    id: val.id,
                    code: val.code,
                    name: val.name,
                    name_ru: val.name_ru,
                    filter_id: val.filter_id,
                    select: true
                });
            }

            for (const val of not_select_filter_values) {
                groupedMap.get(val['filter.code']).values.push({
                    id: val.id,
                    code: val.code,
                    name: val.name,
                    name_ru: val.name_ru,
                    filter_id: val.filter_id,
                    select: false
                });
            }

            return res.json([...groupedMap.values()]);
        } catch (e) {
            TelegramMsg("TECH", `getCategoryFilters ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async deleteCategoryFilters(req, res, next) {
        try {
            const {ids,categoryId} = req.body;
            console.log(ids)
            console.log(categoryId)
            if(!(ids.length > 0 && categoryId)){
                return next(apiError.badRequest("Частина данних порожня"));
            }

            await FilterCategoryValue.destroy({where:{category_id:categoryId,filter_value_id:{[Op.in]: ids}}})

            return res.json("done");
        } catch (e) {
            TelegramMsg("TECH", `deleteCategoryFilters ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }
    async addCategoryFilters(req, res, next) {
        try {
            const {ids,categoryId} = req.body;

            if(!(ids.length > 0 && categoryId)){
                return next(apiError.badRequest("Частина данних порожня"));
            }

            for(const id of ids){
                await FilterCategoryValue.findOrCreate({where:{category_id:categoryId,filter_value_id:id}})
            }

            return res.json("done");
        } catch (e) {
            TelegramMsg("TECH", `addCategoryFilters ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async AddAllNotes(req, res, next) {
        try {
            const {notes} = req.body;
            const notFoundNotes = {found:[], not_found:[]}
            const formated = notes.toLowerCase()
                .replace("верхні ноти:","")
                .replace("ноти серця:","")
                .replace("ноти бази:","")
                .replaceAll(" і ",",")
                .replaceAll(";",",")
                .replaceAll(".","")
                .split(",")
            for(const note of formated) {
                const res = await FilterValues.findOne({
                    where:{filter_id:14, name: {[Op.iLike]:note.trim()}}, //14
                    attributes:["name",'id','code'],
                })
                if(res) {
                    notFoundNotes.found.push({
                        name:res.name,
                        code:res.code,
                        id:res.id
                    })
                }else{
                    notFoundNotes.not_found.push(note.trim())
                }
            }

            return res.json(notFoundNotes);
        } catch (e) {
            TelegramMsg("TECH", `AddAllNotes ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async getAllCountries(req, res, next) {
        try {
            await Country.findAll({order: [['name', 'ASC']]}).then(async (countries) => {
                return res.json(countries);
            });
        } catch (e) {
            TelegramMsg("TECH", `getAllCountries ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }
    async getFilters(req, res, next) {
        try {
            const filters = await Filters.findAll({attributes:['id','name', 'code']})
            return res.json(filters);
        } catch (e) {
            TelegramMsg("TECH", `getFilters ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }
    async editFilter(req, res, next) {
        try {
            const {id, name,name_ru,code} = req.body;
            const isValid = /^[0-9a-z]+$/.test(code);

            if(!(id && name && name_ru && code)){
                return next(apiError.badRequest("Частина данних порожня"));
            }

            if(!isValid){
                return next(apiError.badRequest("Код може мати лише 1 слово, маленькими буквами"));
            }

            const filter = await Filters.findOne({where:{code}})
            if(filter && filter.id !== id){
                return next(apiError.badRequest("Такий фільтр вже існує"));
            }

            await Filters.update({name,name_ru,code},{where:{id}})

            return res.json({name,name_ru,code});
        } catch (e) {
            TelegramMsg("TECH", `editFilter ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }
    async createFilter(req, res, next) {
        try {
            const {name,name_ru,code} = req.body;
            const isValid = /^[0-9a-z]+$/.test(code);

            if(!(name && name_ru && code)){
                return next(apiError.badRequest("Частина данних порожня"));
            }

            if(!isValid){
                return next(apiError.badRequest("Код може мати лише 1 слово, маленькими буквами"));
            }

            const filter = await Filters.findOne({where:{code}})
            if(filter){
                return next(apiError.badRequest("Такий фільтр вже існує"));
            }

            const newFilter = await Filters.create({name,name_ru,code})

            return res.json(newFilter);
        } catch (e) {
            TelegramMsg("TECH", `createFilter ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }
    async createFilterValue(req, res, next) {
        try {
            const {name,name_ru,code,filter_id} = req.body;

            const isValid = /^[0-9a-z-]+$/.test(code);

            if(!(name && name_ru && code && filter_id)){
                return next(apiError.badRequest("Частина данних порожня"));
            }

            if(!isValid){
                return next(apiError.badRequest("Код може мати лише дефіс, малі букви та літери"));
            }


            const filterValue = await FilterValues.findOne({where:{code}})
            if(filterValue){
                return next(apiError.badRequest("Таке значення вже існує"));
            }
            const newValue = await FilterValues.create({name,name_ru,code,filter_id})

            return res.json(newValue);
        } catch (e) {
            TelegramMsg("TECH", `createFilterValue ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }
    async editFilterValue(req, res, next) {
        try {
            const {id, name,name_ru,code,filter_id} = req.body;

            const isValid = /^[0-9a-z-]+$/.test(code);

            if(!(id && name && name_ru && code && filter_id)){
                return next(apiError.badRequest("Частина данних порожня"));
            }

            if(!isValid){
                return next(apiError.badRequest("Код може мати лише дефіс, малі букви та літери"));
            }

            const filterValue = await FilterValues.findOne({where:{code}})
            if(filterValue && filterValue.id !== id){
                return next(apiError.badRequest("Такий фільтр вже існує"));
            }

           await FilterValues.update({name,name_ru,code,filter_id},{where:{id}})

            return res.json({name,name_ru,code,filter_id});
        } catch (e) {
            TelegramMsg("TECH", `editFilterValue ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async deleteFilterValue(req, res, next) {
        try {
            const {id} = req.body;

            const filterValue = await FilterValues.findOne({where:{id}})
            if(!filterValue){
                return next(apiError.badRequest("Не вдалося знайти значення"));
            }

            await FilterProductValue.destroy({where:{filter_value_id:id}})
            await FilterValues.destroy({where:{id}})

            return res.json("done");
        } catch (e) {
            TelegramMsg("TECH", `deleteFilterValue ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }
}

module.exports = new filtersController();
