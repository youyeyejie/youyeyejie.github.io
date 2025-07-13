
var right_cilck_num = 0;
window.oncontextmenu = function(e){
	// 检查是否按下了Ctrl键
	if (e.ctrlKey) {
		return true;
	}

	e.preventDefault(); //阻止浏览器自带的右键菜单显示
	var menu = document.getElementById("rightmenu-wrapper");
	menu.style.display = "block"; //将自定义的“右键菜单”显示出来
	menu.style.left = e.clientX + "px";  //设置位置，跟随鼠标
	menu.style.top = e.clientY+"px"; 
    if (e.clientX + 170 > window.innerWidth) {
        menu.style.left = (window.innerWidth - 170) + "px"; // 如果超出屏幕宽度，则调整位置
    }
    if (e.clientY + 320 > window.innerHeight) {
        menu.style.top = (window.innerHeight - 320) + "px"; // 如果超出屏幕高度，则调整位置
    }
	right_cilck_num = right_cilck_num+ 1;
	
	if(right_cilck_num == 1){
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

// 复制链接功能
function copyLink() {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    const tooltip = document.getElementById('tooltip-copy-link');
    tooltip.classList.add('show-tooltip');

    // 3秒后隐藏提示框
    setTimeout(() => {
        tooltip.classList.remove('show-tooltip');
    }, 1000);
}

// 随机跳转到文章
function RandomGo() {
    const links = Array.from(document.querySelectorAll('a')).filter(link => {
        const href = link.getAttribute('href');
        return href && href.startsWith('/posts/') && !href.startsWith('//');
    });
    if (links.length > 0) {
        const randomIndex = Math.floor(Math.random() * links.length); // 随机选择一个链接
        const randomLink = links[randomIndex].href; // 获取链接的 href 属性
        window.location.href = randomLink; // 跳转到随机链接
    } else {
        console.warn('No links found on the page.');
    }
}

document.addEventListener('mouseup', function () {
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
    const img = event.target.closest('img') || document.querySelector('svg');
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

    const topLineItem = document.getElementById('top-line');
    if (!copySelectedTextItem.hidden && !link && !img) {
        topLineItem.hidden = false;
    } else {
        topLineItem.hidden = true;
    }
});

function copySelectedText() {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
        navigator.clipboard.writeText(selectedText);
        const tooltip = document.getElementById('tooltip-copy-selected-text');
        tooltip.classList.add('show-tooltip');
        setTimeout(() => {
            tooltip.classList.remove('show-tooltip');
        }, 1000);
    }
}

function searchSelectedTextBing() {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        const bingSearchUrl = `https://www.bing.com/search?q=${encodeURIComponent(selectedText)}`;
        window.open(bingSearchUrl, '_blank');
    }
}

function goToLink() {
    const goToLinkItem = document.getElementById('go-to-link');
    const href = goToLinkItem.querySelector('a').getAttribute('href');
    if (href) {
        window.open(href, '_blank');
    }
}

function downloadImage(imgsrc) {
    if (!imgsrc) {
        console.error('Image source is required');
        return;
    }

    const name = imgsrc.split('/').pop(); // Extract the image name from the path
    let image = new Image();
    image.setAttribute("crossOrigin", "anonymous"); // Resolve cross-origin issues
    image.onload = function () {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        let url = canvas.toDataURL("image/png"); // Get base64 encoded data
        let a = document.createElement("a");
        a.download = name || "downloaded_image"; // Set image name
        a.href = url;
        a.click(); // Trigger download
    };
    image.src = imgsrc; // Set image source
    
    tooltip = document.getElementById('tooltip-download-image');
    tooltip.classList.add('show-tooltip');
    setTimeout(() => {
        tooltip.classList.remove('show-tooltip');
    }, 1000);
}

function copyImageLink(imgsrc) {
    if (imgsrc) {
        navigator.clipboard.writeText(imgsrc);
        const tooltip = document.getElementById('tooltip-copy-link');
        tooltip.classList.add('show-tooltip');
        setTimeout(() => {
            tooltip.classList.remove('show-tooltip');
        }, 1000);
    }
}

