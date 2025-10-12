function CheckLanguage(url) {
   if(url.includes('/ru/')){
      document.documentElement.lang = 'ru';
      return true
   }else{
      return false
   }

}

module.exports = CheckLanguage;