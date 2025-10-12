import React from 'react';
import {useParams} from "react-router-dom";
import Collection from "@/pages/Finance/Collection/Collection";
import FopsList from "@/pages/Finance/FopsList/FopsList";
import Payments from "@/pages/Finance/Payments/Payments";
import Expenses from "@/pages/Finance/Expenses/Expenses";

const Finance = () => {
    const {financeParam} = useParams();
    return (
        <>
            {financeParam === "fop_money"
                ? <Payments/>
                : financeParam === "fops-list"
                    ? <FopsList/>
                    : financeParam === "collection"
                        ? <Collection/>
                        : financeParam === "expenses"
                            ? <Expenses/>
                        :<></>

            }
        </>
    );
};

export default Finance;