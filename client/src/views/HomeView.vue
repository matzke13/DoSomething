<template>
  <div class="q-pa-md">
    <!-- Tabelle (Desktop-Ansicht) -->
    <q-table
      v-if="!isMobile"
      title="Tasks"
      :rows="rows"
      :columns="columns"
      row-key="id"
      flat
      class="responsive-table"
      :rows-per-page-options="[0]"
    >
      <!-- completed-Template -->
      <template v-slot:body-cell-completed="props">
        <q-td style="text-align: center;">
          <img
            :src="props.row.completed ? '/icons/checkmark.svg' : '/icons/crossmark.svg'"
            alt="Completed Status"
            style="width: 30px; height: 30px; object-fit: cover;"
          />
        </q-td>
      </template>

      <!-- image-Template -->
      <template v-slot:body-cell-image="props">
        <q-td style="text-align: center;">
          <img
            :src="
              'https://qkkuzqrwzosycvqxwoda.supabase.co/storage/v1/object/public/images/' +
              props.row.title +
              '.jpg'
            "
            alt="Image"
            style="width: 50px; height: 50px; object-fit: cover;"
            @error="handleImageError"
          />
        </q-td>
      </template>

      <!-- description-Template -->
      <template v-slot:body-cell-description="props">
        <q-td style="max-height: 50px; overflow: auto;">
          {{ props.row.description }}
        </q-td>
      </template>

      <!-- actions-Template -->
      <template v-slot:body-cell-actions="props">
        <q-td style="text-align: center;">
          <q-toggle
            :model-value="props.row.completed"
            @update:model-value="val => toggleCompleted(props.row, val)"
            :color="props.row.completed ? 'green' : 'grey'"
          />
          <q-btn color="red" label="DELETE" @click="removeTask(props.row.id)" />
        </q-td>
      </template>
    </q-table>

    <!-- Kartenansicht (Mobile) -->
    <div v-else class="card-wrapper">
      <div v-for="row in rows" :key="row.id" class="card">
        <div class="card-row">
          <strong>Image:</strong>
          <img
            :src="
              'https://qkkuzqrwzosycvqxwoda.supabase.co/storage/v1/object/public/images/' +
              row.title +
              '.jpg'
            "
            alt="Image"
            style="width: 50px; height: 50px; object-fit: cover;"
            @error="handleImageError"
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
          <q-toggle
            :model-value="row.completed"
            @update:model-value="val => toggleCompleted(row, val)"
            :color="row.completed ? 'green' : 'grey'"
          />
        </div>
        <div
          class="card-row"
          style="display: flex; justify-content: center; gap: 8px;"
        >
          <q-btn color="blue" label="Bearbeiten" @click="editTask(row)" />
          <q-btn color="red" label="Entfernen" @click="removeTask(row.id)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTaskStore } from '@/stores/taskStore'
import { onMounted, onUnmounted, computed, ref } from 'vue'

const taskStore = useTaskStore()

const columns = [
  { name: 'image', label: 'Image', align: 'center', field: 'image_url', sortable: false },
  { name: 'title', required: true, label: 'Title', align: 'left', field: 'title', sortable: true },
  {
    name: 'description',
    label: 'Description',
    align: 'left',
    field: 'description',
    sortable: true
  },
  { name: 'duedate', label: 'Due Date', align: 'left', field: 'duedate', sortable: true },
  { name: 'completed', label: 'Completed', align: 'center', field: 'completed', sortable: true },
  { name: 'actions', label: 'Actions', align: 'center', field: 'actions', sortable: false }
]

const rows = computed(() => taskStore.tasks)
const isMobile = ref(false)

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

const toggleCompleted = async (task, newVal) => {
  console.log('Toggling completed status for:', task.id, '->', newVal)
  await taskStore.updateTask(task.id, { completed: newVal })
}

const removeTask = async (taskId) => {
  await taskStore.deleteTask(taskId)
}

onMounted(async () => {
  await taskStore.getTasks()
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const editTask = (task) => {
  console.log('Bearbeiten:', task)
}

/**
 * Fehlerbehandlung für das Bild:
 * 1) Wenn .jpg nicht geht, versuche .png
 * 2) Falls .png auch nicht geht, Fallback-Icon
 */
function handleImageError(e) {
  if (e.target.src.endsWith('.jpg')) {
    e.target.src = e.target.src.replace('.jpg', '.png')
  } else {
    e.target.src = '/icons/cross.png'
  }
}
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
