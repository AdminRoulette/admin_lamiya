async function Transliterations(word) {

    let converter = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'ґ': 'g', 'д': 'd','ы': 'y',
        'е': 'e', 'є': 'e', 'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'i',
        'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
        'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch',
        'ш': 'sh', 'щ': 'sch', 'ь': '', '`': '', "'": "",
        'ю': 'yu', 'я': 'ya', ' ': '-', '&': '-', '_': '-','#': '','*': '',':': '-',
        '.': '','"': '',',': '','!': '','?': '','+': '','%': '','’': '','/': '-','№': '','(': '',')': ''
    };
    if (word) {
        word = word.toLowerCase();
        let answer = '';
        for (let i = 0; i < word.length; ++i) {
            if (converter[word[i]] === undefined) {
                answer += word[i];
            } else {
                answer += converter[word[i]];
            }
        }

        return answer.replaceAll('---', '-').replaceAll('--', '-');

    }
};

module.exports = Transliterations
