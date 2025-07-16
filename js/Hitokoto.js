var url = 'https://v1.hitokoto.cn/?c=i';
url = 'https://fan-hitokoto.mangofanfan.cn/?c=i';

async function fetchSlogan() {
    try {
        const res = await fetch(url);
        const data = await res.json();
        const hitokotoElem = document.getElementById('hitokoto');
        if (hitokotoElem) {
            hitokotoElem.innerText = `${data.hitokoto}  —— ${data.from_who || ''}《${data.from}》`;
        }
    } catch (err) {
        console.error(err);
    }
}

fetchSlogan();