import React from 'react';
import classes from "../accounting.module.scss";

const SellInfo = ({analytics,calcPercent,oldAnalytics}) => {
    return (<>
        {analytics && oldAnalytics?
            <div className={classes.analytics_box}>
                    <h3>Продажі</h3>

                <div className={classes.box_row}>
                    <div className={classes.two_items}>
                        <div>Нова пошта</div>
                        <div className={classes.box_value}>{analytics.np_order} шт {calcPercent(analytics.np_order,oldAnalytics.np_order)}</div>
                    </div>
                    <div className={classes.two_items}>
                        <div>Укр пошта</div>
                        <div className={classes.box_value}>{analytics.ukr_order} шт {calcPercent(analytics.ukr_order,oldAnalytics.ukr_order)}</div>
                    </div>
                </div>
                <div className={classes.box_row}>
                    <div className={classes.two_items}>
                        <div>Успішні замовлення НП</div>
                        <div className={classes.box_value}>{analytics.complete_np_order} шт {calcPercent(analytics.complete_np_order,oldAnalytics.complete_np_order)}</div>
                    </div>
                    <div className={classes.two_items}>
                        <div>Успішні замовлення УП</div>
                        <div className={classes.box_value}>{analytics.complete_ukr_order} шт {calcPercent(analytics.complete_ukr_order,oldAnalytics.complete_ukr_order)}</div>
                    </div>
                </div>
                <div className={classes.box_row}>
                    <div>
                        <div>Середній чек</div>
                        <div className={classes.box_value}>{analytics.check} грн {calcPercent(analytics.check,oldAnalytics.check)}</div>
                    </div>
                </div>
            </div> : <></>}

    </>);
};

export default SellInfo;