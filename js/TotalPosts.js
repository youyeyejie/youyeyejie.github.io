var posts = JSON.parse(sessionStorage.getItem('posts')) || [];
if (posts.length === 0) {
    fetch('/sitemap.xml')
    .then(response => response.text())
    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
    .then(data => {
        const entries = data.querySelectorAll('url > loc');
        posts = Array.from(entries)
            .map(entry => entry.textContent)
            .filter(link => link.includes('/_posts/'))
            .map(link => link.substring(link.indexOf('/_posts/')));
        sessionStorage.setItem('posts', JSON.stringify(posts)); // 保存到 sessionStorage
        console.log('Posts updated:', posts); // 调试输出更新后的链接列表
        document.getElementById('g-total-posts-id').textContent = posts.length;
    })
    .catch(error => console.error('Error fetching sitemap:', error));
} else {
    document.getElementById('g-total-posts-id').textContent = posts.length;
}