document.querySelector('#web_bg').style.backgroundImage = `${document.querySelector('.banner').style.background.split(' ')[0]}`;
document.querySelector('#web_bg').style.display = 'block';
document.querySelector("#banner").style.background = 'url()'
document.querySelector("#banner .mask").style.backgroundColor = 'rgba(0,0,0,0)'
document.getElementById('toggle-background-script-icon').className = "fa-solid fa-toggle-on";

if (localStorage.getItem('BackgroundScript') === 'false' || !localStorage.getItem('BackgroundScript')) {
    document.querySelector('#web_bg').style.display = 'none';
    document.querySelector("#banner").style.background = document.querySelector('#web_bg').style.backgroundImage + " center center / cover no-repeat";
    document.querySelector("#banner .mask").style.backgroundColor = 'rgba(0,0,0,0.3)';
    document.getElementById('toggle-background-script-icon').className = "fa-solid fa-toggle-off";
}