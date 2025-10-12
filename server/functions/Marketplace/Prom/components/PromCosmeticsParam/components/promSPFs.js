async function promSPFs(spfs, paramArray) {
    if (!spfs) {
        return false;
    }
    paramArray.push({
        '#': spfs.map(item => `${item.name}`).join(" | "),
        '@name': 'Фактор захисту'
    })
    return true;
}

module.exports = promSPFs;
