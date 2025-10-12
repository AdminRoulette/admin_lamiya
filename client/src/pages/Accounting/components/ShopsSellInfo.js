import React from 'react';
import classes from "../accounting.module.scss";

const ShopsSellInfo = ({analytics,calcPercent,oldAnalytics}) => {
    return (<>
        {analytics && oldAnalytics?
            <div className={classes.analytics_box}>
                    <h3>Продажі в магазинах</h3>
                <div className={classes.box_row}>
                    <div>
                        <div>Кількість замовлень</div>
                        <div className={classes.box_value}>{analytics.complete_real_orders} шт {calcPercent(analytics.complete_real_orders,oldAnalytics.complete_real_orders)}</div>
                    </div>
                </div>
                <div className={classes.box_row}>
                    <div className={classes.two_items}>
                        <div>Дохід</div>
                        <div className={classes.box_value}>{analytics.total_real_orders} грн {calcPercent(analytics.total_real_orders,oldAnalytics.total_real_orders)}</div>
                    </div>
                    <div className={classes.two_items}>
                        <div>Прибуток</div>
                        <div className={classes.box_value}>{analytics.profit_real_orders} грн {calcPercent(analytics.profit_real_orders,oldAnalytics.profit_real_orders)}</div>
                    </div>
                </div>

                <div className={classes.box_row}>
                    <div>
                        <div>Середній чек</div>
                        <div className={classes.box_value}>{analytics.check_real} грн {calcPercent(analytics.check_real,oldAnalytics.check_real)}</div>
                    </div>
                </div>
            </div> : <></>}

    </>);
};

export default ShopsSellInfo;