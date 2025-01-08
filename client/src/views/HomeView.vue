<template>
  <div class="q-pa-md">
    <q-table
      title="Tasks"
      :rows="rows"
      :columns="columns"
      row-key="id"
    />
  </div>
</template>

<script setup>
import { useMyStore } from '@/stores/myStore';
import { onMounted, computed } from 'vue';

// Store importieren
const myStore = useMyStore();

// Columns für die Quasar-Tabelle definieren
const columns = [
  { name: 'id', required: true, label: 'ID', align: 'left', field: 'id', sortable: true },
  { name: 'title', required: true, label: 'Title', align: 'left', field: 'title', sortable: true },
  { name: 'description', label: 'Description', align: 'left', field: 'description', sortable: true },
  { name: 'dueDate', label: 'Due Date', align: 'left', field: 'dueDate', sortable: true },
  { name: 'completed', label: 'Completed', align: 'center', field: 'completed', format: val => (val ? 'Yes' : 'No'), sortable: true },
  { name: 'image', label: 'Image', align: 'center', field: 'image_url', 
    format: val => `<img src="${val}" alt="Image" style="width: 50px; height: 50px; object-fit: cover;" />`,
  },
];

// Computed Property für die Zeilen
const rows = computed(() => myStore.data);

// Daten abrufen, wenn die Komponente gemountet wird
onMounted(() => {
  myStore.getTasks();
});
</script>
