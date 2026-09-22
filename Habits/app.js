const express = require("express");
const app = express();
app.use(express.static("public"));
app.use(express.json());

let habits = [];
let nextId = 1;

// funcion comparativa de best
function aumento(habit) {

  habit.streak = habit.streak + 1;


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

// Hay que hacer una comparación del lastcheck y hoy
function comparison(habit) {//lastcheck = habit.lastCheckIn;

  const today = new Date().substring(0, 10);

  if (!habit.lastCheckIn) {
    habit.lastCheckIn = today;
    habit.checkins.push(today);
    return res.status(201).json(habit);

  } else if (today - lastcheck === 1) {

    habit.lastCheckIn = today;
    habit.checkins.push(today);
    return res.status(200).json(habit);
  }

}



app.get("/api/habits", (req, res) => {

  return res.json(habits);

});

app.post("/api/habits", (req, res) => {
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

  return comparison(habit);


});

app.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000.");
});
