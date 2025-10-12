import React from "react";
import classes from "@/pages/Product/productPage.module.scss";

const SeriesField = ({deviceInfo, OnChangeDevice}) => {

    return (
        <>
            <div>
                <b>Серія:</b>
                <input
                    maxLength={254}
                    placeholder="Серія"
                    type="text"
                    className={!deviceInfo.series && classes.red_input}
                    value={deviceInfo.series || ''}
                    onChange={(event) =>
                        OnChangeDevice(event.target.value, "series",255)
                    }
                />
            </div>
            <div>
                <b>RU Серія:</b>
                <input
                    maxLength={254}
                    placeholder="Російська серія"
                    type="text"
                    className={!deviceInfo.series_ru && classes.red_input}
                    value={deviceInfo.series_ru || ''}
                    onChange={(event) =>
                        OnChangeDevice(event.target.value, "series_ru",255)
                    }
                />
            </div>
        </>
    );
};

export default SeriesField;
