// Data structure for tasks
class Task {
  constructor(id, title, description, dueDate, priority) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.status = "todo";
  }
}

// Main Board Class
class KanbanBoard {
  constructor() {
    this.tasks = new Map();
    this.loadFromStorage();

    // Initialize theme
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    const themeToggleBtn = document.getElementById("themeToggle");
    themeToggleBtn.textContent = savedTheme === "light" ? "🌙" : "☀️";

    this.initializeEventListeners(); //Clean code k liye hai .Pura code yahi likha tha
  }
  initializeEventListeners() {
    // Add task buttons
    document.querySelectorAll(".add-task-btn").forEach((button) => {
      button.addEventListener("click", () => this.showAddTaskModal());
    });

    // Theme toggle
    document
      .getElementById("themeToggle")
      .addEventListener("click", () => this.toggleTheme());

    // Search functionality
    document
      .getElementById("search")
      .addEventListener("input", (e) => this.searchTasks(e.target.value));

    // Export
    document
      .getElementById("exportBtn")
      .addEventListener("click", () => this.exportBoard());

    document
     .getElementById("addBoard")
     .addEventListener("click",()=>{this.addColumn()})

    // Drag and Drop
    document.addEventListener("dragstart", (e) => {
      if (e.target.classList.contains("task-card")) {
        e.dataTransfer.setData("text/plain", e.target.dataset.taskId);
      }
    }); //GPT se dekha

    document.querySelectorAll(".task-list").forEach((list) => {
      list.addEventListener("dragover", (e) => e.preventDefault());
      list.addEventListener("drop", (e) => this.handleDrop(e));
    });
  }

