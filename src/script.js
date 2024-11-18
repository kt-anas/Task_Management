
let tasks = {
    'todo-list': [],
'in-progress-list': [],
'done-list': []
};

function addTask() {
const taskInput = document.getElementById('task-input');
const taskText = taskInput.value.trim();

if (taskText === '') {
    alert('Please enter a task');
    return;
}

const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false
};

tasks['todo-list'].push(newTask);
renderTasks();
taskInput.value = '';
saveTasks();
}

function renderTasks() {
const columns = ['todo-list', 'in-progress-list', 'done-list'];
columns.forEach(columnId => {
    const list = document.getElementById(columnId);
    list.innerHTML = '';
    tasks[columnId].forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        taskItem.setAttribute('draggable', 'true');
        taskItem.setAttribute('data-task-id', task.id);
        taskItem.ondragstart = drag;

        taskItem.innerHTML = `
            <span>${task.text}</span>
            <div>
                <button class="complete-btn" onclick="toggleComplete(${task.id}, '${columnId}')">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="delete-btn" onclick="deleteTask(${task.id}, '${columnId}')">Delete</button>
            </div>
        `;

        list.appendChild(taskItem);
    });
});
}

function drag(event) {
event.dataTransfer.setData('text/plain', event.target.getAttribute('data-task-id'));
event.target.classList.add('dragging');
}

function allowDrop(event) {
event.preventDefault();
}

function drop(event) {
event.preventDefault();
const taskId = event.dataTransfer.getData('text/plain');
const draggedTask = document.querySelector(`[data-task-id="${taskId}"]`);
const sourceColumn = draggedTask.closest('ul').id;
const targetColumn = event.target.closest('.task-column').querySelector('ul').id;

if (sourceColumn !== targetColumn) {
    const task = tasks[sourceColumn].find(t => t.id === parseInt(taskId));
    
    // Remove from source column
    tasks[sourceColumn] = tasks[sourceColumn].filter(t => t.id !== parseInt(taskId));
    
    // Add to target column
    tasks[targetColumn].push(task);

    renderTasks();
    saveTasks();
}

document.querySelectorAll('.task-item').forEach(item => {
    item.classList.remove('dragging');
});
}

function deleteTask(taskId, columnId) {
tasks[columnId] = tasks[columnId].filter(task => task.id !== taskId);
renderTasks();
saveTasks();
}

function toggleComplete(taskId, columnId) {
const task = tasks[columnId].find(t => t.id === taskId);
task.completed = !task.completed;
renderTasks();
saveTasks();
}

function toggleDarkMode() {
document.body.classList.toggle('dark-mode');
localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function saveTasks() {
localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
const savedTasks = JSON.parse(localStorage.getItem('tasks') || '{}');
tasks = Object.keys(savedTasks).length ? savedTasks : tasks;
renderTasks();

const darkMode = localStorage.getItem('darkMode') === 'true';
if (darkMode) {
    document.body.classList.add('dark-mode');
}
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadTasks);