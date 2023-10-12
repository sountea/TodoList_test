"use strict";

// Soumettre une nouvelle tâche
document.getElementById("todo-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const newTask = document.getElementById("new-task").value.trim();

  if (newTask) {
    addTask(newTask);
  }
});

// Gestion des clics sur les tâches
document.getElementById("tasks-list").addEventListener("click", function (e) {
  const li = e.target;
  if (li.tagName === "LI") {
    const taskId = li.getAttribute("data-task-id");
    if (li.classList.contains("completed")) {
      deleteTask(taskId);
    } else {
      completeTask(taskId);
    }
  }
});

// Fonctions pour interagir avec le serveur
function addTask(taskName) {
  fetch("controller.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `action=add&task_name=${taskName}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        const li = document.createElement("li");
        li.textContent = taskName;
        li.setAttribute("data-task-id", data.task_id); // Pour identifier la tâche plus tard
        document.getElementById("tasks-list").appendChild(li);
        document.getElementById("new-task").value = "";
      }
    });
}

function completeTask(taskId) {
  fetch("controller.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `action=complete&task_id=${taskId}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        const li = document.querySelector(`li[data-task-id="${taskId}"]`);
        li.classList.add("completed");
      }
    });
}

function deleteTask(taskId) {
  fetch("controller.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `action=delete&task_id=${taskId}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        const li = document.querySelector(`li[data-task-id="${taskId}"]`);
        li.remove();
      }
    });
}
function displayTasks() {
  const sortOrder = document.getElementById("sort-order").value;
  fetch(`controller.php?action=list&order=${sortOrder}`)
    .then((response) => response.json())
    .then((tasks) => {
      const tasksList = document.getElementById("tasks-list");
      tasksList.innerHTML = ""; // Effacer la liste actuelle
      tasks.forEach((task) => {
        const li = document.createElement("li");
        li.textContent = `${task.task_name} (Créée le: ${new Date(
          task.creation_date
        ).toLocaleDateString()})`;
        li.setAttribute("data-task-id", task.id); // Pour identifier la tâche plus tard
        tasksList.appendChild(li);
      });
    });
}
// Appeler la fonction  pour afficher toutes les tâche
displayTasks();
