async function calculateSPF(spfs, paramArray) {
    if (!spfs) {
        return false;
    }
    let spfArray = [];
    for(const spf of spfs) {
        if (spf.id === 5) {
            spfArray.push({name: "SPF 50", code: "182257"})
        }else if (spf.id === 4) {
            spfArray.push({name: "SPF 45", code: "1392640"})
        }else if (spf.id === 3) {
            spfArray.push({name: "SPF 40", code: "525865"})
        }else if (spf.id === 3) {
            spfArray.push({name: "SPF 35", code: "525879"})
        }else if (spf.id === 3) {
            spfArray.push({name: "SPF 30", code: "182247"})
        }else if (spf.id === 3) {
            spfArray.push({name: "SPF 25", code: "182252"})
        }else if (spf.id === 1) {
            spfArray.push({name: "SPF 20", code: "182242"})
        }else if (spf.id === 1) {
            spfArray.push({name: "SPF 15", code: "182342"})
        }else if (spf.id === 1) {
            spfArray.push({name: "SPF 10", code: "525886"})
        }else if (spf.id === 1) {
            spfArray.push({name: "SPF 5", code: "1660206"})
        }
        // 525851	SPF 70
        // 4573125	SPF 90
        // 2321632	SPF 75
        // 4184680	SPF 85
        // 1392648	SPF 60
        // 4184677	SPF 110
        // 1975569	SPF 100
        // 4501602	SPF 80
        // 4573128	SPF 95
    }
    

    if (spfArray.length > 0) {
        const names = spfArray.map(item => item.name).join(',');
        const codes = spfArray.map(item => item.code).join(',');

        paramArray.push({
            '#': names,
                '@paramid': '60107', '@name': 'Ступінь захисту', '@valueid': codes
        })
    }
    return true;
}

module.exports = calculateSPF;
