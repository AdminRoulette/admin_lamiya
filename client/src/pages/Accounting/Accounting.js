import React, {useState, useEffect} from "react";
import {getMoney, getAccountingStock, Revenue, getAnalytics, getMoneyLose} from "@/http/Accounting/AccountingApi";
import classes from "./accounting.module.scss"
import {toast} from "react-toastify";
import AccountingHeader from "@/pages/Accounting/components/AccountingHeader";
import WrongProductCount from "@/pages/Accounting/components/WrongProductCount";
import MoneyLeft from "@/pages/Accounting/components/MoneyLeft";
import OrdersInfo from "@/pages/Accounting/components/OrdersInfo";
import SellInfo from "@/pages/Accounting/components/SellInfo";
import ShopsSellInfo from "@/pages/Accounting/components/ShopsSellInfo";
import MoneyLose from "@/pages/Accounting/components/MoneyLose";
import UsersInfo from "@/pages/Accounting/components/UsersInfo";
import DailyCharts from "@/pages/Accounting/Charts/DailyCharts";


const Accounting = () => {
    const [stock, setStock] = useState(null);
    const [money, setMoney] = useState(null);
    const [lose, setLose] = useState(null);
    const [revenue, setRevenue] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [oldAnalytics, setOldAnalytics] = useState(null);
    const [oldLose, setOldLose] = useState(null);
    let currentDate = new Date();
    let pastDate = new Date();
    pastDate.setDate(currentDate.getDate() - 30);
    const [date, setDate] = useState([pastDate, currentDate]);

    useEffect(() => {
        getAnalytics(date[0].getTime(), date[1].getTime()).then((data) => {
            setAnalytics(data)
                getAnalytics(date[0].getTime() - (date[1].getTime() - date[0].getTime()), date[0].getTime()).then((data) => {
                    setOldAnalytics(data)
                }).catch(error => {
                    toast(error.message)
                })
        }).catch(error => {
            toast(error.message)
        })

        getMoneyLose(date[0].getTime(), date[1].getTime()).then((data) => {
            setLose(data)
            getMoneyLose(+date[0].getTime() - (+date[1].getTime() - +date[0].getTime()), date[0].getTime()).then((data) => {
                setOldLose(data)
            }).catch(error => {
                toast(error.message)
            })
        }).catch(error => {
            toast(error.message)
        })

    }, [date]);

    useEffect(() => {
        Revenue().then((data) => {
            setRevenue(data);
        }).catch(error => {
            toast(error.message)
        })
        getAccountingStock().then((data) => {
            setStock(data);
        }).catch(error => {
            toast(error.message)
        })
        getMoney().then((data) => {
            setMoney(data);
        }).catch(error => {
            toast(error.message)
        })
        document.title = "Аналітика"
    }, []);

    function calcPercent(cur, old) {
        if (!cur || !old) {
            return ""
        }
        const percent = ((cur - old) / cur * 100).toFixed(2)
        return <div className={classes.percent + ' ' + (percent > 0 ? classes.green : classes.red)}>
            <svg className={percent < 0 ? classes.rotate_arrow : ""} xmlns="http://www.w3.org/2000/svg" width="20"
                 height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="3">
                <path d="m5 12 7-7 7 7"/>
                <path d="M12 19V5"/>
            </svg>
            {percent} %</div>
    }

    return (
        <div className={classes.accounting_container}>
            <AccountingHeader setDate={setDate} date={date}/>
            <WrongProductCount stock={stock}/>
            <MoneyLeft money={money} lose={lose} oldLose={oldLose} analytics={analytics} oldAnalytics={oldAnalytics}
                       calcPercent={calcPercent}/>
            <OrdersInfo analytics={analytics} oldAnalytics={oldAnalytics} calcPercent={calcPercent}/>
            <SellInfo analytics={analytics} oldAnalytics={oldAnalytics} calcPercent={calcPercent}/>
            <ShopsSellInfo analytics={analytics} oldAnalytics={oldAnalytics} calcPercent={calcPercent}/>
            <MoneyLose lose={lose} oldLose={oldLose} calcPercent={calcPercent}/>
            <UsersInfo analytics={analytics} oldAnalytics={oldAnalytics} calcPercent={calcPercent}/>
            {revenue?.day?.length > 0 ? <DailyCharts revenue={revenue}/> : <></>}
        </div>
    )

};

export default Accounting;
