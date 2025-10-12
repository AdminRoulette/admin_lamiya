import React from 'react';
import classes from "../accounting.module.scss";

const MoneyLeft = ({money, lose, oldLose, analytics, oldAnalytics, calcPercent}) => {
    return (<>
        {money && analytics && oldAnalytics && lose && oldLose?
            <div className={classes.analytics_box}>
                <h3>Кошти</h3>
                <div className={classes.box_row}>
                    <div className={classes.two_items}>
                        <div>Повино бути коштів</div>
                        <div className={classes.box_value}>{money.money_now} грн.</div>
                    </div>
                    <div className={classes.two_items}>
                        <div>В кассах магазину</div>
                        <div className={classes.box_value}>{money.shop_cash} грн</div>
                    </div>

                </div>
                <div className={classes.box_row}>
                    <div className={classes.two_items}>
                        <div>Накладені платежі в дорозі</div>
                        <div className={classes.box_value}>{money.money_back} грн</div>
                    </div>
                    <div className={classes.two_items}>
                        <div>Прибуток</div>
                        <div
                            className={classes.box_value}>{analytics.total_profit} грн {calcPercent(analytics.total_profit, oldAnalytics.total_profit)}</div>
                    </div>
                </div>
                <div className={classes.box_row}>
                    <div className={classes.two_items}>
                        <div>Дохід</div>
                        <div
                            className={classes.box_value}>{analytics.total_price} грн {calcPercent(analytics.total_price, oldAnalytics.total_price)}</div>
                    </div>
                    <div className={classes.two_items}>
                        <div>Чистий прибуток</div>
                        {lose && oldLose ?
                            <div className={classes.box_value}>{analytics.total_profit - lose.total_lose} грн
                                {calcPercent(analytics.total_profit - lose.total_lose, oldAnalytics.total_profit - oldLose.total_lose)}</div> : <></>}
                    </div>
                </div>
            </div> : <></>}

    </>);
};

export default MoneyLeft;