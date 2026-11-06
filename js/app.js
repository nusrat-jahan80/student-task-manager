
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

let tasks = JSON.parse(
    localStorage.getItem("studentTasks") || "[]"
);

let currentFilter = "all";

// Save tasks in browser storage
function saveTasks() {
    localStorage.setItem(
        "studentTasks",
        JSON.stringify(tasks)
    );
}

// Display tasks
function displayTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement("li");

        li.className = task.completed
            ? "task-item completed"
            : "task-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function() {
            task.completed = checkbox.checked;
            saveTasks();
            displayTasks();
        });

        const span = document.createElement("span");
        span.className = "task-name";
        span.textContent = task.title;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            displayTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });

    if (filteredTasks.length === 0) {
        const message = document.createElement("li");
        message.className = "empty-message";

        message.textContent = tasks.length === 0
            ? "No tasks yet. Add your first task!"
            : "No tasks in this filter.";

        taskList.appendChild(message);
    }
}

// Add a new task
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const taskName = input.value.trim();

    if (taskName === "") {
        return;
    }

    const newTask = {
        id: Date.now(),
        title: taskName,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();

    input.value = "";
    displayTasks();
});

// Filter tasks
document.querySelectorAll(".filters button").forEach(button => {
    button.addEventListener("click", function() {
        currentFilter = button.dataset.filter;
        displayTasks();
    });
});

// Initial display
displayTasks();
