import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useTaskStore = defineStore('taskStore', () => {
  const tasks = ref([])

  // Alle Tasks abrufen
  const getTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/tasks')
      tasks.value = response.data
    } catch (error) {
      console.error('Fehler beim Abrufen der Tasks:', error)
    }
  }

  // Neuen Task erstellen
  const addTask = async (task) => {
    try {
      // Hier wird POST /tasks aufgerufen
      const response = await axios.post('http://localhost:3000/tasks', task)
      tasks.value.push(response.data)
    } catch (error) {
      console.error('Fehler beim Erstellen des Tasks:', error)
    }
  }

  // Task aktualisieren
  const updateTask = async (id, updates) => {
    try {
      await axios.patch(`http://localhost:3000/tasks/${id}`, updates)
      const task = tasks.value.find((t) => t.id === id)
      if (task) {
        Object.assign(task, updates)
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Tasks:', error)
    }
  }

  // Task löschen
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${id}`)
      tasks.value = tasks.value.filter((t) => t.id !== id)
    } catch (error) {
      console.error('Fehler beim Löschen des Tasks:', error)
    }
  }

  return {
    tasks,
    getTasks,
    addTask,
    updateTask,
    deleteTask
  }
})
