const show_vercount_site_uv = document.getElementById("show_vercount_value_site_uv");
const vercount_site_uv = document.getElementById("vercount_value_site_uv");
const show_vercount_site_pv = document.getElementById("show_vercount_value_site_pv");
const vercount_site_pv = document.getElementById("vercount_value_site_pv");
const show_vercount_page_pv = document.getElementById("show_vercount_value_page_pv");
const vercount_page_pv = document.getElementById("vercount_value_page_pv");
const show_vercount_time = document.getElementById("show_vercount_time");

const show_busuanzi_site_uv = document.getElementById("show_busuanzi_value_site_uv");
const busuanzi_site_uv = document.getElementById("busuanzi_value_site_uv");
const show_busuanzi_site_pv = document.getElementById("show_busuanzi_value_site_pv");
const busuanzi_site_pv = document.getElementById("busuanzi_value_site_pv");
const show_busuanzi_page_pv = document.getElementById("show_busuanzi_value_page_pv");
const busuanzi_page_pv = document.getElementById("busuanzi_value_page_pv");
const show_busuanzi_time = document.getElementById("show_busuanzi_time");


let count = 0;
const intervalId = setInterval(() => {
    if (show_vercount_site_pv.innerText !== vercount_site_pv.innerText ||
        show_vercount_site_uv.innerText !== vercount_site_uv.innerText ||
        show_vercount_page_pv.innerText !== vercount_page_pv.innerText) {
        show_vercount_site_pv.innerText = vercount_site_pv.innerText;
        show_vercount_site_uv.innerText = vercount_site_uv.innerText;
        show_vercount_page_pv.innerText = vercount_page_pv.innerText;
        show_vercount_time.innerText = new Date().toLocaleString();
    }
    if ((show_busuanzi_site_pv.innerText !== busuanzi_site_pv.innerText ||
        show_busuanzi_site_uv.innerText !== busuanzi_site_uv.innerText ||
        show_busuanzi_page_pv.innerText !== busuanzi_page_pv.innerText) &&
        (busuanzi_site_pv.innerText !== vercount_site_pv.innerText ||
        busuanzi_site_uv.innerText !== vercount_site_uv.innerText ||
        busuanzi_page_pv.innerText !== vercount_page_pv.innerText
        )) {
        show_busuanzi_site_pv.innerText = busuanzi_site_pv.innerText;
        show_busuanzi_site_uv.innerText = busuanzi_site_uv.innerText;
        show_busuanzi_page_pv.innerText = busuanzi_page_pv.innerText;
        show_busuanzi_time.innerText = new Date().toLocaleString();
    }

    count++;
    if (count === 10) {
        clearInterval(intervalId);
        if (show_vercount_site_pv.innerText === "loading" && show_vercount_site_uv.innerText === "loading" &&
            show_vercount_page_pv.innerText === "loading") {
            show_vercount_site_pv.innerText = "Timeout";
            show_vercount_site_uv.innerText = "Timeout";
            show_vercount_page_pv.innerText = "Timeout";
            show_vercount_time.innerText = new Date().toLocaleString();
        }
        if ((show_busuanzi_site_pv.innerText === show_vercount_site_pv.innerText && 
            show_busuanzi_site_uv.innerText === show_vercount_site_uv.innerText &&
            show_busuanzi_page_pv.innerText === show_vercount_page_pv.innerText) ||
            (show_busuanzi_site_pv.innerText === "loading" && show_busuanzi_site_uv.innerText === "loading" &&
            show_busuanzi_page_pv.innerText === "loading")) {
            show_busuanzi_site_pv.innerText = "Timeout";
            show_busuanzi_site_uv.innerText = "Timeout";
            show_busuanzi_page_pv.innerText = "Timeout";
            show_busuanzi_time.innerText = new Date().toLocaleString();
        }
    }
}, 500); 



