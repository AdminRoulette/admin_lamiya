const {
    Device, ParfumePart, DeviceOptions, Orders, OrderDevice, Supply, Brand, Expenses, Accounting, DeliveryOrder, Shops,
    User
} = require("../models/models");
const apiError = require("../error/apierror");
const {Op, literal} = require("sequelize");

class accountingController {

    async calculateMoney(req, res, next) {
        try {
            const now = new Date();
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            startOfLastMonth.setHours(3, 0, 0, 0);

            let money_left = 0;
            let money_back = 0;
            let total_money_card = 0;
            let total_supply_price = 0;
            let total_expenses = 0;
            let shop_cash = 0;

            await Orders.findAll({
                attributes: ['moneyCard', 'status_id'],
                include: [{
                    model: DeliveryOrder,
                    attributes: ['moneyBack']
                }], where: {
                    createdAt: {
                        [Op.gt]: new Date(startOfLastMonth)
                    }
                },
            }).then((orders) => {
                for (const orderElem of orders) {
                    total_money_card += orderElem.moneyCard;
                    if (!(orderElem.statusId === 2 || orderElem.statusId === 9 || orderElem.statusId === 11
                        || orderElem.statusId === 41000 || orderElem.statusId === 48000 || orderElem.statusId === 10111 || orderElem.statusId === 10999)) {
                        money_back += orderElem.delivery_order?.moneyBack ? orderElem.delivery_order?.moneyBack : 0;
                    }
                }
            });

            await Supply.findAll({
                where: {
                    createdAt: {
                        [Op.gt]: new Date(startOfLastMonth)
                    }
                }
            }).then((supplyList) => {
                for (const supply of supplyList) {
                    if (supply.WhoPayed === 0) {
                        total_supply_price += supply.price;
                    }
                }
            })
            await Expenses.findAll({
                where: {
                    createdAt: {
                        [Op.gt]: new Date(startOfLastMonth)
                    }
                }
            }).then((expensesList) => {
                for (const expense of expensesList) {
                    total_expenses += expense.money;
                }
            })
            await Accounting.findOne({
                limit: 1, order: [['id', 'DESC']]
            }).then((accounting) => {
                money_left = accounting.money_left
            })

            await Shops.findOne().then((shop) => {
                shop_cash = shop.cash
            })

            return res.json({
                money_now: money_left + total_money_card - total_expenses - total_supply_price - money_back,
                money_back,
                shop_cash
            });

        } catch (e) {
            next(apiError.badRequest(e.message));
        }
    }

    async accountingStock(req, res, next) {
        try {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(3, 0, 0, 0);
            let stock = {'Аналогові парфуми': 0};
            let last_stock;
            let stock_sold = {'Аналогові парфуми': 0};
            let parfume_tab_stock = 0;
            let stock_bought = {};

            await Orders.findAll({
                include: [{
                    model: OrderDevice, include: [{
                        model: DeviceOptions, include: [{
                            model: Device, include: [{model: ParfumePart}, {model: ParfumePart}, {model: Brand}]
                        }]
                    }]
                }], where: {
                    createdAt: {
                        [Op.gt]: new Date(startOfMonth)
                    }, statusId: {[Op.ne]: 10999}
                },
            }).then((orders) => {
                orders.forEach((orderElem) => {
                    orderElem.order_devices.forEach((OrderDeviceElem) => {
                        let DeviceElem = OrderDeviceElem.deviceoption.device;
                            if (!DeviceElem?.parfumepart || (OrderDeviceElem.deviceoption.weight === DeviceElem.parfumepart.volume && DeviceElem?.parfumepart)) {
                                if (stock_sold[DeviceElem.brand.name]) {
                                    stock_sold[DeviceElem.brand.name] = stock_sold[DeviceElem.brand.name] + OrderDeviceElem.count
                                } else {
                                    stock_sold[DeviceElem.brand.name] = OrderDeviceElem.count
                                }
                            }
                    })
                })
            });

            await Supply.findAll({
                where: {
                    createdAt: {
                        [Op.gt]: new Date(startOfMonth)
                    }
                }
            }).then((supplyList) => {
                supplyList.map((supply) => {
                    JSON.parse(supply.companyList).map((company) => {
                        const brand_name = Object.keys(company)[0];
                        const items_count = company[brand_name];
                        if (items_count) {
                            if (stock_bought[brand_name]) {
                                stock_bought[brand_name] = stock_bought[brand_name] + +items_count
                            } else {
                                stock_bought[brand_name] = +items_count
                            }
                        }
                    })
                })
            })

            await Accounting.findOne({
                limit: 1, order: [['id', 'DESC']]
            }).then((accounting) => {
                last_stock = JSON.parse(accounting.stock)
            })

            let stock_error_count = {};
            for (const brand in stock) {
                let count = +stock[brand]
                let bought_count = Number(stock_bought[brand]) ? stock_bought[brand] : 0
                let sold_count = Number(stock_sold[brand]) ? stock_sold[brand] : 0
                let last_count = Number(last_stock[brand]) ? last_stock[brand] : 0
                if (count - bought_count + sold_count !== last_count) {
                    stock_error_count[brand] = `в базі: ${count} / прораховано: ${last_count + bought_count - sold_count}`
                }
            }

            return res.json({
                stock_error_count,
                parfume_tab_stock
            });

        } catch (e) {
            next(apiError.badRequest(e.message));
        }
    }

