const API_URL = "/api/habits";
const RULER_DAYS_DESKTOP = 21;
const RULER_DAYS_TABLET = 14;
const RULER_DAYS_MOBILE = 7;

const listEl = document.getElementById("habit-list");
const emptyEl = document.getElementById("empty-state");
const errorEl = document.getElementById("error-state");
const formEl = document.getElementById("add-form");
const inputEl = document.getElementById("add-input");
const shutterEl = document.getElementById("shutter");
const shutterCountEl = document.getElementById("shutter-count");
const dateLineEl = document.getElementById("date-line");
const dayPlateEl = document.getElementById("day-plate");
const liveRegion = document.getElementById("live-region");
const retryBtn = document.getElementById("retry-btn");

let habits = [];

// --- fecha ---
function todayISO() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

function renderDateLine() {
  const d = new Date();
  const opts = { weekday: "long", day: "numeric", month: "long" };
  const text = d.toLocaleDateString("es-ES", opts);
  dateLineEl.textContent = text.charAt(0).toUpperCase() + text.slice(1);
}
renderDateLine();

window.addEventListener("scroll", () => {
  dayPlateEl.classList.toggle("compact", window.scrollY > 24);
});

// --- carga ---
async function loadHabits() {
  errorEl.hidden = true;
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("bad response");
    habits = await res.json();
    render();
  } catch (err) {
    listEl.innerHTML = "";
    emptyEl.hidden = true;
    errorEl.hidden = false;
  }
}
retryBtn.addEventListener("click", loadHabits);

// --- ruler días visibles según ancho ---
function rulerDayCount() {
  const w = window.innerWidth;
  if (w < 600) return RULER_DAYS_MOBILE;
  if (w < 900) return RULER_DAYS_TABLET;
  return RULER_DAYS_DESKTOP;
}

function addDays(iso, delta) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + delta);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

// --- render shutter ---
function renderShutter() {
  shutterEl.innerHTML = "";
  const doneCount = habits.filter((h) => h.checkins && h.checkins.includes(todayISO())).length;
  const total = habits.length;

  habits.forEach((h) => {
    const seg = document.createElement("div");
    seg.className = "shutter-seg";
    const done = h.checkins && h.checkins.includes(todayISO());
    if (done) seg.classList.add(doneCount === total && total > 0 ? "all-done" : "filled");
    shutterEl.appendChild(seg);
  });

  shutterCountEl.textContent = total === 0
    ? "0 of 0 done today"
    : doneCount === total
      ? "All done today."
      : `${doneCount} of ${total} done today`;
}

// --- render lista ---
function render() {
  listEl.innerHTML = "";

  if (habits.length === 0) {
    emptyEl.hidden = false;
  } else {
    emptyEl.hidden = true;
    habits.forEach((h) => listEl.appendChild(renderRow(h)));
  }

  renderShutter();
}

function renderRow(habit) {
  const today = todayISO();
  const doneToday = habit.checkins && habit.checkins.includes(today);
  const isBroken = !doneToday && habit.lastCheckIn && habit.lastCheckIn !== addDays(today, -1);

  const li = document.createElement("li");
  li.className = "habit-row" + (doneToday ? " done" : "") + (isBroken ? " broken" : "");
  li.dataset.id = habit.id;
  if (habit._pending) li.classList.add("pending");
  if (habit._failed) li.classList.add("failed");

  // plunger
  const plunger = document.createElement("button");
  plunger.type = "button";
  plunger.className = "plunger";
  plunger.setAttribute("aria-pressed", String(!!doneToday));
  plunger.setAttribute("aria-label", (doneToday ? "Checked in " : "Check in ") + habit.name);

  const fill = document.createElement("div");
  fill.className = "plunger-fill";
  const knurl = document.createElement("div");
  knurl.className = "plunger-knurl";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.classList.add("plunger-check");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M5 13l4 4 10-10");
  path.classList.add("check-path");
  svg.appendChild(path);

  plunger.appendChild(fill);
  plunger.appendChild(knurl);
  plunger.appendChild(svg);
  plunger.addEventListener("click", () => toggleCheckIn(habit));

  // body
  const body = document.createElement("div");
  body.className = "habit-body";

  const name = document.createElement("p");
  name.className = "habit-name";
  name.textContent = habit.name;
  name.title = habit.name;

  const ruler = buildRuler(habit);

  const caption = document.createElement("p");
  caption.className = "ruler-caption";
  caption.textContent = `last ${rulerDayCount()} days`;

  const srSpan = document.createElement("span");
  srSpan.className = "sr-only";
  srSpan.textContent = `${habit.streak} day streak`;

  body.appendChild(name);
  body.appendChild(ruler);
  body.appendChild(caption);
  body.appendChild(srSpan);

  if (habit._failed) {
    const err = document.createElement("p");
    err.className = "save-error";
    err.textContent = "Couldn't save that. Try again.";
    body.appendChild(err);
  }

  // odometer
  const odometer = buildOdometer(habit.streak);
  const odoCaption = document.createElement("span");
  odoCaption.className = "odometer-caption";
  odoCaption.textContent = habit.streak === 1 ? "day streak" : "days";
  const odoWrap = document.createElement("div");
  odoWrap.style.display = "flex";
  odoWrap.style.alignItems = "center";
  odoWrap.appendChild(odometer);
  odoWrap.appendChild(odoCaption);

  // delete
  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.className = "delete-btn";
  delBtn.textContent = "×";
  delBtn.setAttribute("aria-label", "Delete " + habit.name);
  delBtn.addEventListener("click", () => li.classList.add("confirming"));

  const confirmStrip = document.createElement("div");
  confirmStrip.className = "confirm-strip";
  const confirmText = document.createElement("span");
  confirmText.textContent = "Delete this habit?";
  const confirmActions = document.createElement("div");
  const btnDelete = document.createElement("button");
  btnDelete.className = "confirm-delete";
  btnDelete.type = "button";
  btnDelete.textContent = "Delete";
  btnDelete.addEventListener("click", () => deleteHabit(habit, li));
  const btnKeep = document.createElement("button");
  btnKeep.className = "confirm-keep";
  btnKeep.type = "button";
  btnKeep.textContent = "Keep";
  btnKeep.addEventListener("click", () => li.classList.remove("confirming"));
  confirmActions.appendChild(btnKeep);
  confirmActions.appendChild(btnDelete);
  confirmStrip.appendChild(confirmText);
  confirmStrip.appendChild(confirmActions);

  li.appendChild(plunger);
  li.appendChild(body);
  li.appendChild(odoWrap);
  li.appendChild(delBtn);
  li.appendChild(confirmStrip);

  return li;
}

