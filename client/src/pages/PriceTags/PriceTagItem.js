import React from 'react';
import classes from './priceTags.module.scss';

const PriceTagItem = ({item, setCheckedList, checked}) => {
    const AddCheckToList = (id) => {
        setCheckedList(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    return (
        <div className={`${classes.item} ${item.printed ? classes.printed : ''}`}>
            <div className={classes.left}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => AddCheckToList(item.id)}
                />
                <div className={classes.details}>
                    <div>{`${item.deviceoption.device.name} ${item.deviceoption.optionName}`}</div>
                    <div>{item.deviceoption.device.series}</div>
                </div>
            </div>
            <div>
                <div>{item.type}</div>
            </div>
            <div className={classes.price}>{item.deviceoption.price} грн</div>
        </div>
    );
};

export default PriceTagItem;
