const originalTitle = document.title; // 缓存页面原始标题（全局复用，避免重复获取）
let welcomeTimer = null; // 恢复原标题的定时器

/**
 * 核心：页面可见性变化处理函数（提取为独立函数，方便绑定/移除）
 */
function handleVisibilityChange() {
    // 清除已有定时器，避免定时器叠加
    if (welcomeTimer) {
        clearTimeout(welcomeTimer);
        welcomeTimer = null;
    }

    // 先获取浏览器兼容的可见性属性
    let visibilityProp = '';
    if (typeof document.hidden !== "undefined") {
        visibilityProp = "hidden";
    } else if (typeof document.mozHidden !== "undefined") {
        visibilityProp = "mozHidden";
    } else if (typeof document.webkitHidden !== "undefined") {
        visibilityProp = "webkitHidden";
    }

    // 根据页面可见性切换标题
    if (document[visibilityProp]) {
        document.title = " 你去哪啦(๑•́ ₃ •̀๑) ";
    } else {
        document.title = " 你回来啦(*^▽^*) ";
        welcomeTimer = setTimeout(() => {
            document.title = originalTitle;
        }, 2000);
    }
}

function TabDisplay(enable) {
    // 获取浏览器兼容的事件名和属性名
    let visibilityChangeEvent = '';
    if (typeof document.hidden !== "undefined") {
        visibilityChangeEvent = "visibilitychange";
    } else if (typeof document.mozHidden !== "undefined") {
        visibilityChangeEvent = "mozvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        visibilityChangeEvent = "webkitvisibilitychange";
    }

    if (enable) {
        // 启用功能：绑定事件监听，更新按钮文案
        if (visibilityChangeEvent) {
            document.addEventListener(visibilityChangeEvent, handleVisibilityChange, false);
        }
    } else {
        // 禁用功能：移除事件监听，清除定时器，恢复原始标题，更新按钮文案
        if (visibilityChangeEvent) {
            document.removeEventListener(visibilityChangeEvent, handleVisibilityChange, false);
        }
        // 清理残留状态
        if (welcomeTimer) {
            clearTimeout(welcomeTimer);
            welcomeTimer = null;
        }
        document.title = originalTitle;
    }
}

jQuery(document).ready(function() {
    const TabDisplayMode = localStorage.getItem('TabDisplayMode');
    if (TabDisplayMode || TabDisplayMode === 'true') {
        TabDisplay(true);
        localStorage.setItem('TabDisplayMode', 'true');
    }
});