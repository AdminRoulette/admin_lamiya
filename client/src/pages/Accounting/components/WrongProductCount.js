import React from 'react';
import classes from "../accounting.module.scss";

const WrongProductCount = ({stock}) => {
    return (<>
        {stock ?
            <div className={classes.analytics_box}>
                <h3>Залишки</h3>
                <div className={classes.box_row} style={{flexDirection: "column"}}>
                    {Object.keys(stock.stock_error_count).length !== 0 ?
                        <>
                            {Object.keys(stock.stock_error_count).map((product, index) => {
                                return <div style={{width: "100%"}} key={index}>
                                    <b>{product}</b> {stock.stock_error_count[product]}</div>
                            })}
                        </>
                        : <>🎉 Усе зійшлося! 🥳</>
                    }
                </div>
                <div className={classes.box_row}>
                    <div>
                        <div>Розпив оригіналів</div>
                        <div className={classes.box_value}>{stock.parfume_tab_stock} мл</div>
                    </div>
                </div>

            </div> : <></>}

    </>);
};

export default WrongProductCount;