function buildRuler(habit) {
  const days = rulerDayCount();
  const today = todayISO();
  const checkins = habit.checkins || [];

  const ruler = document.createElement("div");
  ruler.className = "ruler";
  ruler.setAttribute("aria-hidden", "true");

  for (let i = days - 1; i >= 0; i--) {
    const iso = addDays(today, -i);
    const tick = document.createElement("div");
    tick.className = "tick";

    const isWeekMarker = i % 7 === 0;
    if (isWeekMarker) tick.classList.add("week-marker");

    const done = checkins.includes(iso);
    if (iso === today) {
      tick.classList.add(done ? "today-done" : "today-open");
    } else if (done) {
      tick.classList.add("done");
    }

    ruler.appendChild(tick);
  }

  return ruler;
}

function buildOdometer(streak) {
  const digits = String(streak).padStart(2, "0").split("").map(Number);
  const odometer = document.createElement("div");
  odometer.className = "odometer";

  digits.forEach((d) => {
    const drum = document.createElement("div");
    drum.className = "drum";
    const strip = document.createElement("div");
    strip.className = "strip";
    for (let n = 0; n <= 9; n++) {
      const span = document.createElement("span");
      span.textContent = n;
      strip.appendChild(span);
    }
    const extraZero = document.createElement("span");
    extraZero.textContent = "0";
    strip.appendChild(extraZero);
    strip.style.transform = `translateY(-${d}em)`;
    drum.appendChild(strip);
    odometer.appendChild(drum);
  });

  return odometer;
}

function announce(msg) {
  liveRegion.textContent = msg;
}

// --- API calls ---
formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = inputEl.value.trim();
  if (!name) return;
  inputEl.value = "";

  const tempId = "temp-" + Date.now();
  const optimistic = { id: tempId, name, streak: 0, best: 0, lastCheckIn: null, checkins: [], _pending: true };
  habits.push(optimistic);
  render();

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("create failed");
    const created = await res.json();
    const idx = habits.findIndex((h) => h.id === tempId);
    if (idx !== -1) habits[idx] = created;
    render();
  } catch (err) {
    const idx = habits.findIndex((h) => h.id === tempId);
    if (idx !== -1) {
      habits[idx]._pending = false;
      habits[idx]._failed = true;
    }
    render();
  }
});

async function toggleCheckIn(habit) {
  const today = todayISO();
  const wasDone = habit.checkins && habit.checkins.includes(today);

  if (wasDone) {
    // undo
    try {
      const res = await fetch(`${API_URL}/${habit.id}/checkin`, { method: "DELETE" });
      if (!res.ok) throw new Error("undo failed");
      const updated = await res.json();
      const idx = habits.findIndex((h) => h.id === habit.id);
      if (idx !== -1) habits[idx] = updated;
      render();
    } catch (err) {
      render();
    }
  } else {
    try {
      const res = await fetch(`${API_URL}/${habit.id}/checkin`, { method: "POST" });
      if (!res.ok) throw new Error("checkin failed");
      const updated = await res.json();
      const idx = habits.findIndex((h) => h.id === habit.id);
      if (idx !== -1) habits[idx] = updated;
      render();
      announce(`${habit.name} checked in. ${updated.streak} days.`);
    } catch (err) {
      render();
    }
  }
}

async function deleteHabit(habit, li) {
  li.style.transition = "opacity 180ms ease-in";
  li.style.opacity = "0";

  try {
    const res = await fetch(`${API_URL}/${habit.id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("delete failed");
    habits = habits.filter((h) => h.id !== habit.id);
    render();
  } catch (err) {
    li.classList.remove("confirming");
    li.style.opacity = "1";
  }
}

window.addEventListener("resize", () => render());

loadHabits();
