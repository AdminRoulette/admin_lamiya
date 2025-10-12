async function calculateSprayEffect(purposes, paramArray) {
    if (!purposes) {
        return false;
    }

    let purposesArray = [];
    for( const purpose of purposes ) {
        if (purpose.id === 57) {
            purposesArray.push({ name: 'Живить', code: '2267228' });
        }
        if (purpose.id === 68) {
            purposesArray.push({ name: 'Антибактеріальне', code: '2267246' });
        }
        if (purpose.id === 49) {
            purposesArray.push({ name: 'Відбілює', code: '2267312' });
        }
        if (purpose.id === 59) {
            purposesArray.push({ name: 'Захищає від сонця', code: '2267318' });
        }
        if (purpose.id === 65) {
            purposesArray.push({ name: 'Матує', code: '2267330' });
        }
        if (purpose.id === 66) {
            purposesArray.push({ name: 'Освіжає', code: '2267378' });
        }
        if (purpose.id === 92) {
            purposesArray.push({ name: 'Очищає', code: '2267342' });
        }
        if (purpose.id === 62) {
            purposesArray.push({ name: 'Звужує пори', code: '2267444' });
        }
        if (purpose.id === 95) {
            purposesArray.push({ name: 'Антивіковий догляд', code: '2323420' });
        }
        if (purpose.id === 63) {
            purposesArray.push({ name: 'Зміцнює', code: '2323426' });
        }
        if (purpose.id === 90) {
            purposesArray.push({ name: 'Антицелюлітна', code: '2379649' });
        }
        if (purpose.id === 60) {
            purposesArray.push({ name: 'Захищає', code: '2267240' });
        }
        if (purpose.id === 53) {
            purposesArray.push({ name: 'Надає сяйво', code: '3033388' });
        }
        if (purpose.id === 47) {
            purposesArray.push({ name: 'Приховує темні кола під очима', code: '3033381' });
        }
        if (purpose.id === 46) {
            purposesArray.push({ name: 'Приховує почервоніння', code: '3033402' });
        }
        if (purpose.id === 45) {
            purposesArray.push({ name: 'Приховує купероз', code: '3033409' });
        }
        if (purpose.id === 73) {
            purposesArray.push({ name: 'Приховує веснянки та пігментні плями', code: '3033423' });
        }
        if (purpose.id === 94) {
            purposesArray.push({ name: "Пом'якшує", code: '2315752' });
        }
        if (purpose.id === 50) {
            purposesArray.push({ name: 'Відновлює', code: '2267264' });
        }
        if (purpose.id === 61) {
            purposesArray.push({ name: 'Зволожує', code: '2267234' });
        }
        if (purpose.id === 64) {
            purposesArray.push({ name: 'Ліфтинг', code: '2267438' });
        }
    }

    if (purposesArray.length > 0) {
        const names = purposesArray.map(item => item.name).join(',');
        const codes = purposesArray.map(item => item.code).join(',');

        paramArray.push({
            '#': names,
                '@paramid': '200780', '@name': 'Дія', '@valueid': codes
        })
    }
    return true;
}

module.exports = calculateSprayEffect;
