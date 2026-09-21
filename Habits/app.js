const express = require("express");
const app = express();
app.use(express.static("public"));
app.use(express.json());

let habits = [];
let nextId = 1;

function comparison(iso, habit) { // iso viene como new Date();

  const iso = iso.toISOString().substring(0, 10); // YYYY-MM-DD
  const today = new Date().toISOString().substring(0, 10); // YYYY-MM-DD
  if (iso.substring(0,3) > today.substring(0,3)) { // verificacion año
    if (Number(iso.substring(5,7)) + 12 == 13 && Number(today.substring(5,7)) == 1) { // verificacion mes por cambio de año
      habit.lastCheckIn = (today);
      habit.checkins.push(today);
      habit.streak = habit.streak++;

      return res.json(habit);
    } else if (Number(today.)) {
      
    }
  }
}

/*
{
  id: number,
  name: string,
  streak: number,
  best: number,
  lastCheckIn: string|null,
  checkins: string[]
}
*/


app.get("/api/habits", (req, res) => {

  return res.json(habits);
  
});

app.post("/api/habits", (req, res) => {
  const id = Number(req.params.id);

  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json([
      {
        message: "Habit was not created, because name is required."
      }
    ]);
  }

  const habit = {
    id: nextId++,
    name: name.trim(),
    streak: 0,
    best: 0,
    lastCheckIn: null,
    checkins: []
  };

  habits.push(habit);

  return res.status(201).json(habit);
  
});


app.post("/api/habits/:id/checkin", (req, res) => {
  const id = Number(req.params.id);
  const habit = habits.find(habit => habit.id === id);

  

  if (!habit) {
    return res.status(404).json([
      {
        message: "The habit that you're trying to check-in does not exists."
      }
    ])
  }
  
  if (habit.lastCheckIn === null) {
    habit.lastCheckIn.push(new Date().toISOString().substring(0, 10));
    habit.streak = habit.streak++;
  } else if (new Date().toISOString().substring(0, 10) - habit.lastCheckIn.toISOString().substring(0, 10) === 1) {
    habit.streak = habit.streak++;
    checkins.push(new Date().toISOString().substring(0, 10));
  } else {
    habit.streak = 0;
  }
  
});

app.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000.");
});
