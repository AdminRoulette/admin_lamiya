import React, {useContext, useEffect, useState} from 'react';
import classes from "@/pages/Header/Cart/Header.module.scss";
import {CloseShift, OpenCashierShift, ShiftStats} from "@/http/ExternalApi/checkBoxAPI";
import {toast} from "react-toastify";
import {Context} from "@/index";
import {observer} from "mobx-react";
import {useNavigate} from "react-router-dom";

const Shift = observer(() => {
    const {shift,user} = useContext(Context);
    const [loadingShift, setLoadingShift] = useState(false);
    const [showDropDown, setShowDropDown] = useState(false);
    const [loadingShiftStats, setLoadingShiftStats] = useState(false);
    const navigate = useNavigate();

    // useEffect(() => {
    //
    // }, [shift]);

    const CloseMyShift = () => {
        setLoadingShift(true)
        CloseShift({id:null}).then((res) => {
            shift.setShift({...shift.Shift,open: false})
            toast(res)
        }).catch(error => {
            toast.error(error?.response?.data.message)
        }).finally(()=>{
            setLoadingShift(false);
            ShowDropDown();
        })
    }

    const OpenShift = () => {
        if (new Date().getHours() !== 23) {
            setLoadingShift(true)
            OpenCashierShift({id:null}).then((res) => {
                shift.setShift({...shift.Shift,open: true})
                toast(res)
            }).catch(error => {
                toast.error(error?.response?.data.message)
            }).finally(()=>{
                setLoadingShift(false);
                ShowDropDown();
            })
        } else {
            toast.error("З 23 по 00 не потрібно відкривати !!!!");
        }
    }

    const ShowDropDown = () => {
        setShowDropDown(prev => !prev)
    }

    const sendShiftStats = async () => {
        setLoadingShiftStats(true)
        await ShiftStats().finally(()=>{
            setLoadingShiftStats(false)
        }).then((msg)=>{
            toast(msg)
        }).catch(error =>{
            toast(error.response.data.message)
        })
    }
    const logout = () => {
        user.setUser({});
        user.setIsAuth(false);
        localStorage.removeItem("token");
        ShowDropDown();
        navigate("/login");
    };

    const ShowMenu = () => {
        const AdminMenu = document.querySelector(`#admin-menu_container`);
        AdminMenu.style.display = "flex"
    }

    return (
        <div className={classes.shift_container}>
            <svg onClick={() => ShowMenu()} xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                 viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="1.5">
                <line x1="4" x2="20" y1="12" y2="12"/>
                <line x1="4" x2="20" y1="6" y2="6"/>
                <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
            <div onClick={() => ShowDropDown()} className={classes.shift_text}>
                {shift.Shift?.open ? <span>Зміна відкрита</span>
                    : <span>Ваша зміна закрита</span>}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2">
                    <path d="m6 9 6 6 6-6"/>
                </svg>
            </div>

            {showDropDown && <div className={classes.shift_drop_down}>
                {!loadingShift && shift.Shift?
                    shift.Shift?.open ?
                        <button onClick={() => CloseMyShift()} className="second_btn">Закрити зміну</button>
                        : <button onClick={() => OpenShift()} className="second_btn">Відкрити зміну</button>
                    : <div className="loaded"></div>}
                {!loadingShiftStats?
                <button onClick={() => sendShiftStats()} className="second_btn">Статистика зміни</button>
                    :<div className="loaded"></div>}
                <div className={classes.logout}>
                    <span onClick={logout}>Вийти</span>
                </div>
            </div>}
        </div>
    );
});

export default Shift;
