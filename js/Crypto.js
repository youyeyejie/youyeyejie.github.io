// 修改输入框显示逻辑
const input = document.getElementById('hbePass');
let value = '';

if (input) {
    input.addEventListener('focus', function () {
        this.value = value;
    });
    input.addEventListener('blur', function () {
        value = this.value; // 保存真实值
        this.value = ''; 
    });
}

// 修改 alert 提示为 tooltip 提示
const hbeMainElement = document.querySelector('hbe-main');
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

// 解密成功后移除 hbe-prefix 元素
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