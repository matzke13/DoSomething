<template>
  <div class="q-pa-md">
    <!-- Tabelle -->
    <q-table
      v-if="!isMobile"
      title="Tasks"
      :rows="rows"
      :columns="columns"
      row-key="id"
      flat
      class="responsive-table"
    >
      <!-- Slot für 'Completed' Spalte -->
      <template v-slot:body-cell-completed="props">
        <div style="text-align: center;">
          <img 
            :src="props.row.completed ? '/icons/checkmark.svg' : '/icons/crossmark.svg'" 
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

    <!-- Kartenansicht für Mobile Geräte -->
    <div v-else class="card-wrapper">
      <div v-for="row in rows" :key="row.id" class="card">
        <div class="card-row">
          <strong>Image:</strong>
          <img 
            :src="row.image_url" 
            alt="Image" 
            style="width: 50px; height: 50px; object-fit: cover;" 
          />
        </div>
        <div class="card-row">
          <strong>Title:</strong> {{ row.title }}
        </div>
        <div class="card-row">
          <strong>Description:</strong> {{ row.description }}
        </div>
        <div class="card-row">
          <strong>Due Date:</strong> {{ row.duedate }}
        </div>
        <div class="card-row">
          <strong>Completed:</strong>
          <img 
            :src="row.completed ? '/icons/checkmark.svg' : '/icons/crossmark.svg'" 
            alt="Completed Status" 
            style="width: 30px; height: 30px; object-fit: cover;" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMyStore } from '@/stores/myStore';
import { onMounted, computed, ref } from 'vue';

// Store importieren
const myStore = useMyStore();

const columns = [
  { name: 'image', label: 'Image', align: 'center', field: 'image_url', sortable: false },
  { name: 'title', required: true, label: 'Title', align: 'left', field: 'title', sortable: true },
  { name: 'description', label: 'Description', align: 'left', field: 'description', sortable: true },
  { name: 'duedate', label: 'Due Date', align: 'left', field: 'duedate', sortable: true },
  { name: 'completed', label: 'Completed', align: 'center', field: 'completed', sortable: true },
];

// Computed Property für die Zeilen
const rows = computed(() => myStore.data);

// Daten abrufen, wenn die Komponente gemountet wird
onMounted(() => {
  myStore.getTasks();
  console.log('Sebastian Matzke');
  
});

// Überprüfen, ob der Benutzer auf einem mobilen Gerät ist
const isMobile = ref(window.innerWidth <= 768);
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth <= 768;
});
</script>

<style>
.responsive-table {
  width: 100%;
}

@media (max-width: 768px) {
  .q-table thead {
    display: none;
  }

  .card-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .card {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .card-row {
    margin-bottom: 8px;
  }

  .card-row:last-child {
    margin-bottom: 0;
  }

  .card-row strong {
    display: block;
    font-weight: bold;
    margin-bottom: 4px;
  }
}
</style>
