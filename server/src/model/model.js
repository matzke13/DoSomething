import { query } from '../../boilerplate/db/index.js';

// Alle Tasks abrufen
export const getTasks = async () => {
  const { rows } = await query("SELECT * FROM tasks");
  return rows;
};

// Task löschen
export const deleteTask = async (id) => {
  try {
    const { rows } = await query("DELETE FROM tasks WHERE id = $1 RETURNING *", [id]);
    if (rows.length === 0) {
      throw new Error("Task not found");
    }
    return rows[0];
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// Task erstellen
export const createTask = async (title, description, duedate, image_url, completed = false) => {
  console.log("🔄 createTask() wird ausgeführt...");
  console.log("📥 Eingehende Werte:", { title, description, duedate, image_url, completed });

  try {
    const sql = `
      INSERT INTO tasks (title, description, duedate, image_url, completed) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *;
    `;

    const values = [title, description, duedate, image_url, completed];
    const { rows } = await query(sql, values);

    if (!rows.length) {
      throw new Error("Task wurde nicht erstellt.");
    }

    console.log("✅ Task erfolgreich in DB gespeichert:", rows[0]);
    return rows[0]; 
  } catch (error) {
    console.error("❌ SQL Fehler:", error);
    throw new Error(error.message);
  }
};

export const updateTaskStatus = async (id, completed) => {
  try {
    const sql = `
      UPDATE tasks 
      SET completed = $1 
      WHERE id = $2 
      RETURNING *;
    `;

    const values = [completed, id];
    const { rows } = await query(sql, values);

    if (rows.length === 0) {
      throw new Error("Task nicht gefunden.");
    }

    return rows[0];
  } catch (error) {
    throw new Error(error.message);
  }
};


