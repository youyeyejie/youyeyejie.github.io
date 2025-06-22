window.onload = function () {
    var LinkCards = document.getElementsByClassName('LinkCard');
    for (var i = 0; i < LinkCards.length; i++) {
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