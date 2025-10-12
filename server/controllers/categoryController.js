const {
    Category,
    Product_Category,
    Search,
    FilterCategoryValue,
    FilterValues,
    Filters, Seo
} = require('../models/models');

const apiError = require("../error/apierror");
const TelegramMsg = require("../functions/TelegramMsg");

class CategoryController {
    async createCategory(req, res, next) {
        try {
            const {name, nameRu, parentId, code, vision} = req.body;
            let level = 3;
            const regex = /^[a-z0-9]+$/;
            if (!regex.test(code)) {
                return next(apiError.badRequest("Не коректний код категорії"));
            }
            if (parentId) {
                const category = await Category.findOne({where: {id: parentId}});
                level = category.level - 1;
            }

            const Categories = await Category.create({name: name, name_ru: nameRu, code, vision, level, parentId});

            await Seo.create({
                url: `/c/${code}`,
                desc: `Великий вибір ${name}🔥 з безкоштовною доставкою ⭐️`,
                title: `${name} купити - інтернет-магазин Lamiya`
            })

            await Seo.create({
                url: `/ru/c/${code}`,
                desc: `Большой выбор ${nameRu}🔥 с бесплатной доставкой ⭐️`,
                title: `${nameRu} купить - интернет-магазин Lamiya`
            })

            return res.json(Categories)
        } catch (e) {
            TelegramMsg("TECH", `createCategory ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async editCategory(req, res, next) {
        try {
            const {id, name, nameRu, parentId, code, vision} = req.body;
            let level = null;
            const regex = /^[a-z0-9]+$/;
            if (!regex.test(code)) {
                return next(apiError.badRequest("Не коректний код категорії"));
            }

            const oldCategory = await Category.findOne({where: {id}});

            if (parentId) {
                const category = await Category.findOne({where: {id: parentId}});
                level = category.level - 1;
            }

            await Category.update({name: name, name_ru: nameRu, code, vision, level, parentId}, {where: {id}});

            await Seo.update({
                url: `/c/${code}`,
                desc: `Великий вибір ${name}🔥 Гелі для душу з безкоштовною доставкою ⭐️`,
                title: `${name} купити - інтернет-магазин Lamiya`
            }, {where: {url: `/c/${oldCategory.code}`}})

            await Seo.update({
                url: `/ru/c/${code}`,
                desc: `Большой выбор ${nameRu}🔥 Гели для душа с бесплатной доставкой ⭐️`,
                title: `${nameRu} купить - интернет-магазин Lamiya`
            }, {where: {url: `/ru/c/${oldCategory.code}`}})

            return res.json({id, name: name, name_ru: nameRu, code, vision, level, parentId})
        } catch (e) {
            TelegramMsg("TECH", `createCategory ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const Categories = await Category.findAll({order: [['name', 'ASC']]})
            return res.json(Categories);
        } catch (e) {
            TelegramMsg("TECH", `getAll Category ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async getAllLinked(req, res, next) {
        try {
            const Categories = await Category.findAll({
                where: {parentId: null}, include: [{
                    model: Category, as: 'child', include: [{
                        model: Category, as: 'child', include: [{
                            model: Category, as: 'child', include: [{
                                model: Category, as: 'child'
                            }]
                        }]
                    }]
                }]
            })
            return res.json(Categories);
        } catch (e) {
            TelegramMsg("TECH", `getAllLinked Category ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async getFiltersCategory(req, res, next) {
        try {
            const {id} = req.query;
            const groupedMap = new Map();

            const filter_values = await FilterValues.findAll({
                include: [{
                    model: Filters
                }, {
                    model: FilterCategoryValue,
                    required: true,
                    where: {category_id: id}
                }],
                raw: true
            })
            for (const val of filter_values) {
                const filterCode = val['filter.code'];
                if (!groupedMap.has(filterCode)) {
                    groupedMap.set(filterCode, {
                        id: val.filter_id,
                        code: filterCode,
                        name: val['filter.name'],
                        values: []
                    });

                }
                groupedMap.get(filterCode).values.push({
                    id: val.id,
                    code: val.code,
                    name: val.name
                });
            }

            return res.json([...groupedMap.values()].sort((a, b) => a.name.localeCompare(b.name)))

        } catch (e) {
            TelegramMsg("TECH", `getFiltersCategory ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async deleteCategory(req, res, next) {
        const {id} = req.query;
        try {
            const category = await Category.findOne({where: {parentId: id}})
            if (category) {
                return next(apiError.badRequest("У цієї категорії, є підкатегорії, видаліть спочатку їх"));
            }
            const oldCategory = await Category.findOne({where: {id: id}})
            await Product_Category.destroy({where: {categoryId: id}});
            await Category.destroy({where: {id}})
            await Seo.destroy({where: {url: `/c/${oldCategory.code}`}})
            await Seo.destroy({where: {url: `/ru/c/${oldCategory.code}`}})

            return res.json("deleted");
        } catch (e) {
            TelegramMsg("TECH", `deleteCategory ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }


}

module.exports = new CategoryController();
