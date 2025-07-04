fetch('/local-search.xml')
.then(response => response.text())
.then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
.then(data => {
    const posts = data.querySelectorAll('entry');
    document.getElementById('g-total-posts-id').textContent = posts.length;
})