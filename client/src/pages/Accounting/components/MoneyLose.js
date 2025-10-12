import React from 'react';
import classes from "../accounting.module.scss";

const MoneyLose = ({lose,oldLose,calcPercent}) => {
    return (<>
        {lose && oldLose?
            <div className={classes.analytics_box}>
                    <h3>Витрати:</h3>
                <div className={classes.box_row}>
                    <div>
                        <div>Усі витрати</div>
                        <div className={classes.box_value}>{lose.total_lose} грн {calcPercent(lose.total_lose, oldLose.total_lose)}</div>
                    </div>
                    
                </div>
                <div className={classes.box_row}>
                    <div className={classes.two_items}>
                        <div>Маркетплейси</div>
                        <div className={classes.box_value}>{lose.marketplace_lose} грн {calcPercent(lose.marketplace_lose, oldLose.marketplace_lose)}</div>
                    </div>
                    <div className={classes.two_items}>
                        <div>Зарплати</div>
                        <div
                            className={classes.box_value}>{lose.salary_lose} грн {calcPercent(lose.salary_lose, oldLose.salary_lose)}</div>
                    </div>
                </div>
                <div className={classes.box_row}>
                    <div className={classes.two_items}>
                        <div>Оренда</div>
                        <div className={classes.box_value}>{lose.rent_lose} грн {calcPercent(lose.rent_lose, oldLose.rent_lose)}</div>
                    </div>
                    <div className={classes.two_items}>
                        <div>Податки</div>
                        <div
                            className={classes.box_value}>{lose.taxes_lose} грн {calcPercent(lose.taxes_lose, oldLose.taxes_lose)}</div>
                    </div>
                </div>
                <div className={classes.box_row}>
                    <div className={classes.two_items}>
                        <div>Пакування</div>
                        <div className={classes.box_value}>{lose.pack_lose} грн {calcPercent(lose.pack_lose, oldLose.pack_lose)}</div>
                    </div>
                    <div className={classes.two_items}>
                        <div>Інше</div>
                        <div
                            className={classes.box_value}>{lose.another_lose} грн {calcPercent(lose.another_lose, oldLose.another_lose)}</div>
                    </div>
                </div>
            </div> : <></>}

    </>);
};

export default MoneyLose;