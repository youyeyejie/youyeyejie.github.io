const imgs = [
    "/img/banner/banner.webp",
    "/img/banner/banner1.webp",
    "/img/banner/banner2.webp",
    "/img/banner/banner3.webp",
    "/img/banner/banner4.webp",
    // "/img/banner/banner5.webp",
    "/img/banner/banner6.webp",
    // "/img/banner/banner7.webp",
    "/img/banner/banner8.webp",
    "/img/banner/banner9.webp",
    "/img/banner/banner10.webp",
    "/img/banner/banner11.webp",
    "/img/banner/banner12.webp",
    "/img/banner/banner13.webp",
    "/img/banner/banner14.webp",
    "/img/banner/banner15.webp",
]

const random_banner = imgs[Math.floor(Math.random() * imgs.length)];
const banner = document.getElementById('banner');
if (banner) {
    const metaOgType = document.querySelector('meta[property="og:type"]');
    console.log(" metaOgType.content: ", metaOgType ? metaOgType.content : "not found");
    if (metaOgType && metaOgType.content === "article") {
        const background = banner.style.background;
        if (background.includes("/img/banner/random.webp")) {
            banner.style.background = `url(${random_banner}) center center / cover no-repeat`;
        }
    }
    const metaOgUrl = document.querySelector('meta[property="og:url"]');
    if (metaOgUrl && metaOgUrl.content.includes("DayDream-Gallery")) {
        banner.style.background ='url("/img/banner/banner4.webp") center center / cover no-repeat';
    }
}