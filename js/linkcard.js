window.onload = function () {
    function isDarkMode() {
        const htmlElement = document.documentElement;
        const userScheme = htmlElement.getAttribute('data-user-color-scheme');
        const defaultScheme = htmlElement.getAttribute('data-default-color-scheme');
        
        // 如果用户手动设置了主题，优先使用用户设置
        if (userScheme) {
            return userScheme === 'dark';
        }
        
        // 否则使用默认主题设置
        if (defaultScheme) {
            return defaultScheme === 'dark';
        }
        
        // 如果都没有设置，检查系统偏好
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    
    // 监听主题切换，动态更新卡片背景色
    function updateLinkCardStyle() {
        setTimeout(() => {
            const style = document.getElementById('LinkCardStyle');
            if (style) {
                const color = isDarkMode() ? '#242a38' : '#eeefef';
                style.innerHTML = style.innerHTML.replace(
                    /(\.LinkCard-content\s*\{[^}]*background-color:\s*)(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgba?\([^)]+\));/,
                    `$1${color};`
                );
            }
        }, 60);
    }

    // 监听自定义事件和系统主题变化
    const observer = new MutationObserver(updateLinkCardStyle);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-user-color-scheme', 'data-default-color-scheme'] });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateLinkCardStyle);
    var LinkCards = document.getElementsByClassName('LinkCard');
    for (var i = 0; i < LinkCards.length; i++) {
        if (!document.getElementById('LinkCardStyle')) {
            var style = document.createElement('style');
            style.id = 'LinkCardStyle';
            const color = isDarkMode() ? '#242a38' : '#eeefef';
            style.innerHTML = `
            .LinkCard, .LinkCard:hover {
                text-decoration: none;
                border: none !important;
                color: inherit !important;
            }
            .LinkCard {
                position: relative;
                display: block;
                margin: 1em auto;
                width: 60%;
                box-sizing: border-box;
                border-radius: 12px;
                max-width: 100%;
                overflow: hidden;
                color: inherit;
                text-decoration: none;
            }
            .ztext { word-break: break-word; line-height: 1.6; }
            .LinkCard-backdrop {
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background-repeat: no-repeat;
                -webkit-filter: blur(20px);
                filter: blur(20px);
                background-size: cover;
                background-position: center;
            }
            .LinkCard-content {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px;
                border-radius: inherit;
                background-color: ${color};
            }
            .LinkCard-text { overflow: hidden; }
            .LinkCard-title {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                overflow: hidden;
                text-overflow: ellipsis;
                max-height: calc(16px * 1.25 * 2);
                font-size: 16px;
                font-weight: 500;
                line-height: 1.25;
                color: inherit;
            }
            .LinkCard-meta {
                display: flex;
                margin-top: 4px;
                font-size: 14px;
                line-height: 20px;
                color: #999;
                white-space: nowrap;
            }
            .LinkCard-imageCell {
                margin-left: 8px;
                border-radius: 6px;
            }
            .LinkCard-image {
                display: block;
                width: 60px;
                height: auto;
                border-radius: inherit;
                margin-bottom: 0 !important;
            }
            `;
            document.head.appendChild(style);
        }

        // 截断链接
        var truncateLink = function(url, maxLength) {
            if (url.length <= maxLength) return url;
            return url.slice(0, maxLength) + '...';
        };

        var LinkCard = LinkCards[i];
        var link = LinkCard.href;
        var title = LinkCard.innerText;
        var logourl = LinkCard.name;
        var displayLink = truncateLink(link, 32);

        LinkCard.innerHTML =
            `<span class="LinkCard-backdrop" style="background-image:url(/images/logo.svg)"></span>
            <span class="LinkCard-content">
                <span class="LinkCard-text">
                    <span class="LinkCard-title">${title}</span>
                    <span class="LinkCard-meta">
                        <span style="display:inline-flex;align-items:center">
                            <svg class="Zi Zi--InsertLink" fill="currentColor" viewBox="0 0 24 24" width="17" height="17">
                                <path d="M6.77 17.23c-.905-.904-.94-2.333-.08-3.193l3.059-3.06-1.192-1.19-3.059 3.058c-1.489 1.489-1.427 3.954.138 5.519s4.03 1.627 5.519.138l3.059-3.059-1.192-1.192-3.059 3.06c-.86.86-2.289.824-3.193-.08zm3.016-8.673l1.192 1.192 3.059-3.06c.86-.86 2.289-.824 3.193.08.905.905.94 2.334.08 3.194l-3.059 3.06 1.192 1.19 3.059-3.058c1.489-1.489 1.427-3.954-.138-5.519s-4.03-1.627-5.519-.138L9.786 8.557zm-1.023 6.68c.33.33.863.343 1.177.029l5.34-5.34c.314-.314.3-.846-.03-1.176-.33-.33-.862-.344-1.176-.03l-5.34 5.34c-.314.314-.3.846.03 1.177z" fill-rule="evenodd"></path>
                            </svg>
                        </span>
                        <a href="${link}" title="${link}" style="color:inherit;text-decoration:none;">${displayLink}</a>
                    </span>
                </span>
                <span class="LinkCard-imageCell">
                    <img class="LinkCard-image" alt="logo" src="${logourl}">
                </span>
            </span>`;
    }
}
