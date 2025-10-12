import React from 'react';
import classes from "../accounting.module.scss";

const MoneyLose = ({analytics,calcPercent,oldAnalytics}) => {
    return (<>
        {analytics && oldAnalytics?
            <div className={classes.analytics_box}>
                <h3>Користувачі</h3>
                <div className={classes.box_row}>
                    <div>
                        <div>Нові користувачі</div>
                        <div className={classes.box_value}>{analytics.new_users} шт {calcPercent(analytics.new_users,oldAnalytics.new_users)}</div>
                    </div>
                </div>
            </div> : <></>}

    </>);
};

export default MoneyLose;