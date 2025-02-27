/**
 * Write your challenge solution here
 */
// 1. Select DOM Elements
const taskForm = document.querySelector('.task-form');
const taskInput = document.querySelector('.task-input');
const taskList = document.querySelector('.task-list');
const emptyList = document.querySelector('.empty-list');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');

// 2. Initialize task array to store tasks
let tasks = [];

// 3. Function to create a new task
function createTask(taskText) {
    return {
        id: Date.now(), //unique id krenge
        text: taskText,
        completed: false
    };
}

// 4. Function to render task item
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;
    
    li.innerHTML = `
        <input type="checkbox" class="complete-checkbox" ${task.completed ? 'checked' : ''}>
        <span class="task-text">${task.text}</span>
        <button class="delete-button">Delete</button>
    `;
    //Custom element banaya hai jaise dropdown banaya tha project mei
    
    return li;
}

// 5. Function to update task statistics
function updateStats() {
    //Updates calclulations here
    //Project mei useEffect mei likh diya tha 
    //Always make a function
    //API call k liye useEffect , sideEffect trigger k liye 
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    
    totalTasksSpan.textContent = `Total Task : ${totalTasks}`;
    completedTasksSpan.textContent = `Completed Tasks : ${completedTasks}`;
    
    // Toggle empty list message
    //Displays ka Concept :
    /**
     * Block:
     * Inline:
     * None:
     */
    emptyList.style.display = totalTasks === 0 ? 'block' : 'none';
}

// 6. Event Listeners
taskForm.addEventListener('click', (e) => {
    const taskText = taskInput.value.trim();
    
    if (taskText) {
        const newTask = createTask(taskText);
        tasks.push(newTask);
        taskList.appendChild(createTaskElement(newTask));
        
        // Reset input and update stats
        taskInput.value = '';
        updateStats();
    }
});

// 7. Handle task completion and deletion
taskList.addEventListener('click', (e) => {
    //GPT ne Submit kyu bola, and default behaviour of button kya hai ?
    //EXplore and answer here 
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;
    
    const taskId = Number(taskItem.dataset.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (e.target.classList.contains('delete-button')) {
        // Handle deletion
        tasks.splice(taskIndex, 1);  //splice(startingelement,kitneElement) // original array hi modify hui hai
        taskItem.remove();
        updateStats();
    } else if (e.target.classList.contains('complete-checkbox')) {
        // Handle completion
        tasks[taskIndex].completed = e.target.checked;
        taskItem.classList.toggle('completed');
        updateStats();
    }
});