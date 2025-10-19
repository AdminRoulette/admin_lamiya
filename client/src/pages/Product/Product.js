import React, {useState, useEffect, useContext} from "react";
import {
    getAdminProducts,
} from "@/http/Product/deviceAPI";
import classes from "./productPage.module.scss"
import {CreateOrder} from "@/http/Order/ordersApi";
import {toast} from "react-toastify";
import DeviceInfo from "./DeviceInfo";
import {Context} from "@/index";
import {ORDERS_ROUTE} from "@/utils/constants";
import CreateDevice from "@/pages/Product/modals/CreateDevice";
import {useNavigate, useParams} from "react-router-dom";
import {getUserBasketDevice} from "@/http/basketApi";
import {runInAction} from "mobx";

const Product = () => {
    const navigate = useNavigate();
    const {'*': filterParams} = useParams();
    const {deviceBasket, user} = useContext(Context);
    const [productList, setProductList] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [copyName, setCopyName] = useState("");
    const [copyDisc, setCopyDisc] = useState("");
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState(filterParams ? filterParams : "");
    const [DiscCopyCounter, setDiscCopyCounter] = useState(1);
    const [NameCopyCounter, setNameCopyCounter] = useState(1);
    const [searchTimeout, setSearchTimeout] = useState(false);
    const [loading, setLoading] = useState(false);
    document.title = "Товари | Lamiya.com.ua";
    const [editingState, setEditingState] = useState({
        isEditing: false, id: undefined,
    });

    useEffect(() => {
        getUserBasketDevice(false).then((data) => {
            runInAction(() => {
                deviceBasket.setDeviceBaskets(data);
            })
        }).catch(error => {
            toast(error.message);
        });
    }, [deviceBasket.deviceBaskets?.length, window.location.href]);

    useEffect(() => {
        getProductsListBySearch()
    }, [search, filterParams,status]);

    const handleSearch = async (value) => {
        if (searchTimeout !== false) {
            clearTimeout(searchTimeout);
        }
        setSearchTimeout(setTimeout(setSearch, 700, value));
    }

    const getALLProductsList = () => {
        if (status) {
            setLoading(true)
            getAdminProducts({status: status}).then((data) => {
                setProductList(data);
            }).catch(error => {
                toast(error.response.data.message)
                setProductList(null);
            }).finally(() => {
                setTimeout(() => setLoading(false), 100);
            });
        } else {
            setProductList(null)
        }
    }

    const getProductsListBySearch = () => {
        if (search !== "" && (search.length > 2 || Number(search))) {
            setLoading(true)
            getAdminProducts({value:search, status:status}).then((data) => {
                setProductList(data);
            }).catch(error => {
                toast(error.response.data.message)
                setProductList(null);
            }).finally(() => {
                setTimeout(() => setLoading(false), 100);
            });
        } else {
            if(status){
                setProductList([])
            }else{
                setProductList(null)
            }

        }
    }

    const ShowCreateProductModal = () => {
        setShowCreateModal(true);
        document.body.style.overflow = 'hidden';
    }

    const handleEdit = (id,type) => {
        setEditingState({
            type: type, id: id,
        });
        ShowCreateProductModal(true);
    };

    const AnimationCreateOrder = async () => {
        const btn = document.querySelector(`#createOrderBtn`);
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = "Створюємо";
            await CreateOrder().then(() => {
                deviceBasket.setDeviceBaskets([]);
                navigate(`${ORDERS_ROUTE}/new`);
            }).catch((error) => {
                toast.error(error.response.data.message);
            })
            window.setTimeout(() => {
                btn.innerHTML = "Створити замовлення";
                btn.disabled = false;
            }, 1000);
        }
    }

    const ChangeStatus = async (value) => {
        setStatus(prev => prev !== value ? value : "");
        if(!productList) setProductList([])
    }

    return (<>
            <div className={classes.product_header}>
                <div className={classes.product_search}>
                    <input type="text"
                           placeholder="Хитрий пошук"
                           onChange={(e) => {
                               handleSearch(e.target.value);
                           }}/>
                </div>
                <div className={classes.product_header_btns}>
                    {(user.user.role?.includes("ADMIN") || user.user.role?.includes("AUTHOR")) &&
                        <button className="second_btn" onClick={() => {
                        ShowCreateProductModal();
                    }}>Додати новий товар</button>}

                    <button id="createOrderBtn" className="custom_btn"
                            onClick={() => AnimationCreateOrder()}>Створити замовлення
                    </button>

                </div>
            </div>
            <div className={classes.company_btn_block}>
                <button
                    className={status === 'active' ? classes.product_company_btn_active : classes.product_company_btn}
                    onClick={() => ChangeStatus('active')}>Активні
                </button>
                <button
                    className={status === 'moderation' ? classes.product_company_btn_active : classes.product_company_btn}
                    onClick={() => ChangeStatus('moderation')}>На модерації
                </button>
                <button
                    className={status === 'ready' ? classes.product_company_btn_active : classes.product_company_btn}
                    onClick={() => ChangeStatus('ready')}>Готові до публікації
                </button>
                <button
                    className={status === 'hidden' ? classes.product_company_btn_active : classes.product_company_btn}
                    onClick={() => ChangeStatus('hidden')}>Приховані
                </button>
            </div>
            {loading ? <div className={classes.product_item_top + ' ' + classes.product_load}></div> : !productList ?
                <div className={classes.product_empty_list}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 64 64"
                        width={64}
                        height={64}>
                        <path fill="#dadcec" d="m40.172 44 3.918-3.917 2.828 2.829-3.917 3.917z"/>
                        <rect
                            width={8.49}
                            height={22.51}
                            x={48.8}
                            y={41.79}
                            fill="#cda1a7"
                            rx={4}
                            ry={4}
                            transform="rotate(-45 53.04 53.04)"
                        />
                        <rect
                            width={4.24}
                            height={22.51}
                            x={49.42}
                            y={43.29}
                            fill="#c4939c"
                            rx={2.12}
                            ry={2.12}
                            transform="rotate(-45 51.542 54.54)"
                        />
                        <path fill="#ffeb9b" d="M25 1a24 24 0 1 0 0 48 24 24 0 1 0 0-48"/>
                        <path
                            fill="#f6d397"
                            d="m11.14 38.86 27.72-27.72a4 4 0 0 1 6.11.54A24 24 0 0 1 11.68 45a4 4 0 0 1-.54-6.14"
                        />
                        <path fill="#bbdef9" d="M25 7a18 18 0 1 0 0 36 18 18 0 1 0 0-36"/>
                        <path fill="#d2edff" d="M25 18a7 7 0 1 0 0 14 7 7 0 1 0 0-14"/>
                        <path
                            fill="#f3f3f3"
                            d="M21 17a4 4 0 1 0 0 8 4 4 0 1 0 0-8m8.5 11a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3"
                        />
                        <path
                            fill="#8d6c9f"
                            d="M38.44 11.57a19 19 0 1 0 0 26.87 18.88 18.88 0 0 0 0-26.87M37 37a17 17 0 1 1 0-24 16.89 16.89 0 0 1 0 24"
                        />
                        <path
                            fill="#8d6c9f"
                            d="M31.2 14.72a12 12 0 0 1 2.28 1.79 1 1 0 1 0 1.42-1.41 14 14 0 0 0-2.67-2.1 1 1 0 0 0-1 1.71zm-4.82-3.65a14 14 0 0 0-11.27 4 1 1 0 1 0 1.41 1.41 12 12 0 0 1 9.67-3.46 1 1 0 1 0 .2-2z"
                        />
                        <path
                            fill="#8d6c9f"
                            d="M61.88 54.46 51.54 44.12a5 5 0 0 0-3.6-1.45c0-.14-2.77-2.91-2.77-2.91a25 25 0 1 0-5.41 5.41s2.78 2.72 2.91 2.77 0 0 0 .07a5 5 0 0 0 1.46 3.54l10.33 10.33a5 5 0 0 0 7.07 0l.34-.34a5 5 0 0 0 0-7.07ZM2 25a23 23 0 1 1 23 23A23 23 0 0 1 2 25m42.12 19.46a5 5 0 0 0-.92 1.32l-1.87-1.87a25 25 0 0 0 2.59-2.59l1.88 1.88a5 5 0 0 0-1.32.92Zm16.34 15.66-.34.34a3 3 0 0 1-4.24 0L45.54 50.12a3 3 0 0 1 0-4.24l.34-.34a3 3 0 0 1 4.24 0l10.34 10.34a3 3 0 0 1 0 4.24"
                        />
                        <path
                            fill="#8d6c9f"
                            d="M34.19 32.78a1 1 0 0 0-1.41 1.41l1.41 1.41a1 1 0 0 0 1.41-1.41zm-18.38 0-1.41 1.41a1 1 0 1 0 1.41 1.41l1.41-1.41a1 1 0 0 0-1.41-1.41M39 24h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2m-25 1a1 1 0 0 0-1-1h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1m11 11a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1m13.28-6.45-1.84-.78a1 1 0 1 0-.78 1.84l1.84.78a1 1 0 1 0 .78-1.84M20.7 35.13a1 1 0 0 0-1.31.53l-.78 1.84a1 1 0 1 0 1.84.78l.78-1.84a1 1 0 0 0-.53-1.31m-5.9-6.01a1 1 0 0 0-1.3-.55l-1.85.75a1 1 0 1 0 .75 1.85l1.85-.75a1 1 0 0 0 .55-1.3m15.62 6.63a1 1 0 0 0-1.85.75l.75 1.85a1 1 0 0 0 1.85-.75z"
                        />
                    </svg>
                    <span>Товари не знайдено</span></div> :
                productList.length > 0 ? productList.map((deviceElem) => {
                    return (<DeviceInfo
                            user={user}
                            setProductList={setProductList}
                            deviceElem={deviceElem}
                            copyName={copyName}
                            handleEdit={handleEdit}
                            setCopyName={setCopyName}
                            copyDisc={copyDisc}
                            setCopyDisc={setCopyDisc}
                            DiscCopyCounter={DiscCopyCounter}
                            setDiscCopyCounter={setDiscCopyCounter}
                            setNameCopyCounter={setNameCopyCounter}
                            NameCopyCounter={NameCopyCounter}
                            key={deviceElem.id}
                        >
                        </DeviceInfo>)
                }) :<div className={classes.upload_all_products}><button className="second_btn" onClick={getALLProductsList}>Завантажити весь розділ</button></div>
            }


            {showCreateModal ? <CreateDevice
                setSearch={setSearch}
                editingState={editingState}
                show={showCreateModal}
                onHide={() => {
                    document.body.style.overflow = '';
                    setEditingState({
                        type: "", id: undefined,
                    });
                    setShowCreateModal(false);
                }}
            /> : <></>}
        </>)
};
export default Product;
