/**
 * 对外暴露的提示框调用函数
 * @param {Object} options - 配置参数
 * @param {string} [options.type='info'] - 提示类型，可选值：info/warning/error/success
 * @param {string} [options.message=''] - 提示文本内容
 * @param {number} [options.duration=3000] - 提示框显示时长（毫秒），默认3秒
 */
function showTooltip({ type = "info", message = "", duration = 3000 } = {}) {
    // 1. 校验提示类型的合法性，默认回退到info
    const validTypes = ["info", "warning", "error", "success"];
    const targetType = validTypes.includes(type) ? type : "info";

    // 2. 获取或创建提示框DOM元素（确保元素唯一，避免重复创建）
    let tooltip = document.getElementById("tooltip");
    if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.id = "tooltip";
        document.body.appendChild(tooltip);
    }

    // 3. 重置提示框样式（移除旧的类型类名和显示类名，避免样式叠加）
    validTypes.forEach((validType) => {
        tooltip.classList.remove(validType);
    });
    tooltip.classList.remove("show-tooltip");

    // 4. 设置提示框内容和当前类型样式
    tooltip.innerHTML = message;
    tooltip.classList.add(targetType);

    // 5. 强制触发重排（解决过渡效果不生效的问题）
    void tooltip.offsetWidth;

    // 6. 添加显示类名，触发淡入过渡
    tooltip.classList.add("show-tooltip");

    // 7. 定时隐藏提示框，触发淡出过渡
    setTimeout(() => {
        tooltip.classList.remove("show-tooltip");
    }, duration);
}
