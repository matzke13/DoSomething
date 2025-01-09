<template>
  <div class="q-pa-md">
    <q-table
      title="Tasks"
      :rows="rows"
      :columns="columns"
      row-key="id"
    >
      <!-- Slot für 'Completed' Spalte -->
      <template v-slot:body-cell-completed="props">
        <div style="text-align: center;">
          <!-- Überprüfe, ob die Aufgabe abgeschlossen ist und lade das entsprechende Bild -->
          <img 
            :src="props.row.completed ? 'http://localhost:3000/icons/checkmark.svg' : 'http://localhost:3000/icons/crossmark.svg'" 
            alt="Completed Status" 
            style="width: 30px; height: 30px; object-fit: cover;" 
          />
        </div>
      </template>

      <!-- Slot für 'Image' Spalte -->
      <template v-slot:body-cell-image="props">
        <div style="text-align: center;">
          <img 
            :src="props.row.image_url" 
            alt="Image" 
            style="width: 50px; height: 50px; object-fit: cover;" 
          />
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { useMyStore } from '@/stores/myStore';
import { onMounted, computed } from 'vue';

// Store importieren
const myStore = useMyStore();

const columns = [
{ name: 'image', label: 'Image', align: 'center', field: 'image_url', sortable: false },
  { name: 'title', required: true, label: 'Title', align: 'left', field: 'title', sortable: true },
  { name: 'description', label: 'Description', align: 'left', field: 'description', sortable: true },
  { name: 'duedate', label: 'Due Date', align: 'left', field: 'duedate', sortable: true },
  
  // Spalte für den 'completed' Status
  { name: 'completed', label: 'Completed', align: 'center', field: 'completed', sortable: true },

  // Spalte für das Bild (image_url)

];


// Computed Property für die Zeilen
const rows = computed(() => myStore.data);

// Daten abrufen, wenn die Komponente gemountet wird
onMounted(() => {
  myStore.getTasks();
});
</script>
