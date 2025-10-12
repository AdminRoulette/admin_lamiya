import React, {useContext, useEffect, useState} from "react";
import {observer} from "mobx-react";
import classes from './Header.module.scss';
import {Context} from "@/index";
import {getUserBasketDevice} from "@/http/basketApi";
import {runInAction} from "mobx";

const CartIcon = observer(({ setCardModalVisible,showMobileMenu}) => {
    const {deviceBasket} = useContext(Context);
    const [count, setCount] = useState(0);
    useEffect(() => {
        getUserBasketDevice(false).then((data) => {
            runInAction(() => {
                deviceBasket.setDeviceBaskets(data);
                if (data.length) {
                    const value = data.reduce((newArr, cur) => {
                        newArr += cur.count;
                        return newArr;
                    }, 0)
                    setCount(value)
                }else{
                    setCount(0)
                }
            })
        }).catch(error => {});
    }, [deviceBasket.deviceBaskets?.length]);


    const showCartModal = () => {
        setCardModalVisible(true);
        showMobileMenu(false);
        document.body.style.overflow = 'hidden';
    }
    return (<a id="open_cart" className={classes.cart_icon} onClick={(e) => {e.preventDefault();showCartModal()}}>
        {count>0?<div className={classes.product_count}>{count}</div>:<></>}
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="29" viewBox="0 0 30 29" fill="none">
                <g clipPath="url(#clip0_3008_19831)">
                    <path className={classes.header_CartIconPath}
                          d="M9.31157 12.6183V6.46081C9.31157 5.09993 9.88938 3.79478 10.9179 2.83249C11.9464 1.8702 13.3414 1.32959 14.7959 1.32959C16.2505 1.32959 17.6454 1.8702 18.674 2.83249C19.7025 3.79478 20.2803 5.09993 20.2803 6.46081V12.6183M3.67218 9.8912L1.82505 26.3111C1.72268 27.221 2.48318 28.0119 3.46159 28.0119H26.1303C26.361 28.0122 26.5893 27.967 26.8002 27.8793C27.0111 27.7916 27.1999 27.6634 27.3543 27.503C27.5088 27.3426 27.6255 27.1536 27.6968 26.9483C27.7681 26.7429 27.7925 26.5258 27.7683 26.3111L25.9197 9.8912C25.877 9.51294 25.6862 9.16285 25.384 8.90841C25.0818 8.65398 24.6897 8.51323 24.2831 8.5133H5.30872C4.46632 8.5133 3.75993 9.10852 3.67218 9.8912ZM19.7319 12.6183C19.7319 12.7544 19.7896 12.8849 19.8925 12.9811C19.9953 13.0773 20.1348 13.1314 20.2803 13.1314C20.4257 13.1314 20.5652 13.0773 20.6681 12.9811C20.7709 12.8849 20.8287 12.7544 20.8287 12.6183C20.8287 12.4822 20.7709 12.3517 20.6681 12.2554C20.5652 12.1592 20.4257 12.1052 20.2803 12.1052C20.1348 12.1052 19.9953 12.1592 19.8925 12.2554C19.7896 12.3517 19.7319 12.4822 19.7319 12.6183ZM8.76313 12.6183C8.76313 12.7544 8.82091 12.8849 8.92377 12.9811C9.02662 13.0773 9.16611 13.1314 9.31157 13.1314C9.45702 13.1314 9.59652 13.0773 9.69937 12.9811C9.80222 12.8849 9.86001 12.7544 9.86001 12.6183C9.86001 12.4822 9.80222 12.3517 9.69937 12.2554C9.59652 12.1592 9.45702 12.1052 9.31157 12.1052C9.16611 12.1052 9.02662 12.1592 8.92377 12.2554C8.82091 12.3517 8.76313 12.4822 8.76313 12.6183Z"
                          stroke="#090214" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round"
                          strokeLinejoin="round"/>
                </g>
                <defs>
                    <clipPath id="clip0_3008_19831">
                        <rect width="29.0769" height="28.6588" fill="white"
                              transform="matrix(-1 0 0 1 29.1621 0.341309)"/>
                    </clipPath>
                </defs>
            </svg>
        </a>);
});

export default CartIcon;
