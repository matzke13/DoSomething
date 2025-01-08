import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios'; // Corrected import statement

export const useMyStore = defineStore('myStore', () => {
  const data = ref([]);

  const getTasks = async () => { // Marked as async
    try {
      const response = await axios.get('http://localhost:3000/tasks'); // Await axios call
      data.value = response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error); // Added error handling
    }
  };

  return { data, getTasks };
});
