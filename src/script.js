let tasks = [];
let taskIdCounter = 1;

if (localStorage.getItem("tasks")) {
  let savedTasks = localStorage.getItem("tasks");
  tasks = JSON.parse(savedTasks);
  if (tasks.length > 0) {
    let maxId = 0;
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id > maxId) {
        maxId = tasks[i].id;
      }
    }
    taskIdCounter = maxId + 1;
  }
  displayTasks();
  updateStats();
}

document.getElementById("taskForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let subject = document.getElementById("subject").value;
  let task = document.getElementById("task").value;
  let priority = document.getElementById("priority").value;
  let dueDate = document.getElementById("dueDate").value;

  let newTask = {
    id: taskIdCounter,
    subject: subject,
    task: task,
    priority: priority,
    dueDate: dueDate,
    completed: false,
  };

  taskIdCounter = taskIdCounter + 1;
  tasks.push(newTask);

  localStorage.setItem("tasks", JSON.stringify(tasks));

  displayTasks();
  updateStats();

  document.getElementById("subject").value = "";
  document.getElementById("task").value = "";
  document.getElementById("priority").value = "medium";
  document.getElementById("dueDate").value = "";
});

document.getElementById("searchInput").addEventListener("input", function () {
  displayTasks();
});

function displayTasks() {
  let searchTerm = document.getElementById("searchInput").value.toLowerCase();
  let filteredTasks = [];

  for (let i = 0; i < tasks.length; i++) {
    let taskSubject = tasks[i].subject.toLowerCase();
    let taskDesc = tasks[i].task.toLowerCase();
    if (
      taskSubject.indexOf(searchTerm) !== -1 ||
      taskDesc.indexOf(searchTerm) !== -1
    ) {
      filteredTasks.push(tasks[i]);
    }
  }

  displayTaskList("tasksList", filteredTasks);

  let pendingTasks = [];
  for (let i = 0; i < filteredTasks.length; i++) {
    if (filteredTasks[i].completed === false) {
      pendingTasks.push(filteredTasks[i]);
    }
  }
  displayTaskList("pendingList", pendingTasks);

  let completedTasks = [];
  for (let i = 0; i < filteredTasks.length; i++) {
    if (filteredTasks[i].completed === true) {
      completedTasks.push(filteredTasks[i]);
    }
  }
  displayTaskList("completedList", completedTasks);
}

function displayTaskList(containerId, taskList) {
  let container = document.getElementById(containerId);
  let html = "";

  if (taskList.length === 0) {
    html =
      '<div class="empty-message"><p>No tasks found. Add a new task to get started!</p></div>';
    container.innerHTML = html;
    return;
  }

  for (let i = 0; i < taskList.length; i++) {
    let task = taskList[i];
    let priorityClass = task.priority + "-priority";
    let completedClass = "";
    if (task.completed === true) {
      completedClass = "completed";
    }

    let taskHtml =
      '<div class="task-item ' + priorityClass + " " + completedClass + '">';
    taskHtml += '<div class="task-info">';
    taskHtml += '<div class="task-subject">' + task.subject + "</div>";
    taskHtml += '<div class="task-details">' + task.task + "</div>";

    if (task.dueDate !== "") {
      let dateStr = formatDate(task.dueDate);
      taskHtml += '<div class="task-details">Due: ' + dateStr + "</div>";
    }

    taskHtml += "</div>";
    taskHtml += '<div class="task-actions">';

    if (task.completed === true) {
      taskHtml +=
        '<button class="btn btn-sm btn-secondary" onclick="toggleComplete(' +
        task.id +
        ')">Undo</button>';
    } else {
      taskHtml +=
        '<button class="btn btn-sm btn-success" onclick="toggleComplete(' +
        task.id +
        ')">Complete</button>';
    }

    taskHtml +=
      '<button class="btn btn-sm btn-danger" onclick="deleteTask(' +
      task.id +
      ')">Delete</button>';
    taskHtml += "</div>";
    taskHtml += "</div>";

    html = html + taskHtml;
  }

  container.innerHTML = html;
}

function toggleComplete(id) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      if (tasks[i].completed === true) {
        tasks[i].completed = false;
      } else {
        tasks[i].completed = true;
      }
      break;
    }
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
  updateStats();
}

function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    let newTasks = [];
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id !== id) {
        newTasks.push(tasks[i]);
      }
    }
    tasks = newTasks;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
    updateStats();
  }
}

function clearAll() {
  if (
    confirm("Are you sure you want to clear all tasks? This cannot be undone.")
  ) {
    tasks = [];
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
    updateStats();
  }
}

function updateStats() {
  let total = tasks.length;
  let completed = 0;
  let pending = 0;

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].completed === true) {
      completed = completed + 1;
    }
  }

  pending = total - completed;

  document.getElementById("totalTasks").textContent = total;
  document.getElementById("completedTasks").textContent = completed;
  document.getElementById("pendingTasks").textContent = pending;
}

function formatDate(dateString) {
  if (dateString === "") {
    return "";
  }

  let date = new Date(dateString);
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[date.getMonth()];
  let day = date.getDate();
  let year = date.getFullYear();

  return month + " " + day + ", " + year;
}

