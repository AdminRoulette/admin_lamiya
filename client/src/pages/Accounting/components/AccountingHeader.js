import React from 'react';
import { DateRangePicker } from 'rsuite';
import classes from "../accounting.module.scss"
import 'rsuite/DateRangePicker/styles/index.css';
const { afterToday } = DateRangePicker;
import { subDays } from "date-fns";

const AccountingHeader = ({date,setDate}) => {

    const Ranges = [
        {
            label: '7 днів',
            value: [subDays(new Date(), 6), new Date()]
        },
        {
            label: '14 днів',
            value: [subDays(new Date(), 13), new Date()]
        },
        {
            label: '30 днів',
            value: [subDays(new Date(), 29), new Date()]
        },
        {
            label: '60 днів',
            value: [subDays(new Date(), 59), new Date()]
        },
    ];

    return (
        <div className={classes.header_container}>
            <DateRangePicker format="dd.MM.yyyy" placeholder="Оберіть дати" ranges={Ranges}
                             value={date} onChange={setDate} character={' - '} showOneCalendar={true}
                             shouldDisableDate={afterToday()}/>
        </div>
    );
};

export default AccountingHeader;