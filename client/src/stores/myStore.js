// ------ setup version -------
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useMyStore = defineStore('myStore', () => {
  const data = ref([]);

  const getTaks = () => {
    const response = axios.get('https://qkkuzqrwzosycvqxwoda.supabase.co/rest/v1/Tasks');
    data.value = response.data;
  };

  return { data, getTaks };
});


