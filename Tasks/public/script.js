const API_URL = "/api/tasks";

const listEl = document.getElementById("task-list");
const statusEl = document.getElementById("status-line");
const emptyEl = document.getElementById("empty-state");
const errorEl = document.getElementById("error-state");
const formEl = document.getElementById("capture-form");
const inputEl = document.getElementById("capture-input");
const sortEl = document.getElementById("sort-select");
const filterTabs = document.querySelectorAll(".filter-tab");
const themeToggle = document.getElementById("theme-toggle");
const retryBtn = document.getElementById("retry-btn");

let tasks = [];
let filter = "all";
let sort = "newest";

// --- tema ---
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀" : "☾";
}

(function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) applyTheme(saved);
})();

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (_) {}
});

// --- carga inicial ---
async function loadTasks() {
  errorEl.hidden = true;
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("bad response");
    tasks = await res.json();
    render();
  } catch (err) {
    listEl.innerHTML = "";
    emptyEl.hidden = true;
    errorEl.hidden = false;
    statusEl.textContent = "";
  }
}

retryBtn.addEventListener("click", loadTasks);

// --- filtros y orden ---
filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    filterTabs.forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    filter = tab.dataset.filter;
    render();
  });
});

sortEl.addEventListener("change", () => {
  sort = sortEl.value;
  render();
});

function getVisibleTasks() {
  let visible = tasks.filter((t) => {
    if (filter === "open") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  visible = [...visible].sort((a, b) => {
    if (sort === "az") return a.text.localeCompare(b.text);
    if (sort === "oldest") return a.createdAt - b.createdAt;
    return b.createdAt - a.createdAt;
  });

  return visible;
}

// --- render ---
function render() {
  const openCount = tasks.filter((t) => !t.done).length;
  const doneCount = tasks.length - openCount;

  statusEl.textContent = openCount === 0 && tasks.length > 0
    ? "All clear."
    : `${openCount} tasks left, ${doneCount} done today`;

  const visible = getVisibleTasks();
  listEl.innerHTML = "";

  if (tasks.length === 0) {
    emptyEl.hidden = false;
    emptyEl.querySelector(".empty-title").textContent = "Nothing on the sheet yet.";
    emptyEl.querySelector(".empty-sub").textContent = "Type your first task above.";
  } else if (visible.length === 0) {
    emptyEl.hidden = false;
    emptyEl.querySelector(".empty-title").textContent =
      filter === "open" ? "No open tasks." : "Nothing done yet.";
    emptyEl.querySelector(".empty-sub").textContent = "";
  } else {
    emptyEl.hidden = true;
  }

  visible.forEach((task) => listEl.appendChild(renderRow(task)));
}

function renderRow(task) {
  const li = document.createElement("li");
  li.className = "task-row" + (task.done ? " done" : "");
  li.dataset.id = task.id;
  if (task._pending) li.classList.add("pending");
  if (task._failed) li.classList.add("failed");
  if (task._justAdded) {
    li.classList.add("just-added");
    delete task._justAdded;
  }

  const label = document.createElement("label");
  label.className = "checkbox-label";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.addEventListener("change", () => toggleDone(task));
  const visual = document.createElement("span");
  visual.className = "checkbox-visual";
  label.appendChild(checkbox);
  label.appendChild(visual);

  const textWrap = document.createElement("span");
  textWrap.className = "task-text";
  const inner = document.createElement("span");
  inner.className = "task-text-inner";
  inner.textContent = task.text;
  const bar = document.createElement("span");
  bar.className = "strike-bar";
  textWrap.appendChild(inner);
  textWrap.appendChild(bar);

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.type = "button";
  editBtn.textContent = "✎";
  editBtn.setAttribute("aria-label", "Editar tarea");
  editBtn.addEventListener("click", () => startEdit(li, task, textWrap));

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.type = "button";
  deleteBtn.textContent = "✕";
  deleteBtn.setAttribute("aria-label", "Borrar tarea");
  deleteBtn.addEventListener("click", () => deleteTask(task, li));

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  if (task._failed) {
    const retry = document.createElement("button");
    retry.className = "retry-inline";
    retry.type = "button";
    retry.textContent = "Retry";
    retry.addEventListener("click", () => retryTask(task));
    li.appendChild(label);
    li.appendChild(textWrap);
    li.appendChild(retry);
    li.appendChild(actions);
  } else {
    li.appendChild(label);
    li.appendChild(textWrap);
    li.appendChild(actions);
  }

  return li;
}

function startEdit(li, task, textWrap) {
  const input = document.createElement("input");
  input.className = "edit-input";
  input.value = task.text;
  li.replaceChild(input, textWrap);
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);

  const finish = (save) => {
    if (save && input.value.trim()) {
      updateTaskText(task, input.value.trim());
    } else {
      render();
    }
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") finish(true);
    if (e.key === "Escape") finish(false);
  });
  input.addEventListener("blur", () => finish(true));
}

// --- API calls ---
formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;
  inputEl.value = "";

  const tempId = "temp-" + Date.now();
  const optimistic = { id: tempId, text, done: false, createdAt: Date.now(), _pending: true, _justAdded: true };
  tasks.unshift(optimistic);
  render();

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error("create failed");
    const created = await res.json();
    const idx = tasks.findIndex((t) => t.id === tempId);
    if (idx !== -1) tasks[idx] = { ...created, _justAdded: true };
    render();
  } catch (err) {
    const idx = tasks.findIndex((t) => t.id === tempId);
    if (idx !== -1) {
      tasks[idx]._pending = false;
      tasks[idx]._failed = true;
    }
    render();
  }
});

async function toggleDone(task) {
  const previous = task.done;
  task.done = !task.done;
  render();

  try {
    const res = await fetch(`${API_URL}/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: task.done }),
    });
    if (!res.ok) throw new Error("update failed");
  } catch (err) {
    task.done = previous;
    render();
  }
}

async function updateTaskText(task, newText) {
  const previous = task.text;
  task.text = newText;
  render();

  try {
    const res = await fetch(`${API_URL}/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText }),
    });
    if (!res.ok) throw new Error("update failed");
  } catch (err) {
    task.text = previous;
    render();
  }
}

async function deleteTask(task, li) {
  li.style.transition = "opacity 180ms ease-in, max-height 180ms ease-in";
  li.style.opacity = "0";

  try {
    const res = await fetch(`${API_URL}/${task.id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("delete failed");
    tasks = tasks.filter((t) => t.id !== task.id);
    render();
  } catch (err) {
    task._failed = true;
    render();
  }
}

async function retryTask(task) {
  task._failed = false;
  task._pending = true;
  render();

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: task.text }),
    });
    if (!res.ok) throw new Error("retry failed");
    const created = await res.json();
    const idx = tasks.findIndex((t) => t.id === task.id);
    if (idx !== -1) tasks[idx] = created;
    render();
  } catch (err) {
    task._pending = false;
    task._failed = true;
    render();
  }
}

loadTasks();