    async revenue(req, res, next) {
        try {
            await Orders.findAll({
                order: [['createdAt', 'ASC']], attributes: ['createdAt', 'totalPrice', 'totalProfit'], where: {
                    statusId: {[Op.ne]: 10999}, createdAt: {
                        [Op.gte]: literal('CURRENT_TIMESTAMP - INTERVAL \'31 days\'')
                    }
                }
            }).then(orders => {
                let day = [];
                let totalPrice = [];
                let totalProfit = [];
                let dayCounter = -1;
                for (const order of orders) {
                    if (day[dayCounter] !== new Date(order.createdAt).getDate()) {
                        dayCounter++;
                        day[dayCounter] = new Date(order.createdAt).getDate()
                        totalPrice[dayCounter] = 0;
                        totalProfit[dayCounter] = 0;
                    }
                    totalPrice[dayCounter] += order.totalPrice
                    totalProfit[dayCounter] += order.totalProfit

                }
                return res.json({totalProfit, totalPrice, day})
            })

        } catch (e) {
            next(apiError.badRequest(e.message));
        }
    }

    async getAnalytics(req, res, next) {
        //Потрібно зробити індекс для createdAt??
        try {
            const {start, end} = req.query;
            const startDate = new Date(parseInt(start))
            const endDate = new Date(parseInt(end))

            let total_profit = 0;
            let complete_orders = 0;
            let profit_real_orders = 0;
            let total_real_orders = 0;
            let profit_online_orders = 0;
            let total_online_orders = 0;
            let complete_real_orders = 0;
            let complete_np_order = 0;
            let complete_ukr_order = 0;
            let total_price = 0;
            let orders_count = 0;
            let np_order = 0;
            let ukr_order = 0;
            let payed_orders = 0;
            let failure_orders = 0;
            const new_users = await User.count({
                where: {
                    createdAt: {
                        [Op.and]: {
                            [Op.gt]: startDate,
                            [Op.lt]: endDate
                        }
                    }
                }
            })
            await Orders.findAll({
                attributes: ['createdAt', 'moneyCard', 'totalProfit', 'postMethod', 'totalPrice', 'statusId', 'paymentType'],
                include: [{
                    model: DeliveryOrder,
                }],
                where: {
                    createdAt: {
                        [Op.and]: {
                            [Op.gt]: startDate,
                            [Op.lt]: endDate
                        }
                    }
                }
            }).then(orders => {
                orders_count = orders.length
                for (const order of orders) {
                    total_profit += order.totalProfit
                    if (order.statusId !== 10999) {
                        total_price += order.totalPrice
                        if (order.paymentType === 'card' || order.paymentType === 'mono') {
                            payed_orders++;
                        }
                        if (order.postMethod === 'np') {
                            np_order++;
                        }
                        if (order.postMethod === 'ukr' || order.postMethod === 'ukr_standart') {
                            ukr_order++;
                        }
                    }

                    if (order.delivery_order?.failure) {
                        failure_orders++;
                    }

                    if (order.statusId === 2 || order.statusId === 9 || order.statusId === 11
                        || order.statusId === 41000 || order.statusId === 48000 || order.statusId === 10111) {
                        complete_orders++;
                        if (order.postMethod === 'real') {
                            complete_real_orders++;
                            profit_real_orders += order.totalProfit;
                            total_real_orders += order.totalPrice;
                        } else {
                            profit_online_orders += order.totalProfit;
                            total_online_orders += order.totalPrice;
                        }
                        if (order.postMethod === 'np') {
                            complete_np_order++;
                        }
                        if (order.postMethod === 'ukr' || order.postMethod === 'ukr_standart') {
                            complete_ukr_order++;
                        }
                    }


                }
            })

            return res.json({
                total_profit,
                np_order,
                ukr_order,
                total_price,
                check: parseInt(total_price / orders_count).toFixed(2),
                orders_count,
                new_users,
                complete_orders,
                complete_real_orders,
                complete_np_order,
                complete_ukr_order,
                payed_orders,
                failure_orders,
                check_real:parseInt(total_real_orders/complete_real_orders).toFixed(2),
                profit_real_orders,
                total_real_orders,
                profit_online_orders,
                total_online_orders
            })
        } catch (e) {
            next(apiError.badRequest(e.message));
        }
    }


    async getMoneyLose(req, res, next) {
        //Потрібно зробити індекс для createdAt??
        try {
            const {start, end} = req.query;
            const startDate = new Date(parseInt(start))
            const endDate = new Date(parseInt(end))

            await Expenses.findAll({
                attributes: ['money', 'type'],
                where: {
                    createdAt: {
                        [Op.and]: {
                            [Op.gt]: startDate,
                            [Op.lt]: endDate
                        }
                    }
                }
            }).then(expenses => {
                let total_lose = 0;
                let another_lose = 0;
                let pack_lose = 0;
                let salary_lose = 0;
                let marketplace_lose = 0;
                let rent_lose = 0;
                let taxes_lose = 0;
                let ads_lose = 0;
                for (const exp of expenses) {
                    total_lose += exp.money
                    if (exp.type === 'Інші') {
                        another_lose += exp.money
                    } else if (exp.type === 'Податки') {
                        taxes_lose += exp.money
                    } else if (exp.type === 'Зарплата') {
                        salary_lose += exp.money
                    } else if (exp.type === 'Пакування') {
                        pack_lose += exp.money
                    } else if (exp.type === 'Маркетплейси') {
                        marketplace_lose += exp.money
                    } else if (exp.type === 'Оренда') {
                        rent_lose += exp.money
                    } else if (exp.type === 'Реклама') {
                        ads_lose += exp.money
                    }

                }

                return res.json({
                    total_lose,
                    another_lose,
                    pack_lose,
                    salary_lose,
                    marketplace_lose,
                    rent_lose,
                    taxes_lose,
                    ads_lose
                })
            })


        } catch (e) {
            next(apiError.badRequest(e.message));
        }
    }
}

module.exports = new accountingController();