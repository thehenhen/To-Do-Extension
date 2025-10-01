let form = document.forms["my-form"];
let ul = document.getElementById("todo-list");

chrome.storage.local.get("tasks", (data) => {
  if (data.tasks) {
    data.tasks.forEach((task) => addTask(task.text, task.completed));
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let taskInput = document.getElementById("my-input");
  let taskValue = taskInput.value.trim();

  if (taskValue === "") return;

  addTask(taskValue, false);
  saveTasks();

  taskInput.value = "";
});

function addTask(text, completed) {
  let li = document.createElement("li");

  let content = document.createElement("div");
  content.className = "task-content";

  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;
  checkbox.addEventListener("change", () => {
    li.classList.toggle("completed", checkbox.checked);
    saveTasks();
  });
  content.appendChild(checkbox);

  let taskSpan = document.createElement("span");
  taskSpan.textContent = text;
  content.appendChild(taskSpan);

  li.appendChild(content);

  let deleteIcon = document.createElement("span");
  deleteIcon.textContent = "✖"; 
  deleteIcon.className = "delete-icon";
  deleteIcon.addEventListener("click", () => {
    li.remove();
    saveTasks();
  });
  li.appendChild(deleteIcon);

  if (completed) {
    li.classList.add("completed");
  }

  ul.appendChild(li);
}



function saveTasks() {
  let tasks = [];
  document.querySelectorAll("#todo-list li").forEach((li) => {
    let text = li.querySelector("span").textContent; 
    let completed = li.querySelector("input[type='checkbox']").checked;
    tasks.push({ text, completed });
  });

  chrome.storage.local.set({ tasks });
}

document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  let query = document.getElementById("search-input").value.trim();
  if (query !== "") {
    let url = "https://www.duckduckgo.com/?q=" + encodeURIComponent(query);
    window.location.href = url; 
  }
});
