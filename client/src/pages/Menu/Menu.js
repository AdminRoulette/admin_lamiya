import React, {useContext, useEffect, useState} from 'react';
import classes from "./adminMenu.module.scss";
import {
    ACCOUNTING_ROUTE, BLOG_ROUTE, BRANDS_ROUTE, CASHIERS_ROUTE, CATEGORIES_ROUTE, FINANCE_ROUTE, FOPS_LIST_ROUTE,
    ORDERS_ROUTE, PAYMENTS_ROUTE, PRICETAGS_ROUTE,
    PRODUCT_ROUTE, PROMO_CODES_ROUTE, PRRO_ROUTE, RATINGS_ROUTE,
    SEARCH_ROUTE, SEO_ROUTE, STOCK_HISTORY,
    SUPPLY_ROUTE, TESTING_ROUTE, USERS_ROUTE, USERS_STATS_ROUTE,
    WAIT_PRODUCTS_ROUTE
} from "@/utils/constants";
import {Context} from "@/index";
import NavigateToSite from "@/pages/Menu/modal/NavigateToSite";
import MenuItemBlock from "@/pages/Menu/MenuItemBlock";

const Menu = () => {
    const {user} = useContext(Context).user
    const [navigateVisible, setNavigateVisible] = useState(false);

    useEffect(() => {
        let localStorageMenu = localStorage.getItem("adminMenu");
        const AdminMenu = document.querySelector(`#admin-menu_container`);
        if (localStorageMenu) {
            if (localStorageMenu === "short") {
                AdminMenu.style.width = '50px';
            } else {
                AdminMenu.style.width = '280px';
            }
        } else {
            AdminMenu.style.width = '280px';
        }
    }, []);

    const hideAdminMenu = () => {
        const AdminMenu = document.querySelector(`#admin-menu_container`);
        if (window.screen.width > 950) {
            if (AdminMenu.style.width === "280px") {
                AdminMenu.style.width = '50px';
                localStorage.setItem('adminMenu', "short")
            } else {
                AdminMenu.style.width = '280px';
                localStorage.setItem('adminMenu', "long")
            }
        } else {
            AdminMenu.style.display = 'none';
        }
    }
    return (
        <div className={classes.menu_container} id="admin-menu_container">
            {navigateVisible
                ? <NavigateToSite
                    onHide={() => setNavigateVisible(false)}/>
                : <></>}
            <div className={classes.menu_header}>
                <svg onClick={() => hideAdminMenu()} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                     viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2">
                    <line x1="4" x2="20" y1="12" y2="12"/>
                    <line x1="4" x2="20" y1="6" y2="6"/>
                    <line x1="4" x2="20" y1="18" y2="18"/>
                </svg>
                {/*<svg onClick={() => setNavigateVisible(true)} version="1.0" xmlns="http://www.w3.org/2000/svg"*/}
                {/*     width="150" height="25" viewBox="0 0 2400 500">*/}
                {/*    <path*/}
                {/*        d="M58 243v219h381v-47H148V262h228v-47H148V71h291V24H58v219zm444 0v219h359v-47H592V24h-90v219zm384-81.8c0 87.9.4 141.4 1.1 148.8 4 44.6 19.5 80.7 45.9 107 13.1 13.1 25.5 22 43.5 31 38 19 88.9 28.4 145.5 26.7 75.5-2.3 129.5-21 166.1-57.6 21-21.1 33.1-43.1 40.8-74.3 6.6-26.7 6.4-20.8 6.8-177.1l.4-141.7H1245v138.3c0 147.7-.1 151.9-5 172.5-10.8 45.4-36.3 75.2-75.5 88.1-19 6.2-28.4 7.6-54 7.5-23.6 0-32.1-1-49.2-6-40.6-11.8-68.6-42.8-79.4-88-5.4-22.8-5.2-17.8-5.6-170.7L975.9 24H886v137.2zm537 81.8v219h90V105.9l3.6.3 3.6.3L1637 284l116.8 177.5 59.6.3 59.6.2V24h-91v356h-3.2c-3.3 0-4.7-2.1-120.3-178l-117-178H1423v219zm538 0v219h381v-47h-291V262h228v-47h-228V71h291V24h-381v219z"/>*/}
                {/*</svg>*/}
            </div>
            <div className={classes.menu_body}>
                {(user.role?.includes("ADMIN") || user.role?.includes("SELLER")) &&
                    <MenuItemBlock hideAdminMenu={hideAdminMenu} links={[
                        {name: "Нові", link: `${ORDERS_ROUTE}/new`},
                        {name: "Комплектується", link: `${ORDERS_ROUTE}/in-progress`},
                        {name: "Готові до відправки", link: `${ORDERS_ROUTE}/delivery-ready`},
                        {name: "Доставляються", link: `${ORDERS_ROUTE}/delivering`},
                        {name: "Неуспішні", link: `${ORDERS_ROUTE}/failed`},
                        {name: "Скасовані", link: `${ORDERS_ROUTE}/canceled`},
                        {name: "Всі замовлення", link: `${ORDERS_ROUTE}/all`}
                    ]}
                                   icon={"shopping_cart"}
                                   head={{name: "Замовлення", link: ORDERS_ROUTE}}/>}
                {(user.role?.includes("ADMIN") || user.role?.includes("SELLER") || user.role?.includes("AUTHOR")) &&
                    <MenuItemBlock hideAdminMenu={hideAdminMenu} links={[]}
                                   icon={"inventory_2"}
                                   head={{name: "Товари", link: PRODUCT_ROUTE}}/>}

                {user.role?.includes("ADMIN") &&
                    <>
                        <MenuItemBlock hideAdminMenu={hideAdminMenu} links={[]}
                                       icon={"hourglass_top"}
                                       head={{name: "Чекають товар", link: WAIT_PRODUCTS_ROUTE}}/>
                        <MenuItemBlock hideAdminMenu={hideAdminMenu} links={[
                            {name: "Усі поставки", link: `${SUPPLY_ROUTE}/list`},
                            {name: "Товари", link: `${SUPPLY_ROUTE}/product`}]}
                                       icon={"inventory"}
                                       head={{name: "Постачання", link: SUPPLY_ROUTE}}/>

                        <MenuItemBlock hideAdminMenu={hideAdminMenu} links={[
                            {name: "Оплати на ФОП", link: `${FINANCE_ROUTE}/fop_money`},
                            {name: "Інкасація", link: `${FINANCE_ROUTE}/collection`},
                            {name: "Витрати", link: `${FINANCE_ROUTE}/expenses`},
                            {name: "Список ФОПів", link: `${FINANCE_ROUTE}/fops-list`}
                        ]}
                                       icon={"paid"}
                                       head={{name: "Фінанси", link: PAYMENTS_ROUTE}}/>

                        <MenuItemBlock hideAdminMenu={hideAdminMenu} links={[]}
                                       icon={"calculate"}
                                       head={{name: "Аналітика", link: ACCOUNTING_ROUTE}}/>

                        <MenuItemBlock hideAdminMenu={hideAdminMenu} links={[
                            {name: "Цінники", link: PRICETAGS_ROUTE},
                            {name: "Відгуки", link: RATINGS_ROUTE},
                            {name: "Історія товарів", link: STOCK_HISTORY},
                            {name: "Бренди", link: BRANDS_ROUTE},
                            {name: "Категорії", link: CATEGORIES_ROUTE},
                            {name: "Промокоди", link: PROMO_CODES_ROUTE},
                        ]}
                                       icon={"settings"}
                                       head={{name: "Модерація", link: BRANDS_ROUTE}}/>

                        <MenuItemBlock hideAdminMenu={hideAdminMenu} links={[
                            {name: "Юзери", link: `${USERS_ROUTE}/list`},
                            {name: "Касири", link: `${USERS_ROUTE}/cashiers`},
                            {name: "Статистика Юзерів", link: `${USERS_ROUTE}/stats`}
                        ]}
                                       icon={"account_circle"}
                                       head={{name: "Користувачі", link: BRANDS_ROUTE}}/>

                        <MenuItemBlock hideAdminMenu={hideAdminMenu} links={[
                            {name: "Результати", link: `${SEARCH_ROUTE}/result`}]}
                                       icon={"search"}
                                       head={{name: "Пошук", link: `${SEARCH_ROUTE}/result`}}/>

                        <MenuItemBlock hideAdminMenu={hideAdminMenu} links={[]}
                                       icon={"add_circle"}
                                       head={{name: "Тестування", link: TESTING_ROUTE}}/>
                    </>}

                {(user.role?.includes("ADMIN") || user.role?.includes("AUTHOR")) &&
                        <MenuItemBlock hideAdminMenu={hideAdminMenu} links={[
                            {name: "Статті", link: `${BLOG_ROUTE}/list`},
                            {name: "Автори", link: `${BLOG_ROUTE}/authors`},
                            {name: "Категорії", link: `${BLOG_ROUTE}/categories`}
                        ]}
                                       icon={"script"}
                                       head={{name: "Блог", link: BLOG_ROUTE}}/>
                }
                {(user.role?.includes("ADMIN") || user.role?.includes("SEO")) &&
                    <MenuItemBlock hideAdminMenu={hideAdminMenu} links={[]}
                                   icon={"frame_inspect"}
                                   head={{name: "СЕО", link: SEO_ROUTE}}/>
                }

            {/*ПОКИ ЩО ТАК*/}
                {(user.role?.includes("FILTER")) && <MenuItemBlock hideAdminMenu={hideAdminMenu} links={[
                    {name: "Категорії", link: CATEGORIES_ROUTE},
                ]}
                               icon={"settings"}
                               head={{name: "Модерація", link: BRANDS_ROUTE}}/>}
            </div>
        </div>
    )
        ;
};

export default Menu;
