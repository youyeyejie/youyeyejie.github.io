const hbeMainElement = document.getElementById("hexo-blog-encrypt");
const wrongPassMessage = hbeMainElement?.dataset["wpm"];
const wrongHashMessage = hbeMainElement?.dataset["whm"];

const originalAlert = window.alert;
window.alert = function (message) {
    // 先判断 tooltip 存在 + 消息匹配，避免报错
    if (message === wrongPassMessage) {
        showTooltip({
            type: "error",
            message: message,
            duration: 5000,
        });
    }
    else if (message === wrongHashMessage) {
        showTooltip({
            type: "warning",
            message: message,
            duration: 5000,
        });
    }
    else {
        originalAlert(message);
    }
};

function removePrefixElement() {
    const hbePrefix = document.querySelector('hbe-prefix');
    if (hbePrefix && hbePrefix.parentNode) {
        hbePrefix.parentNode.removeChild(hbePrefix);
    }
}

document.addEventListener("DOMContentLoaded", removePrefixElement);
window.addEventListener('hexo-blog-decrypt', () => {
    showTooltip({
        type: "success",
        message: "已解密!",
        duration: 3000,
    });
    setTimeout(() => {
        removePrefixElement();
        addHighlightTool(); // 重应用 shiki highlight
        generateLinkCard(); // 重新生成 LinkCard
    }, 1);
});