  // Storage Methods
  loadFromStorage() {
    const savedData = localStorage.getItem("kanbanBoard");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      parsedData.forEach((task) => {
        this.tasks.set(task.id, task);
        this.renderTask(task); // Task vanish na ho ,local storage mei to the hi
      });
    }
  }

  saveToStorage() {
    localStorage.setItem(
      "kanbanBoard",
      JSON.stringify([...this.tasks.values()])
    );
  }

  // Task Management
  addTask(task) {
    this.tasks.set(task.id, task);
    this.saveToStorage();
    this.renderTask(task);
  }

  showAddTaskModal() {
    const modal = document.getElementById("addTaskModal");
    const form = document.getElementById("addTaskForm");
    const cancelBtn = modal.querySelector(".cancel-btn");

    modal.style.display = "block";

    // Handle form submission
    form.onsubmit = (e) => {
      e.preventDefault();

      const task = new Task(
        Date.now().toString(), // Generate unique ID
        document.getElementById("taskTitle").value,
        document.getElementById("taskDescription").value,
        document.getElementById("taskDueDate").value,
        document.getElementById("taskPriority").value
      );

      this.addTask(task);
      form.reset();
      modal.style.display = "none";
    };

    // Handle cancel button
    cancelBtn.onclick = () => {
      form.reset();
      modal.style.display = "none";
    };

    // Close modal when clicking outside
    window.onclick = (e) => {
      if (e.target === modal) {
        form.reset();
        modal.style.display = "none";
      }
    };
  }

  renderTask(task) {
    const template = document.getElementById("task-template");
    const taskElement = template.content.cloneNode(true);
    /**
         * template.content  -- access content inside <template>
         * cloneNode is copy of template
         * true is deepcopy
         * Deep clone copies all nested elements and their attributes
         * 
   - Without `true`, only the top-level node would be cloned
         */
    const taskCard = taskElement.querySelector(".task-card");

    taskCard.dataset.taskId = task.id; //id set kiya hai yaha pe data-task-id attribute
    /**
         * taskCard.dataset.taskId = task.id creates a data-task-id attribute
         * <!-- Before -->
            <div class="task-card">...</div>

            <!-- After -->
            <div class="task-card" data-task-id="1234567890">...</div>
         */
    taskCard.querySelector(".task-title").textContent = task.title;
    taskCard.querySelector(".priority-badge").textContent = task.priority;
    taskCard.querySelector(".due-date").textContent = task.dueDate;

    // Add delete button functionality - no confirmation
    const deleteBtn = taskCard.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.deleteTask(task.id);
    });

    // Add status buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "status-buttons";

    const statuses = ["todo", "inprogress", "done"]; //match perform hoga
    statuses.forEach((status) => {
      const button = document.createElement("button");
      button.textContent = status.charAt(0).toUpperCase() + status.slice(1);
      button.className = `status-btn ${status}-btn`;
      button.addEventListener("click", () => {
        task.status = status;
        const targetColumn = document.querySelector(
          `.column[data-status="${status}"] .task-list`
        );
        targetColumn.appendChild(taskCard);
        this.saveToStorage(); //Export karte time dhyaan rakhna hai ,sab download ho jaega
      });
      buttonContainer.appendChild(button);
    });

    taskCard.appendChild(buttonContainer);

    const column = document.querySelector(
      `.column[data-status="${task.status}"] .task-list`
    );
    /**
         * <div class="column" data-status="todo">
    <div class="task-list">
        <!-- Tasks will go here -->
    </div>
</div>
This what we are querying
         */
    column.appendChild(taskCard);
  }

  handleDrop(e) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain"); // `dataTransfer` is the drag and drop API's data storage
    const task = this.tasks.get(taskId); //map se nikala
    const targetColumn = e.target.closest(".column"); //jis column mei daalna hai

    if (task && targetColumn) {
      const newStatus = targetColumn.dataset.status; //!!important hai - data- apne aao access hota hai if dataset is used
      /**
             * // If HTML has: data-status="todo"
   element.dataset.status  // returns "todo"
             */
      task.status = newStatus;

      // Move the task card to the new column
      const taskCard = document.querySelector(`[data-task-id="${taskId}"]`); //now go to renderTask vaha id set hua hai
      const taskList = targetColumn.querySelector(".task-list");
      taskList.appendChild(taskCard);

      // Save the updated state
      this.saveToStorage();
    }
    //drop shift to columns
  }

  searchTasks(searchTerm) {
    // Convert search term to lowercase for case-insensitive search
    //API hit krte time jr dev ne ye mistake ki thi 10 din lage the bug identification mei
    // revise deep and shallow copy. Direct object change nhi krna tha
    searchTerm = searchTerm.toLowerCase();

    // Get all task cards
    const taskCards = document.querySelectorAll(".task-card");

    taskCards.forEach((card) => {
      const title = card.querySelector(".task-title").textContent.toLowerCase();
      const description =
        card.querySelector(".task-description")?.textContent.toLowerCase() ||
        "";

      // Show/hide cards based on whether they match the search term
      if (title.includes(searchTerm) || description.includes(searchTerm)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  exportBoard() {
    // Get all task cards currently on the screen
    const visibleTaskCards = document.querySelectorAll(".task-card");
    const visibleTasks = [];

    // Collect data only from visible task cards
    visibleTaskCards.forEach((card) => {
      const taskId = card.dataset.taskId;
      const task = this.tasks.get(taskId);
      if (task) {
        visibleTasks.push(task);
      }
    });

    // Create the board data object with only visible tasks
    const boardData = {
      tasks: visibleTasks,
      lastId: this.lastId,
    };

    // Convert the data to JSON string
    const jsonString = JSON.stringify(boardData, null, 2);

    // Create a Blob with the JSON data
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create a temporary download link
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `kanban-board-${
      new Date().toISOString().split("T")[0]
    }.json`;

    // Trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Clean up
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(downloadLink.href);
  }

  toggleTheme() {
    // Get the current theme or default to 'light'
    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "light";

    // Toggle between light and dark
    const newTheme = currentTheme === "light" ? "dark" : "light";

    // Update the data-theme attribute
    document.documentElement.setAttribute("data-theme", newTheme);

    // Update the theme toggle button text
    const themeToggleBtn = document.getElementById("themeToggle");
    themeToggleBtn.textContent = newTheme === "light" ? "🌙" : "☀️";

    // Save the theme preference
    localStorage.setItem("theme", newTheme);
  }

  deleteTask(taskId) {
    // Remove from Map
    this.tasks.delete(taskId);

    // Remove from DOM
    const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskCard) {
      taskCard.remove();
    }

    // Update storage
    this.saveToStorage();
  }

  addColumn(){
    const columnName = prompt('Enter Column Name')
    if(!columnName) return

    // const columnHtml = `
    // <div class="column" data-status="${columnName.toLocaleLowerCase().replace(/\s+/g, '')}">
    //             <h2>${columnName}</h2>
    //             <div class="task-list" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
    //             <button class="add-task-btn">+ Add Task</button>
    //         </div>
    const existingColumn = document.querySelector('.column[data-status="inprogress"]')
    const newColumn = existingColumn.cloneNode(true)

    newColumn.dataset.status = columnName.toLocaleLowerCase()
    newColumn.querySelector('h2').textContent = columnName;
    newColumn.querySelector('.task-list').innerHTML = '';  // Clear any tasks
    document.querySelector('.board-container').appendChild(newColumn);
}
    
}

// Initialize the board(Explore more on this)
const board = new KanbanBoard();
