const express = require("express");
const app = express();

let tasks = [];
let nextId = 1;

app.use(express.static("public"));
app.use(express.json());

app.get("/api", (req, res) => {
  res.json([
    {
      message: "Hello to Tasks !"
    }
  ])
})

app.get("/api/tasks", (req, res) => {
  
  res.json(tasks);
  
});


app.get("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(task => task.id === id);

  if (!task) {
    return res.status(404).send([
      {
        message: "Tarea no encontrada :C"
      }
    ])
  } else {
    return res.status(200).json(task);
  }

  
});

app.post("/api/tasks", (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json([
      {
        message: "Mensaje necesario"
      }
    ])
  }

  const task = {
    id: nextId++,
    text: text.trim(),
    done: false,
    createdAt: Date.now()
  }

  tasks.push(task);
  res.status(201).json(task);
});


app.patch("/api/tasks/:id", (req, res) => {

  
  const id = Number(req.params.id);
  const task = tasks.find(task => task.id === id);
  if (!task) {
    return res.status(404).json([
      {
        message: "The user with that ID does not exists."
      }
    ])
  }
  // Checking which one is undefined
  if (req.body.text !== undefined) {
    task.text = req.body.text;
  }
  if (req.body.done !== undefined) {
    task.done = req.body.done;
  }
  return res.status(200).json(task);  
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex(task => task.id === id);

  if (index === -1) {
    return res.status(404).send("Nose ha podido eliminar");
  }

  tasks.splice(index, 1); // Borra el objeto
  return res.status(204).end(); // Le da termino sin retornar ningún JSON
  
});

app.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000.");
});
