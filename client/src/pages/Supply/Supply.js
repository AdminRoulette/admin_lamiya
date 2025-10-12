import React from 'react';
import "../Product/productPage.module.scss"
import SupplyList from "./components/SupplyList/SupplyList";
import {useParams} from "react-router-dom";
import SupplyProducts from "@/pages/Supply/components/SupplyProducts/SupplyProducts";

const Supply = () => {
    const {supplyParam} = useParams();

    return (
        <>
            {supplyParam === "list"
                ? <SupplyList/>
                : <SupplyProducts/>
            }
        </>
    )
};

export default Supply;