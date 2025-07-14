// 右键菜单
var right_click_num = 0;
var rect = document.getElementById("rightmenu-content").getBoundingClientRect();
window.oncontextmenu = function(e){
	// 检查是否按下了Ctrl键
	if (e.ctrlKey) {
		return true;
	}

	e.preventDefault(); //阻止浏览器自带的右键菜单显示
	var menu = document.getElementById("rightmenu-wrapper");
	menu.style.display = "block"; //将自定义的“右键菜单”显示出来
    if (e.clientX + rect.width > window.innerWidth) {
        menu.style.left = e.clientX - rect.width + "px"; // 如果超出屏幕宽度，则调整位置
    } else {
        menu.style.left = e.clientX + "px"; // 设置位置，跟随鼠标
    }
    if (e.clientY + rect.height > window.innerHeight) {
        menu.style.top = e.clientY - rect.height + "px"; // 如果超出屏幕高度，则调整位置
    } else {
        menu.style.top = e.clientY + "px"; // 设置位置，跟随鼠标
    }

	right_click_num = right_click_num + 1; //右键点击次数加1

	if(right_click_num == 1){
        const tooltip = document.getElementById('tooltip-rightmenu');
        tooltip.classList.add('show-tooltip');

        // 3秒后隐藏提示框
        setTimeout(() => {
		    tooltip.classList.remove('show-tooltip');
        }, 3000);
	}
}

window.onclick = function(e){ //点击窗口，右键菜单隐藏
	var menu = document.getElementById("rightmenu-wrapper");
	menu.style.display = "none";
}

// 更新提示框样式
function updateTooltipStyle() {
    const userColorScheme = document.documentElement.getAttribute('data-user-color-scheme');
    if (userColorScheme === 'dark') {
        document.documentElement.style.setProperty('--tooltip-bg-color', '#eeeeeea4');
        document.documentElement.style.setProperty('--tooltip-text-color', '#181c27');
    } else {
        document.documentElement.style.setProperty('--tooltip-bg-color', '#181c27a4');
        document.documentElement.style.setProperty('--tooltip-text-color', '#eeeeee');
    }
}
if (window.MutationObserver) {
    new MutationObserver(updateTooltipStyle).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-user-color-scheme', 'data-default-color-scheme']
    });
}

// 监听鼠标右键按下事件
document.addEventListener('contextmenu', function(event) {
    rect = document.getElementById("rightmenu-content").getBoundingClientRect();
    
    // 检查是否有选中的文本
    const copySelectedTextItem = document.getElementById('copy-selected-text');
    const searchSelectedTextItem = document.getElementById('search-selected-text-BING');
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        copySelectedTextItem.hidden = false;
        searchSelectedTextItem.hidden = false;
    } else {
        copySelectedTextItem.hidden = true;
        searchSelectedTextItem.hidden = true;
    }

    // 检查是否有链接被点击
    const goToLinkItem = document.getElementById('go-to-link');
    const link = event.target.closest('a[href]');
    if (link) {
        goToLinkItem.hidden = false;
        goToLinkItem.querySelector('a').setAttribute('href', link.href);
    } else {
        goToLinkItem.hidden = true;
    }

    //检查是否有图片被点击
    const downloadImageItem = document.getElementById('download-image');
    const copyImageItem = document.getElementById('copy-image-link');
    const img = event.target.closest('img') || event.target.closest('svg');
    if (img) {
        downloadImageItem.hidden = false;
        if (img.tagName.toLowerCase() === 'img') {
        copyImageItem.hidden = false;
        downloadImageItem.querySelector('a').setAttribute('onclick', `downloadImage('${img.src}')`);
        copyImageItem.querySelector('a').setAttribute('onclick', `copyImageLink('${img.src}')`);
        } else if (img.tagName.toLowerCase() === 'svg' && img.classList.contains('custom-gallery-svg')) {
            const backgroundImage = img.style.backgroundImage;
            const urlMatch = backgroundImage.match(/url\(["']?(.*?)["']?\)/);
            if (urlMatch && urlMatch[1]) {
            const imageUrl = urlMatch[1];
            downloadImageItem.querySelector('a').setAttribute('onclick', `downloadImage('${imageUrl}')`);
            copyImageItem.querySelector('a').setAttribute('onclick', `copyImageLink('${imageUrl}')`);
            }
        }
    } else {
        downloadImageItem.hidden = true;
        copyImageItem.hidden = true;
    }

    // 根据前三者判断第一栏是否有元素，需要分割线
    const topLineItem = document.getElementById('top-line');
    if (copySelectedTextItem.hidden && !link && !img) {
        topLineItem.hidden = true;
    } else {
        topLineItem.hidden = false;
    }
});

// 复制选中-复制选中文本功能
function copySelectedText() {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
        navigator.clipboard.writeText(selectedText);
        const tooltip = document.getElementById('tooltip-rightmenu-return');
        tooltip.textContent = '选中文本已复制到剪贴板';
        tooltip.classList.add('show-tooltip');
        setTimeout(() => {
            tooltip.classList.remove('show-tooltip');
        }, 1500);
    }
}

// 必应搜索-在Bing上搜索选中文本功能
function searchSelectedTextBing() {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        const bingSearchUrl = `https://www.bing.com/search?q=${encodeURIComponent(selectedText)}`;
        window.open(bingSearchUrl, '_blank');
    }
}

// 转到链接-跳转到选中链接功能
function goToLink() {
    const goToLinkItem = document.getElementById('go-to-link');
    const href = goToLinkItem.querySelector('a').getAttribute('href');
    if (href) {
        window.open(href, '_blank');
    }
}

// 下载图片-下载选中图片功能
function downloadImage(imgsrc) {
    if (!imgsrc) {
        console.error('Image source is required');
        return;
    }

    const name = imgsrc.split('/').pop(); // Extract the image name from the path
    fetch(imgsrc)
        .then(response => response.blob())
        .then(blob => {
            const a = document.createElement('a');
            const url = URL.createObjectURL(blob);
            a.href = url;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
            const tooltip = document.getElementById('tooltip-rightmenu-return');
            tooltip.textContent = '图片已下载';
            tooltip.classList.add('show-tooltip');
            setTimeout(() => {
                tooltip.classList.remove('show-tooltip');
            }, 1500);
        })
        .catch(error => console.error('Error downloading image:', error));
}

// 复制图片链接-复制选中图片链接功能
function copyImageLink(imgsrc) {
    if (imgsrc) {
        navigator.clipboard.writeText(imgsrc);
        const tooltip = document.getElementById('tooltip-rightmenu-return');
        tooltip.textContent = '链接已复制到剪贴板';
        tooltip.classList.add('show-tooltip');
        setTimeout(() => {
            tooltip.classList.remove('show-tooltip');
        }, 1500);
    }
}

// 随便看看-随机跳转到文章
function RandomGo() {
    var posts = JSON.parse(sessionStorage.getItem('posts'));
    const randomIndex = Math.floor(Math.random() * posts.length);
    const randomLink = posts[randomIndex];
    window.location.href = randomLink;
}

// 复制链接-复制当前地址功能
function copyLink() {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    const tooltip = document.getElementById('tooltip-rightmenu-return');
    tooltip.textContent = '链接已复制到剪贴板';
    tooltip.classList.add('show-tooltip');

    // 3秒后隐藏提示框
    setTimeout(() => {
        tooltip.classList.remove('show-tooltip');
    }, 1500);
}
