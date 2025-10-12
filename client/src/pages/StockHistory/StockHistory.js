import React, {useState} from 'react';
import classes from './StockHistory.module.scss';
import HistoryProductSelect from "@/pages/StockHistory/components/HistoryProductSelect";
import HistoryOptionSelect from "@/pages/StockHistory/components/HistoryOptionSelect";
import {ORDERS_ROUTE} from "@/utils/constants";
import {getStockHistory} from "@/http/Product/deviceAPI";
import {toast} from "react-toastify";
import {CustomInput} from "@/components/CustomElements/CustomInput";

const StockHistory = () => {
    const [historyList, setHistoryList] = useState([]);
    const [userId, setUserId] = useState(null);
    const [product, setProduct] = useState(null);
    const [option, setOption] = useState(null);
    const [offset, setOffset] = useState(0);
    const [canLoadMore, setCanLoadMore] = useState(true);

    const getHistory = async (actual_offset= 0, loadMore = false) => {
        if(product || userId) {
            await getStockHistory({ids: option ? option.id : product?.deviceoptions?.map(opt => opt.id).join(','), user_id:userId,offset:actual_offset}).then(list => {
                if(list.length < 100) setCanLoadMore(false)
                if(loadMore){
                    setHistoryList(prev => [...list])
                }else{
                    setHistoryList(list)
                }

            }).catch(error => {
                toast.error(error.response.data.message || error.message);
            })
        }
    };

    const loadMore = async () => {
        const calc_offset = offset + 1
        setOffset(calc_offset);
        await getHistory(calc_offset)
    };

    return (
        <div className={classes.history_container}>
            <div className={classes.history_filters}>
                <HistoryProductSelect setProduct={setProduct}/>
                <HistoryOptionSelect options={product?.deviceoptions} setOption={setOption}/>
                <CustomInput
                     value={userId}
                     placeholder={"Ід юзера"}
                     onChange={setUserId}
                />
                <button onClick={()=>getHistory()}>Показати</button>
            </div>
            {historyList.length > 0 && <div className={classes.history_list}>
                {historyList.map((history) => {
                    return (
                        <div>
                            <div><b>{new Date(history.createdAt).toLocaleString('uk-UA', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                timeZone: 'Europe/Kiev',
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: false
                            }).replace(",", "")}</b></div>
                            <div>{history.deviceoption?.device.name} {history.deviceoption?.optionName}</div>

                            {history.order_id ? <div>Замовлення: <a href={`${ORDERS_ROUTE}/all?id=${history.order_id}`} target="_blank"><b>#{history.order_id}</b></a></div> : <div></div>}
                            <div>Дія: <b>{history.action}</b></div>
                            <div>Стара кіл-сть: <b>{history.old_count} шт</b></div>
                            <div>Нова кіл-сть: <b>{history.new_count} шт</b></div>

                            <div>Користувач: <b>{history.user?.lastname} {history.user?.firstname}</b></div>
                        </div>
                    )
                })}
                {canLoadMore && <button onClick={loadMore}>Завантажити ще</button>}
            </div>}
        </div>
    );
};

export default StockHistory;