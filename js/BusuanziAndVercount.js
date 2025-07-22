const show_vercount_site_uv = document.getElementById("show_vercount_value_site_uv");
const show_vercount_site_pv = document.getElementById("show_vercount_value_site_pv");
const show_vercount_page_pv = document.getElementById("show_vercount_value_page_pv");
const show_vercount_time = document.getElementById("show_vercount_time");

const show_busuanzi_site_uv = document.getElementById("show_busuanzi_value_site_uv");
const show_busuanzi_site_pv = document.getElementById("show_busuanzi_value_site_pv");
const show_busuanzi_page_pv = document.getElementById("show_busuanzi_value_page_pv");
const show_busuanzi_time = document.getElementById("show_busuanzi_time");

let busuanzi = localStorage.getItem('busuanziData'); //{"site_uv":51948110,"page_pv":49,"version":2.4,"site_pv":75459725}
let vercount = localStorage.getItem('visitorCountData'); // {"site_uv":10975,"site_pv":64107680,"page_pv":24}

let count = 0;
let vercount_update = false;
let vercount_update_again = false;
let busuanzi_update = false;
const intervalId = setInterval(() => {
    busuanzi = localStorage.getItem('busuanziData'); //{"site_uv":51948110,"page_pv":49,"version":2.4,"site_pv":75459725}
    vercount = localStorage.getItem('visitorCountData'); // {"site_uv":10975,"site_pv":64107680,"page_pv":24}

    if (busuanzi) {
        const busuanziData = JSON.parse(busuanzi);
        console.log("Busuanzi Data:", busuanziData);
        if (show_busuanzi_site_pv.innerText !== busuanziData.site_pv ||
            show_busuanzi_site_uv.innerText !== busuanziData.site_uv ||
            show_busuanzi_page_pv.innerText !== busuanziData.page_pv) {
            show_busuanzi_site_pv.innerText = busuanziData.site_pv;
            show_busuanzi_site_uv.innerText = busuanziData.site_uv;
            show_busuanzi_page_pv.innerText = busuanziData.page_pv;
            show_busuanzi_time.innerText = new Date().toLocaleString();
            busuanzi_update = true;
        }
    }
    if (vercount) {
        const vercountData = JSON.parse(vercount);
        console.log("Vercount Data:", vercountData);
        if (show_vercount_site_pv.innerText !== vercountData.site_pv ||
            show_vercount_site_uv.innerText !== vercountData.site_uv ||
            show_vercount_page_pv.innerText !== vercountData.page_pv) {
            show_vercount_site_pv.innerText = vercountData.site_pv;
            show_vercount_site_uv.innerText = vercountData.site_uv;
            show_vercount_page_pv.innerText = vercountData.page_pv;
            show_vercount_time.innerText = new Date().toLocaleString();
            if (vercount_update_again) {
                vercount_update = true;
            } else {
                vercount_update_again = true;
            }
        }
    }

    count++;
    if (count === 10 || (vercount_update && busuanzi_update)) {
        clearInterval(intervalId);
        if (show_vercount_site_pv.innerText === "loading" && show_vercount_site_uv.innerText === "loading" &&
            show_vercount_page_pv.innerText === "loading") {
            show_vercount_site_pv.innerText = "Timeout";
            show_vercount_site_uv.innerText = "Timeout";
            show_vercount_page_pv.innerText = "Timeout";
            show_vercount_time.innerText = new Date().toLocaleString();
        }
        if (show_busuanzi_site_pv.innerText === "loading" && show_busuanzi_site_uv.innerText === "loading" &&
            show_busuanzi_page_pv.innerText === "loading") {
            show_busuanzi_site_pv.innerText = "Timeout";
            show_busuanzi_site_uv.innerText = "Timeout";
            show_busuanzi_page_pv.innerText = "Timeout";
            show_busuanzi_time.innerText = new Date().toLocaleString();
        }
    }
}, 500); 