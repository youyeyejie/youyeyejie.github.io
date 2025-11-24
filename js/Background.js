document
    .querySelector('#web_bg')
    .style.backgroundImage = `${document.querySelector('.banner').style.background.split(' ')[0]}`;

document
    .querySelector("#banner")
    .style.opacity = '0';

document
    .querySelector("#banner .mask")
    .style.opacity = '0';