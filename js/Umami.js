function umamiTrackEvent() {
    const navbar_brand = document.querySelector('.navbar-brand');
    if (navbar_brand) {
        navbar_brand.dataset.umamiEvent = "Homepage";
    }

    const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
    navLinks.forEach(link => {
        if (link.pathname === '/') {
            link.dataset.umamiEvent = "Homepage";
        } else if (link.pathname === '/archives/') {
            link.dataset.umamiEvent = "Archives";
        } else if (link.pathname === '/categories/') {
            link.dataset.umamiEvent = "Categories";
        } else if (link.pathname === '/tags/') {
            link.dataset.umamiEvent = "Tags";
        } else if (link.pathname === '/categories/DayDream-Gallery/') {
            link.dataset.umamiEvent = "DayDream Gallery";
        } else if (link.pathname === '/about/') {
            link.dataset.umamiEvent = "About";
        } else if (link.pathname === '/links/') {
            link.dataset.umamiEvent = "Links";
        } else if (link.href === 'https://www.travellings.cn/go-by-clouds.html') {
            link.dataset.umamiEvent = "Travelling";
            link.target = "_blank";
        } else if (link.ariaLabel === "Search") {
            link.dataset.umamiEvent = "Search";
        } else if (link.ariaLabel === "Color Toggle") {
            link.dataset.umamiEvent = "Color Toggle";
        }
    });
    
    const iconLinks = document.querySelectorAll('.nav.icon-only.fix-cursor-default');
    iconLinks.forEach(link => {
        if (link.ariaLabel === "back") {
            link.dataset.umamiEvent = "Backward";
        } else if (link.ariaLabel === "forward") {
            link.dataset.umamiEvent = "Forward";
        } else if (link.ariaLabel === "reload") {
            link.dataset.umamiEvent = "Reload";
        } else if (link.ariaLabel === "top") {
            link.dataset.umamiEvent = "Go to Top";
        } else if (link.ariaLabel === "bottom") {
            link.dataset.umamiEvent = "Go to Bottom";
        }
    });

    const menuItems = document.querySelectorAll('.vlts-menu.fix-cursor-default');
    menuItems.forEach(item => {
        if (item.onclick?.toString().includes('copyLink')) {
            item.dataset.umamiEvent = "Copy Link";
        } else if (item.onclick?.toString().includes('copySelectedText')) {
            item.dataset.umamiEvent = "Copy Selected Text";
        } else if (item.onclick?.toString().includes('searchSelectedTextBING')) {
            item.dataset.umamiEvent = "Search Selected in BING";
        } else if (item.onclick?.toString().includes('goToLink')) {
            item.dataset.umamiEvent = "Go to Link";
        } else if (item.onclick?.toString().includes('downloadImage')) {
            item.dataset.umamiEvent = "Download Image";
        } else if (item.onclick?.toString().includes('copyImageLink')) {
            item.dataset.umamiEvent = "Copy Link";
        } else if (item.onclick?.toString().includes('RandomGo')) {
            item.dataset.umamiEvent = "Random Go";
        } else if (item.ariaLabel === "Search") {
            item.dataset.umamiEvent = "Search";
        } else if (item.pathname === '/categories/') {
            item.dataset.umamiEvent = "Categories";
        } else if (item.pathname === '/tags/') {
            item.dataset.umamiEvent = "Tags";
        } else if (item.id === 'toggle-color-mode') {
            item.dataset.umamiEvent = "Color Toggle";
        } else if (item.id === 'random-change-background') {
            item.dataset.umamiEvent = "Random Background";
        } else if (item.id === 'toggle-background-mode') {
            item.dataset.umamiEvent = "Background Toggle";
        } else if (item.id === 'toggle-tab-display') {
            item.dataset.umamiEvent = "Tab Display Toggle";
        }
    });

    const power_by = document.querySelectorAll('a[rel="nofollow noopener"]');
    power_by.forEach(link => {
        if (link.href === 'https://hexo.io/') {
            link.dataset.umamiEvent = "Powered by Hexo";
        } else if (link.href === 'https://github.com/fluid-dev/hexo-theme-fluid') {
            link.dataset.umamiEvent = "Powered by Fluid";
        } else if (link.href === 'https://cloud.umami.is/share/1fs3cnD9TAP8JzML') {
            link.dataset.umamiEvent = "Powered by Umami";
        } 
    });

    const hitokoto_text = document.getElementById('hitokoto_text');
    if (hitokoto_text) {
        hitokoto_text.dataset.umamiEvent = "Hitokoto";
    }

    const linkcardItems = document.querySelectorAll('.LinkCard');
    linkcardItems.forEach(item => {
        if (item.pathname.startsWith('/')) {
            item.dataset.umamiEvent = "Linkcard-Internal";
        } 
        else {
            item.dataset.umamiEvent = "Linkcard-External";
        }
    });

    const copyCodeBlocks = document.querySelectorAll('i.fas.fa-paste.copy-button[title="Copy Code"]');
    copyCodeBlocks.forEach(button => {
        button.dataset.umamiEvent = "Copy Code";
    });

    const aboutIcons = document.querySelectorAll('.about-icons a');
    aboutIcons.forEach(icon => {
        if (icon.ariaLabel === 'GitHub') {
            icon.dataset.umamiEvent = "GitHub";
        } else if (icon.ariaLabel === 'Email') {
            icon.dataset.umamiEvent = "Email";
        } else if (icon.ariaLabel === '网易云音乐') {
            icon.dataset.umamiEvent = "NetEase Music";
        } else if (icon.ariaLabel === 'Fluid 文档') {
            icon.dataset.umamiEvent = "Fluid Docs";
        }
    });
}

window.addEventListener('load', () => {
    umamiTrackEvent();
});