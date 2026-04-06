const WEEKDAY_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAY_ZH = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

const el = {
    greeting: document.getElementById('greeting'),
    year: document.getElementById('year'),
    month: document.getElementById('month'),
    day: document.getElementById('day'),
    dayOfWeek: document.getElementById('dow'),
    hour: document.getElementById('hour'),
    minute: document.getElementById('min'),
    second: document.getElementById('sec'),
    dayProgress: document.getElementById('dayprogress'),
    weekProgress: document.getElementById('weekprogress'),
    monthProgress: document.getElementById('monthprogress'),
    yearProgress: document.getElementById('yearprogress'),
    hourHand: document.getElementById('hour-hand'),
    minuteHand: document.getElementById('min-hand'),
    secondHand: document.getElementById('sec-hand'),
    digitalTime: document.getElementById('digitalTime'),
    digitalDate: document.getElementById('digitalDate'),
    codeClock: document.getElementById('codeClock'),
    digitalClock: document.getElementById('digitalClock'),
    themeButton: document.getElementById('themeBtn'),
    themeIcon: document.getElementById('themeIcon')
};

function setText(node, value) {
    if (node) {
        node.textContent = value;
    }
}

function updateTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dayIndex = now.getDay();
    const dow = WEEKDAY_EN[dayIndex];
    const dowZh = WEEKDAY_ZH[dayIndex];
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();

    // 计算当日进度
    const totalSecondsInDay = 24 * 60 * 60;
    const currentSeconds = (hour * 3600) + (minute * 60) + second;
    const dayprogress = ((currentSeconds / totalSecondsInDay) * 100).toFixed(2);

    // 计算当周进度(以周一为开始)
    const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1; // 将周日转换为6，其他天数减1
    const totalSecondsInWeek = 7 * totalSecondsInDay;
    const currentSecondsInWeek = (dayOfWeek * totalSecondsInDay) + currentSeconds;
    const weekProgress = ((currentSecondsInWeek / totalSecondsInWeek) * 100).toFixed(2);

    // 计算当月进度
    const totalDaysInMonth = new Date(year, month, 0).getDate();
    const currentDayOfMonth = now.getDate() - 1 + (currentSeconds / totalSecondsInDay);
    const monthProgress = ((currentDayOfMonth / totalDaysInMonth) * 100).toFixed(2);

    // 计算当年进度
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);
    const totalSecondsInYear = (endOfYear - startOfYear) / 1000;
    const currentSecondsInYear = (now - startOfYear) / 1000;
    const yearProgress = ((currentSecondsInYear / totalSecondsInYear) * 100).toFixed(2);

    // 更新代码文字
    let greetingText = "// Happy Coding!";
    if (hour < 12) greetingText = "// Good Morning!";
    else if (hour < 18) greetingText = "// Good Afternoon!";
    else greetingText = "// Good Evening!";

    setText(el.greeting, greetingText);
    setText(el.year, year);
    setText(el.month, month);
    setText(el.day, day);
    setText(el.dayOfWeek, dow);
    setText(el.hour, String(hour).padStart(2, '0'));
    setText(el.minute, String(minute).padStart(2, '0'));
    setText(el.second, String(second).padStart(2, '0'));
    setText(el.dayProgress, dayprogress);
    setText(el.weekProgress, weekProgress);
    setText(el.monthProgress, monthProgress);
    setText(el.yearProgress, yearProgress);

    // 更新时钟指针旋转
    const secDeg = (second / 60) * 360;
    const minDeg = ((minute + second / 60) / 60) * 360;
    const hourDeg = (((hour % 12) + minute / 60) / 12) * 360;

    if (el.secondHand) el.secondHand.style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
    if (el.minuteHand) el.minuteHand.style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
    if (el.hourHand) el.hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;

    // 更新大数字时钟
    if (el.digitalTime) {
        el.digitalTime.textContent = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
    }
    if (el.digitalDate) {
        // 计算周数
        const startOfYearDate = new Date(year, 0, 1);
        const daysSinceStart = Math.floor((now - startOfYearDate) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((daysSinceStart + startOfYearDate.getDay() + 1) / 7);
        el.digitalDate.textContent = `${year}年${parseInt(month, 10)}月${parseInt(day, 10)}日${dowZh}，第${weekNumber}周`;
    }
}

// 主题切换逻辑
function toggleTheme() {
    const body = document.body;
    const isDark = !body.hasAttribute('data-theme');
    
    if (isDark) {
        body.setAttribute('data-theme', 'light');
        if (el.themeIcon) el.themeIcon.className = 'fas fa-sun';
    } else {
        body.removeAttribute('data-theme');
        if (el.themeIcon) el.themeIcon.className = 'fas fa-moon';
    }
}

// 双击切换显示模式
let isDigitalMode = false;

function toggleDisplayMode() {
    isDigitalMode = !isDigitalMode;

    if (isDigitalMode) {
        // 切换到大数字时钟模式
        if (el.codeClock) el.codeClock.classList.add('hidden');
        if (el.digitalClock) el.digitalClock.classList.add('active');
    } else {
        // 切换回原始模式
        if (el.codeClock) el.codeClock.classList.remove('hidden');
        if (el.digitalClock) el.digitalClock.classList.remove('active');
    }
}

// 添加双击事件监听器
document.addEventListener('dblclick', function(event) {
    if (el.themeButton && el.themeButton.contains(event.target)) {
        return;
    }
    toggleDisplayMode();
});

setInterval(updateTime, 1000);
updateTime(); // 立即执行一次