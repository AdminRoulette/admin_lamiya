async function IbanPaymentLink({price,order_id}) {

    function encodeToUrlSafeBase64(array) {
        try {
            const utf8String = new TextEncoder().encode(array);
            let base64String = btoa(String.fromCharCode(...utf8String));
            base64String = base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); // URL-безпечне Base64
            return base64String;
        } catch (error) {
            return null;
        }
    }


    function generatePaymentLink({recipientName, iban, amount, edrpou, purpose}) {
        const formattedAmount = `UAH${amount.toFixed(2)}`;

        const paymentData = ['BCD', '002', '1', 'UCT', '', recipientName, iban, formattedAmount, edrpou, '', '', purpose, '',].join('\n');
        return `https://bank.gov.ua/qr/${encodeToUrlSafeBase64(paymentData)}`;
    }

    return generatePaymentLink({
        recipientName: 'ФОП Безсмертна А.О.',
        iban: 'UA353220010000026002330154511',
        amount: price,
        edrpou: '3565302184',
        purpose: `Оплата за товар. Замовлення №${order_id}`
    });


}

module.exports = IbanPaymentLink;
