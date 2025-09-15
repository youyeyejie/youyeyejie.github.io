// 任务数据管理
let tasks = [];
let currentFilter = 'all';

// DOM 元素
const taskForm = document.getElementById('add-task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const clearCompletedBtn = document.getElementById('clear-completed');
const clearAllBtn = document.getElementById('clear-all');
const filterButtons = document.querySelectorAll('.filter-btn');

// 颜色列表 - 8种颜色，将按2行4列排列
const colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'white'];

// 初始化
function init() {
    // 从本地存储加载任务
    loadTasks();
    renderTasks();
    updateTaskStat();
    
    // 事件监听
    taskForm.addEventListener('submit', addTask);
    taskList.addEventListener('click', handleTaskActions);
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    clearAllBtn.addEventListener('click', clearAllTasks);
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });
}

// 添加新任务
function addTask(e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    
    if (taskText) {
        const newTask = {
            id: Date.now().toString(),
            text: taskText,
            completed: false,
            color: 'white' // 默认白色
        };
        
        tasks.unshift(newTask); // 添加到数组开头
        saveTasks();
        renderTasks();
        updateTaskStat();
        
        // 清空输入框并获取焦点
        taskInput.value = '';
        taskInput.focus();
    }
}

// 处理任务操作（删除、完成、颜色标记）
function handleTaskActions(e) {
    const target = e.target;
    const taskElement = target.closest('.task-item');
    const taskId = taskElement?.dataset.id;
    
    if (!taskId) return;
    
    // 删除任务
    if (target.matches('.delete-btn, .delete-btn *')) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
        updateTaskStat();
        return;
    }
    
    // 切换完成状态
    if (target.matches('.checkbox-custom, .checkbox-custom *')) {
        const task = tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
            updateTaskStat();
        }
        return;
    }
    
    // 切换任务颜色 - 直接选择点击的颜色
    if (target.matches('.color-square')) {
        const task = tasks.find(task => task.id === taskId);
        if (task) {
            task.color = target.dataset.color;
            saveTasks();
            renderTasks();
        }
    }
}

// 设置筛选条件
function setFilter(filter) {
    currentFilter = filter;
    
    // 更新筛选按钮样式
    filterButtons.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('filter-active');
        } else {
            btn.classList.remove('filter-active');
        }
    });
    
    renderTasks();
}

// 清除已完成任务
function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
    updateTaskStat();
}

// 清除所有任务
function clearAllTasks() {
    tasks = [];
    saveTasks();
    renderTasks();
    updateTaskStat();
}

// 渲染任务列表
function renderTasks() {
    // 清空列表
    taskList.innerHTML = '';
    
    // 根据当前筛选条件过滤任务
    let filteredTasks = tasks;
    if (currentFilter !== 'all') {
        filteredTasks = tasks.filter(task => task.color === currentFilter);
    }
    
    // 显示或隐藏空状态
    if (tasks.length === 0) {
        emptyState.style.display = 'block';
        taskList.style.display = 'none';
        return;
    } else {
        emptyState.style.display = 'none';
        taskList.style.display = 'block';
    }
    
    // 如果筛选后没有任务
    if (filteredTasks.length === 0) {
        const noResults = document.createElement('li');
        noResults.id = 'empty-state';
        noResults.innerHTML = '<p>No tasks match the current filter.<br>Click the color grid to color the task!</p>';
        taskList.appendChild(noResults);
        return;
    }
    
    // 添加任务项
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item transition-all duration-200 hover:shadow-task-hover ${task.color && task.color !== 'white' ? `bg-task-${task.color}` : ''}`;
        li.dataset.id = task.id;
        li.dataset.color = task.color || '';
        
        // 复选框
        const checkbox = document.createElement('div');
        checkbox.className = `checkbox-custom ${task.completed ? 'checkbox-checked' : ''}`;
        checkbox.innerHTML = task.completed ? '<i class="fa fa-check"></i>' : '';
        
        // 任务文本
        const taskContent = document.createElement('div');
        taskContent.className = 'task-item-content';
        
        const taskText = document.createElement('span');
        taskText.className = `task-text ${task.completed ? 'task-completed' : ''}`;
        taskText.textContent = task.text;
        
        taskContent.appendChild(taskText);
        
        // 颜色选择方块 - 2行4列布局，位于删除按钮左侧
        const colorGridContainer = document.createElement('div');
        colorGridContainer.className = 'color-grid';
        
        colors.forEach(color => {
            const square = document.createElement('div');
            square.className = `color-square bg-task-${color} ${task.color === color ? 'color-square-selected' : ''}`;
            square.dataset.color = color;
            colorGridContainer.appendChild(square);
        });
        
        // 删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fa fa-trash-o"></i>';
        deleteBtn.title = '删除任务';
        
        // 组装任务项
        li.appendChild(checkbox);
        li.appendChild(taskContent);
        li.appendChild(colorGridContainer);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// 更新任务计数
function updateTaskStat() {
    const completedCount = tasks.filter(task => task.completed).length;
    const totalCount = tasks.length;
    clearCompletedBtn.style.display = completedCount > 0 ? 'block' : 'none';
    clearAllBtn.style.display = totalCount > 0 ? 'block' : 'none';
}

// 保存任务到本地存储
function saveTasks() {
    sessionStorage.setItem('todoTasks', JSON.stringify(tasks));
}

// 从本地存储加载任务
function loadTasks() {
    const savedTasks = sessionStorage.getItem('todoTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', init);