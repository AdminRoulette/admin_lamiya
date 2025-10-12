import {$authHost} from "../index";

export const CreateOrder = async () => {
    const {data} = await $authHost.get("api/orders/create")
    return data;
};

export const getZebraTTN = async ({orderId}) => {
    const {data} = await $authHost.get(`api/orders/get-zebra-ttn?orderId=${orderId}`, {
        responseType: "blob",
    });
    return data;
};

export const CompleteOrder = async ({fop_id,
                                        cityRef,
                                        postMethod,
                                        orderId,
                                        moneyLose,
                                        promoCode,
                                        firstName,
                                        lastName,
                                        source,
                                        mobile,
                                        warehouseRef,
                                        deliveryPay,
                                        moneyBack,
                                        ttn,
                                        payments,
                                        partPaymentAmount,
                                        partPaymentPhone,
                                        streetRef,
    house,
    apartment
                                    }) => {
    const {data} = await $authHost.put("api/orders/create-ttn", {
        cityRef,
        fop_id,
        postMethod,
        orderId,
        moneyLose,
        promoCode,
        firstName,
        lastName,
        mobile,
        warehouseRef,
        deliveryPay,
        moneyBack,
        ttn,
        payments,
        source,
        partPaymentAmount,
        partPaymentPhone,
        streetRef,
        house,
        apartment
    });
    return data;
};
export const CompleteRealOrder = async ({
                                            postMethod, orderId, moneyLose, promoCode, payments,finance_phone,partPaymentAmount,amountPaid
                                        }) => {
    const {data} = await $authHost.put("api/orders/create-real-order", {
        postMethod, orderId, moneyLose, promoCode, payments,finance_phone,partPaymentAmount,amountPaid
    });
    return data;
};
export const OrderWithOutPRRO = async ({orderId, moneyLose}) => {
    const {data} = await $authHost.put("api/orders/OrderWithOutPRRO", {orderId, moneyLose});
    return data;
};

export const DeliveryReady = async ({orderId}) => {
    const {data} = await $authHost.put("api/orders/delivery-ready", {orderId});
    return data;
};
export const PackingStatus = async ({orderId}) => {
    const {data} = await $authHost.put("api/orders/packing-status", {orderId});
    return data;
};
export const CompleteRealStatus = async ({orderId}) => {
    const {data} = await $authHost.put("api/orders/complete-real-status", {orderId});
    return data;
};
export const ChangeCreateStore = async ({orderId}) => {
    const {data} = await $authHost.put("api/orders/create-store-status", {orderId});
    return data;
};

export const ApprovalPayment = async ({orderId}) => {
    const {data} = await $authHost.put("api/orders/approval-payment", {orderId});
    return data;
};

export const EditPrivacyComment = async ({orderId,comment}) => {
    const {data} = await $authHost.put("api/orders/edit-privacy_comment", {orderId,comment});
    return data;
};

export const EditOrder = async ({orderDevices, orderId}) => {
    const {data} = await $authHost.put("api/orders/edit-product", {orderDevices, orderId});
    return data;
};

export const getOrderEdit = async (id) => {
    const {data} = await $authHost.get(`api/orders/get-order-info-edit/${id}`);
    return data;
};


export const cancelOrder = async ({moneyLose, orderId, refuse}) => {
    const {data} = await $authHost.post(`api/orders/cancel`, {moneyLose, orderId, refuse});
    return data;
};

export const getAdminListOrders = async ({type, query}) => {
    const {data} = await $authHost.get(`api/orders/getList/${type}${query ? `?${query}` : ""}`);
    return data;
};

