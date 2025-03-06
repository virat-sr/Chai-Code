// Data structure for tasks
class Task {
    constructor(id, title, description, dueDate, priority) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.subtasks = [];
        this.timeSpent = 0;
        this.dependencies = [];
        this.status = 'todo';
        this.isTimerRunning = false;
        this.timerInterval = null;
    }
}

// Main Board Class
class KanbanBoard {
    constructor() {
        this.tasks = new Map();
        this.loadFromStorage();
        
        // Initialize theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        const themeToggleBtn = document.getElementById('themeToggle');
        themeToggleBtn.textContent = savedTheme === 'light' ? '🌙' : '☀️';
        
        this.initializeEventListeners();
        // this.checkDeadlines();
    }
    initializeEventListeners() {
        // Add task buttons
        document.querySelectorAll('.add-task-btn').forEach(button => {
            button.addEventListener('click', () => this.showAddTaskModal());
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Search functionality
        document.getElementById('search').addEventListener('input', (e) => this.searchTasks(e.target.value));

        // Export
        document.getElementById('exportBtn').addEventListener('click', () => this.exportBoard());

        // Drag and Drop
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('task-card')) {
                e.dataTransfer.setData('text/plain', e.target.dataset.taskId);
            }
        });

        document.querySelectorAll('.task-list').forEach(list => {
            list.addEventListener('dragover', (e) => e.preventDefault());
            list.addEventListener('drop', (e) => this.handleDrop(e));
        });
    }

    // Storage Methods
    loadFromStorage() {
        const savedData = localStorage.getItem('kanbanBoard');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            parsedData.forEach(task => this.tasks.set(task.id, task));
        }
    }

    saveToStorage() {
        localStorage.setItem('kanbanBoard', JSON.stringify([...this.tasks.values()]));
    }

    // Task Management
    addTask(task) {
        this.tasks.set(task.id, task);
        this.saveToStorage();
        this.renderTask(task);
    }

    showAddTaskModal() {
        const modal = document.getElementById('addTaskModal');
        const form = document.getElementById('addTaskForm');
        const cancelBtn = modal.querySelector('.cancel-btn');

        modal.style.display = 'block';

        // Handle form submission
        form.onsubmit = (e) => {
            e.preventDefault();
            
            const task = new Task(
                Date.now().toString(), // Generate unique ID
                document.getElementById('taskTitle').value,
                document.getElementById('taskDescription').value,
                document.getElementById('taskDueDate').value,
                document.getElementById('taskPriority').value
            );

            this.addTask(task);
            form.reset();
            modal.style.display = 'none';
        };

        // Handle cancel button
        cancelBtn.onclick = () => {
            form.reset();
            modal.style.display = 'none';
        };

        // Close modal when clicking outside
        window.onclick = (e) => {
            if (e.target === modal) {
                form.reset();
                modal.style.display = 'none';
            }
        };
    }

    renderTask(task) {
        const template = document.getElementById('task-template');
        const taskElement = template.content.cloneNode(true);
        const taskCard = taskElement.querySelector('.task-card');
        
        taskCard.dataset.taskId = task.id;
        taskCard.querySelector('.task-title').textContent = task.title;
        taskCard.querySelector('.priority-badge').textContent = task.priority;
        taskCard.querySelector('.due-date').textContent = task.dueDate;
        
        // Add status buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'status-buttons';
        
        const statuses = ['todo', 'inprogress', 'done'];
        statuses.forEach(status => {
            const button = document.createElement('button');
            button.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            button.className = `status-btn ${status}-btn`;
            button.addEventListener('click', () => {
                task.status = status;
                const targetColumn = document.querySelector(`.column[data-status="${status}"] .task-list`);
                targetColumn.appendChild(taskCard);
                this.saveToStorage();
            });
            buttonContainer.appendChild(button);
        });
        
        taskCard.appendChild(buttonContainer);
        
        const column = document.querySelector(`.column[data-status="${task.status}"] .task-list`);
        column.appendChild(taskCard);
    }

    handleDrop(e) {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text/plain');
        const task = this.tasks.get(taskId);
        const targetColumn = e.target.closest('.column');
        
        if (task && targetColumn) {
            const newStatus = targetColumn.dataset.status;
            task.status = newStatus;
            
            // Move the task card to the new column
            const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
            const taskList = targetColumn.querySelector('.task-list');
            taskList.appendChild(taskCard);
            
            // Save the updated state
            this.saveToStorage();
        }
    }

    searchTasks(searchTerm) {
        // Convert search term to lowercase for case-insensitive search
        searchTerm = searchTerm.toLowerCase();
        
        // Get all task cards
        const taskCards = document.querySelectorAll('.task-card');
        
        taskCards.forEach(card => {
            const title = card.querySelector('.task-title').textContent.toLowerCase();
            const description = card.querySelector('.task-description')?.textContent.toLowerCase() || '';
            
            // Show/hide cards based on whether they match the search term
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    exportBoard() {
        // Get all task cards currently on the screen
        const visibleTaskCards = document.querySelectorAll('.task-card');
        const visibleTasks = [];
        
        // Collect data only from visible task cards
        visibleTaskCards.forEach(card => {
            const taskId = card.dataset.taskId;
            const task = this.tasks.get(taskId);
            if (task) {
                visibleTasks.push(task);
            }
        });
        
        // Create the board data object with only visible tasks
        const boardData = {
            tasks: visibleTasks,
            lastId: this.lastId
        };
        
        // Convert the data to JSON string
        const jsonString = JSON.stringify(boardData, null, 2);
        
        // Create a Blob with the JSON data
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        // Create a temporary download link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `kanban-board-${new Date().toISOString().split('T')[0]}.json`;
        
        // Trigger the download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        
        // Clean up
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadLink.href);
    }

    toggleTheme() {
        // Get the current theme or default to 'light'
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        
        // Toggle between light and dark
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Update the data-theme attribute
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Update the theme toggle button text
        const themeToggleBtn = document.getElementById('themeToggle');
        themeToggleBtn.textContent = newTheme === 'light' ? '🌙' : '☀️';
        
        // Save the theme preference
        localStorage.setItem('theme', newTheme);
    }

    // ... More methods to be added
}

// Initialize the board
const board = new KanbanBoard();
