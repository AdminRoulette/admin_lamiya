import React, {useState} from 'react';
import classes from "@/pages/Menu/adminMenu.module.scss";
import {useNavigate} from "react-router-dom";

const MenuItemBlock = ({links, icon, head,hideAdminMenu}) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(icon === 'shopping_cart');

    const onClickBlock = async (e) => {
        e.preventDefault();
        if (links.length > 0) {
            setIsOpen(prev => !prev);
        } else {
            navigateAdminMenu(head.link)
        }

    }

    const navigateAdminMenu = (link) => {
        if (window.screen.width < 951) {
            hideAdminMenu()
        }
        navigate(link)
    }

    return (<>
        <div
            className={`${classes.menu_block} ${window.location.pathname.startsWith(head.link) ? classes.menu_active_page : ""}`}
            onClick={onClickBlock}>
            <div>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <a href={head.link}>{head.name}</a>
            {links.length > 0 && <div className={isOpen && classes.menu_arrow}>
                <span className="material-symbols-outlined">navigate_next</span>
            </div>}
        </div>
        {(links.length > 0 && isOpen) &&
            <div className={isOpen ? classes.open_menu_dropDown :classes.menu_dropDown}>
                {links.map((item) => {
                    return (<a href={item.link} key={item.link}
                               className={`${window.location.pathname.startsWith(item.link) ? classes.menu_active_page : ""} ${classes.menu_dropDown_option}`}
                               onClick={(e) => {
                                   e.preventDefault();
                                   navigateAdminMenu(item.link)
                               }}>{item.name}</a>)
                })}
            </div>}
    </>);
};

export default MenuItemBlock;