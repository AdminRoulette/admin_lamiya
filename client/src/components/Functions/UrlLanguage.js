function UrlLanguage(language,url) {
    return language?"/ru" + url:url
}

module.exports = UrlLanguage;