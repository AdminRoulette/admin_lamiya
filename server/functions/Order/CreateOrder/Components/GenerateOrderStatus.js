async function GenerateOrderStatus(status_id,language = false) {
    let status = language?"Неизвестный статус":"Невідомий статус"
    if (status_id === "new") {
        status = language?"Новый заказ":"Нове замовлення"
    } else if (status_id === 'created') {
        status = language?"Созданный заказ":"Створене замовлення"
    } else if (status_id === 'packing') {
        status = language?"Комплектуется":"Комплектується"
    } else if (status_id === 'in_store') {
        status = language?"Готово к вручению":"Готове до вручення"
    } else if (status_id === 'ready-delivery') {
        status = language?"Готов к отправке":"Готове до відправлення"
    } else if (status_id === 'delivery') {
        status = language?"Доставляется":"Доставляється"
    } else if (status_id === 'ready-pickup') {
        status = language?"Ожидает в пункте выдачи":"Очікує в пункті видачі"
    } else if (status_id === 'refused') {
        status = language?"Отказ от получения":"Відмова від отримання"
    } else if (status_id === 'refused-return') {
        status = language?"Отказ. Вернулся в отделение":"Відмова. Повернувся у відділення"
    } else if (status_id === 'cancelled-us') {
        status = language?"Отказ. Отменен":"Відмова. Скасоване"
    } else if (status_id === 'cancelled') {
        status = language?"Заказ отменен":"Замовлення скасовано"
    } else if (status_id === 'completed') {
        status = language?"Заказ выполнен":"Замовлення виконано"
    }
    return status;
}

module.exports = GenerateOrderStatus;