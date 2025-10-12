import React, {useState} from 'react';
import classes from "../../../adminOrder.module.scss";
import {getUserStats} from "@/http/userApi";
import {CheckShift} from "@/http/ExternalApi/checkBoxAPI";
import {BLOG_ROUTE, ORDERS_ROUTE} from "@/utils/constants";
import {useNavigate} from "react-router-dom";

const UserData = ({userData, setUserData, source}) => {
    const [userStats, setUserStats] = useState(null);

    const Name_REGEXP = /^[а-яА-ЯЬьЮюЇїІіЄєҐґёЁыЫэЭъЪ\s'-]+$/;
    const ValidFirstName = (ev) => {
        const event = ev.charAt(0).toUpperCase() + ev.replace('`', "'").toLowerCase().slice(1)
        const firstName = document.getElementById("unCorrectFirstName");
        const firstNameInput = document.getElementById("firstNameInput");
        if (event.length > 1 || event.length < userData.firstName.length) {
            if (event.match(Name_REGEXP) || event === '') {
                setUserData(prev => ({...prev, firstName: event}))
                firstNameInput.style.borderBottom = ""
                firstName.style.display = 'none';
            }
        } else if (event === "") {
            setUserData(prev => ({...prev, firstName: event}))
        } else {
            if (event.match(Name_REGEXP)) {
                setUserData(prev => ({...prev, firstName: event}))
            }
            firstNameInput.style.borderBottom = "1px solid #ff0000"
            firstName.style.display = 'flex';
        }
    }
    const ValidLastName = (event) => {
        let ev_name = event;
        if (event.includes("\n")) {
            const lines = event.split("\n")
            ev_name = source === 'prom' ? lines[0].split(" ")[1] : lines[0].split(" ")[0]
            ValidFirstName(source === 'prom' ? lines[0].split(" ")[0] : lines[0].split(" ")[1])
            ValidPhone(lines[1])
        }
        ev_name = ev_name.charAt(0).toUpperCase() + ev_name.replace('`', "'").toLowerCase().slice(1)
        const lastName = document.getElementById("unCorrectLastName");
        const lastNameInput = document.getElementById("lastNameInput");
        if (ev_name.length > 1 || ev_name.length < userData.lastName.length) {
            if (ev_name.match(Name_REGEXP) || ev_name === '') {
                setUserData(prev => ({...prev, lastName: ev_name}))
                lastNameInput.style.borderBottom = ""
                lastName.style.display = 'none';
            }
        } else if (ev_name === "") {
            setUserData(prev => ({...prev, lastName: ev_name}))
            lastNameInput.style.borderBottom = "1px solid #ff0000"
            lastName.style.display = 'flex';
        } else {
            if (ev_name.match(Name_REGEXP) || ev_name === '') {
                setUserData(prev => ({...prev, lastName: ev_name}))
            }
            lastNameInput.style.borderBottom = "1px solid #ff0000"
            lastName.style.display = 'flex';
        }
    }
    const PHONE_REGEXP = /^[+38]{3}[0-9]+$/;
    const ValidPhone = async (event) => {

        const phone = document.getElementById("unCorrectPhone");
        const phoneInput = document.getElementById("phoneInput");
        event = event.replaceAll(" ", "").replaceAll("+3838", "+38").replaceAll("+38+38", "+38").replaceAll(" ", "").replaceAll("(", "").replaceAll(")", "").replaceAll("-", "");
        if (event.startsWith("380")) {
            event = "+" + event;
        }
        if (event.length < 4) {
            setUserData(prev => ({...prev, mobile: "+38"}))
        } else {
            if (event.match(PHONE_REGEXP) && event.length < 14) {
                setUserData(prev => ({...prev, mobile: event}))
                if (event.length === 13) {
                    await getUserStats({phone:event}).then((data) => {
                        setUserStats(data)
                    }).catch(() => {})
                    phoneInput.style.borderBottom = ""
                    phone.style.display = 'none';
                } else {
                    phoneInput.style.borderBottom = "1px solid #ff0000"
                    phone.style.display = 'flex';
                }
            } else if (event.length === 10 && ("+38" + event).match(PHONE_REGEXP)) {
                setUserData(prev => ({...prev, mobile: "+38" + event}))
            } else if (!event.match(PHONE_REGEXP)) {
                phoneInput.style.borderBottom = "1px solid #ff0000"
                phone.style.display = 'flex';
            }
        }
    }


    return (
        <div className={classes.ttn_modal_user_data_cont}>
            <div>
                <div className={classes.ttn_modal_input_cont}>
                    <label className={classes.ttn_modal_input_label}>Призвіще<sup>*</sup></label>
                    <textarea className={classes.textarea_like_input}
                              value={userData.lastName}
                              formcontrolname="surname"
                              id="lastNameInput"
                              onChange={(event) => ValidLastName(event.target.value)}/>
                    <div className={classes.error_label} id='unCorrectLastName'>Введіть своє призвіще кирилицею</div>
                </div>
                <div className={classes.ttn_modal_input_cont}>
                    <label className={classes.ttn_modal_input_label}>Ім'я<sup>*</sup></label>
                    <input
                        formcontrolname="name"
                        id="firstNameInput"
                        value={userData.firstName}
                        maxLength="40"
                        onChange={(event) => ValidFirstName(event.target.value)}
                        type='text'/>
                    <div className={classes.error_label} id='unCorrectFirstName'>Введіть своє ім'я кирилицею</div>
                </div>
            </div>
            <div>
                <div className={classes.ttn_modal_input_cont}>
                    <label className={classes.ttn_modal_input_label}>Мобільний телефон<sup>*</sup></label>
                    <input value={userData.mobile}
                           id="phoneInput"
                           formcontrolname="phone"
                           inputMode="tel"
                           maxLength="19"
                           onChange={(event) => ValidPhone(event.target.value)}
                           type='tel'/>
                    <div className={classes.error_label} id='unCorrectPhone'>Введіть номер мобільного телефону</div>
                </div>
                {userStats && <div>
                    <div className={classes.ttn_modal_user_info_cont}>
                        <div className={classes.ttn_modal_user_info_block}>
                            <span>Замовлення</span>
                            <div>
                                <div className={classes.ttn_modal_user_info_item}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                         fill="none" stroke="#00A046" strokeWidth="3" strokeLinecap="round"
                                         strokeLinejoin="round">
                                        <path d="M20 6 9 17l-5-5"/>
                                    </svg>
                                    {userStats.completed_orders}
                                </div>
                                <div className={classes.ttn_modal_user_info_item}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                         fill="none" stroke="#F84147" strokeWidth="3" strokeLinecap="round"
                                         strokeLinejoin="round">
                                        <path d="M18 6 6 18"/>
                                        <path d="m6 6 12 12"/>
                                    </svg>
                                    {userStats.failed_orders}
                                </div>
                            </div>
                        </div>
                        <div className={classes.ttn_modal_user_info_block}>
                            <span>Відсоток викупу</span>
                            <div>
                                <div className={classes.ttn_modal_user_info_item}>
                                    {userStats.completed_percent} %
                                </div>
                            </div>
                        </div>
                        <div className={classes.ttn_modal_user_info_item}>
                            <a target="_blank" href={`${ORDERS_ROUTE}/all?phone=${userData.mobile}`}>
                                <span
                                    className={"material-symbols-outlined" + ' ' + classes.icon_item}>open_in_new</span>
                            </a>

                        </div>
                    </div>
                    {userStats.comment &&
                        <div className={classes.ttn_modal_user_info_coment}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                                 strokeLinejoin="round">
                                <path
                                    d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>
                                <path d="M8 12h.01"/>
                                <path d="M12 12h.01"/>
                                <path d="M16 12h.01"/>
                            </svg>
                            {userStats.comment}
                        </div>}
                </div>}
            </div>
        </div>);
};

export default UserData;