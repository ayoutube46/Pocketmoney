/* Runs in <head> so the saved colour palette is applied before first paint */
(function(){try{document.documentElement.setAttribute('data-p',localStorage.getItem('pal')||'sensei')}catch(e){}})();
