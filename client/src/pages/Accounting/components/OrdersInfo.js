import React from 'react';
import classes from "../accounting.module.scss";

const OrdersInfo = ({analytics,oldAnalytics,calcPercent}) => {
    return (<>
        {analytics && oldAnalytics?
            <div className={classes.analytics_box}>
                <h3>Замовлення</h3>
                <div className={classes.box_row}>
                    <div className={classes.two_items}>
                        <div>Успішні замовлення</div>
                        <div className={classes.box_value}>{analytics.complete_orders} шт {calcPercent(analytics.check,oldAnalytics.check)}</div>
                    </div>
                    <div className={classes.two_items}>
                        <div>Не отримані замовлення</div>
                        <div className={classes.box_value}>{analytics.failure_orders} шт {calcPercent(analytics.failure_orders,oldAnalytics.failure_orders)}</div>
                    </div>
                </div>
                <div className={classes.box_row}>
                    <div>
                        <div>Оплачених замовлень</div>
                        <div className={classes.box_value}>{analytics.payed_orders} шт {calcPercent(analytics.payed_orders,oldAnalytics.payed_orders)}</div>
                    </div>
                </div>


            </div> : <></>}

    </>);
};

export default OrdersInfo;