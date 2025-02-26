import asyncHandler from 'express-async-handler';
import { getTasks, deleteTask, createTask, updateTaskStatus } from '../model/model.js';


// Alle Tasks abrufen
export const getTasksController = asyncHandler(async (req, res) => {
  res.status(200).json(await getTasks());
});

// Task löschen
export const deleteTaskController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedTask = await deleteTask(id);

  if (!deletedTask) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(200).json(deletedTask);
});

// Task erstellen
export const createTaskController = asyncHandler(async (req, res) => {
  console.log("✅ POST /tasks aufgerufen");
  console.log("📩 Request Body:", req.body);

  const { title, description, duedate} = req.body;

  if (!title || !description || !duedate) {
    console.log("❌ Fehler: Fehlende Felder");
    return res.status(400).json({ message: "Bitte alle Felder ausfüllen!" });
  }

  try {
    const newTask = await createTask(title, description, duedate);
    console.log("✅ Task erstellt:", newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.error("❌ Fehler beim Erstellen des Tasks:", error);
    res.status(500).json({ message: error.message });
  }
});


export const updateTaskStatusController = asyncHandler(async (req, res) => {
  console.log("✅ PATCH /tasks/:id aufgerufen");
  console.log("📩 Request Body:", req.body);

  const { id } = req.params;
  const { completed } = req.body;

  if (typeof completed !== "boolean") {
    console.log("❌ Fehler: Ungültiger completed-Wert");
    return res.status(400).json({ message: "completed muss true oder false sein." });
  }

  try {
    const updatedTask = await updateTaskStatus(id, completed);
    console.log("✅ Task erfolgreich aktualisiert:", updatedTask);
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("❌ Fehler beim Aktualisieren des Tasks:", error);
    res.status(500).json({ message: error.message });
  }
});
