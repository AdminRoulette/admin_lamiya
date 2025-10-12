import React, {useContext} from 'react';
import {toast} from "react-toastify";
import {getLongProductInfo} from "@/http/Product/deviceAPI";
import classes from "../productPage.module.scss"
import {Context} from "@/index";
import addDevicetoBasket from "@/components/addDevicetoBasket";
import PriceSpace from "@/components/Functions/PriceSpace";
import OptionItem from "@/pages/Product/modals/components/OptionItem";

const ProductTop = ({
                        setProductList,
                        user,
                        deviceElem,
                        setOpenDisc,
                        openDisc,
                        copyName,
                        setCopyName,
                        copyDisc,
                        setCopyDisc,
                        DiscCopyCounter,
                        setDiscCopyCounter,
                        setNameCopyCounter,
                        NameCopyCounter,
                        handleEdit
                    }) => {
    const {deviceBasket} = useContext(Context);

    const AlertDisc = (e) => {
        let CorrectDisc = deviceElem.disc.replaceAll("<p>", "").replaceAll("</p>", "").replaceAll("<strong>", "")
            .replaceAll("</strong>", "").replaceAll("<br>", "").replaceAll("</li>", "").replaceAll("</ul>", "")
            .replaceAll("</ol>", "").replaceAll("<li>", "").replaceAll("<ul>", "").replaceAll("<ol>", "");
        setCopyDisc(pref => pref + `${deviceElem.name} : \n${CorrectDisc} \n \n`)
        navigator.clipboard.writeText(copyDisc + `${deviceElem.name} : \n${CorrectDisc} \n \n`);
        setDiscCopyCounter(DiscCopyCounter + 1);
        toast(`Опис скопійований - ${DiscCopyCounter}`);
        e.stopPropagation();
    };
    const AlertItem = (e) => {
        setCopyName(pref => pref + `${deviceElem.name} \n`)
        navigator.clipboard.writeText(copyName + `${deviceElem.name} \n`);
        setNameCopyCounter(NameCopyCounter + 1);
        toast(`Назва скопійована - ${NameCopyCounter}`);
        e.stopPropagation();
    };

    const ShowBotInfoBlock = async (event, id) => {
        if (!openDisc) {
            await getLongProductInfo(id).then((longInfo) => {
                setProductList(productList =>
                    productList.map((productElem) => {
                        if (productElem.id === id) {
                            return {
                                ...productElem,
                                ...longInfo
                            }
                        } else {
                            return {...productElem}
                        }
                    })
                )
            }).catch(error => {
                toast(error.message)
            }).finally(() => {
                setOpenDisc(!openDisc)
                event.stopPropagation()
            });
        } else {
            setOpenDisc(!openDisc)
        }
    };

    return (
        <div className={classes.product_item_top} onClick={(event) => ShowBotInfoBlock(event, deviceElem.id)}>
            <div style={{background: `${deviceElem.color}`}} className={classes.color_before}/>
            <span className={"material-symbols-outlined" + ' ' + classes.product_top_arrow}>expand_more</span>
            <div className={classes.product_item_id}>
                <div>#{deviceElem.id}</div>
                {deviceElem?.part_count > 0 && <div>У флаконі: {deviceElem.part_count} мл</div>}
                {deviceElem?.refund_count > 0 && <div>Розпив: {deviceElem.refund_count} мл</div>}
                {deviceElem.options_on_tab[0]?.price && <div>1мл - {Math.floor(deviceElem.options_on_tab[0]?.price / 3)} грн</div>}
            </div>
            <div className={classes.product_item_img}>
                <img alt={deviceElem.name} title={deviceElem.name} src={deviceElem?.image}/>
            </div>
            <div onClick={(e) => AlertItem(e)}
                 className={classes.product_item_name}>
                <div onClick={(e) => AlertItem(e)} className={classes.name_pop + ' ' + classes.pop_up}>
                    <span className="admin_blue_text">{deviceElem.name}</span>
                    <span className="admin_gray_text">Скопіювати назву</span></div>
                <div>{deviceElem.name}</div>
                <div className="admin_gray_text">{deviceElem.series}</div>
            </div>
            <div className={classes.product_item_type}>
                {deviceElem.category}
            </div>

            <div className={classes.product_item_icons}>
                {deviceElem.disc &&
                    <span onClick={(e) => AlertDisc(e)} title={"Копіювати опис"}
                          className={classes.icon_item + ' ' + "material-symbols-outlined"}>content_paste</span>}
                {(user.user.role?.includes("ADMIN") || (user.user.role?.includes("AUTHOR")))  &&
                    <span onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(deviceElem.id, "copy")
                    }} title={"Копіювати товар"}
                          className={classes.icon_item + ' ' + "material-symbols-outlined"}>content_copy</span>}

                {(user.user.role?.includes("ADMIN") || (user.user.role?.includes("AUTHOR"))) &&
                    <span onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(deviceElem.id, "edit")
                    }}
                          className={classes.icon_item + " " + "material-symbols-outlined"}>edit</span>}
            </div>
            <div className={classes.product_options_container}>
                {deviceElem.options_on_tab.length > 0 && <div>
                    <span>Розпив:</span>
                    <div className={classes.product_options}>
                        {deviceElem.options_on_tab.map((OptionsElem) => {
                            return <OptionItem OptionsElem={OptionsElem} deviceBasket={deviceBasket}/>
                        })}
                    </div>
                </div>}
                {deviceElem.options.length > 0 && <div>
                    <span>Товар:</span>
                    <div className={classes.product_options}>
                        {deviceElem.options && deviceElem.options.map((OptionsElem) => {
                            return <OptionItem OptionsElem={OptionsElem} deviceBasket={deviceBasket}/>
                        })}
                    </div>
                </div>}
            </div>
        </div>
    );
};

export default ProductTop;
