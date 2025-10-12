async function kastaSPFs(spfs, paramArray) {
    if (!spfs) {
        return false;
    }
    paramArray.push({
        '#': spfs.map(item => `${item.name}`).join(","),
        '@name': 'Ступінь дії'
    })
    return true;
}

module.exports = kastaSPFs;
