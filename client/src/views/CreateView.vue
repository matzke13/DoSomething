<template>
  <div class="q-pa-md row items-center justify-center q-gutter-md" style="height: 100vh;">
    <q-card class="q-pa-md" style="width: 400px;">
      <!-- Überschrift zur Card -->
       <div class="q-mb-md">
        <q-card-title class="text-h6 ">Task erstellen</q-card-title>
       </div>

      
      <!-- Wichtig: "submit.prevent" verhindert das Neuladen der Seite -->
      <q-form @submit.prevent="submitForm">
        <!-- Titel -->
        <q-input 
          v-model="title" 
          label="Titel" 
          outlined 
          class="q-mb-md" 
        />

        <!-- Beschreibung -->
        <q-input 
          v-model="description" 
          label="Beschreibung" 
          outlined 
          class="q-mb-md" 
          type="textarea" 
        />
        
        <!-- Kamera öffnen -->
        <q-btn 
          @click="openCamera" 
          icon="photo_camera" 
          color="primary" 
          class="q-mb-md" 
        />

        <!-- Foto-Vorschau -->
        <div v-if="photo" class="q-mb-md">
          <img :src="photo" alt="Captured" style="max-width: 100%; border-radius: 8px;" />
        </div>
        
        <!-- Fälligkeitsdatum -->
        <q-input filled v-model="dueDate" label="Fälligkeitsdatum" readonly class="q-mb-md">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" @click="showDatePicker = true" />
          </template>
        </q-input>

        <!-- Date Picker Dialog -->
        <q-dialog v-model="showDatePicker">
          <q-date v-model="dueDate" mask="YYYY-MM-DD" :options="dateOptions">
            <div class="row items-center justify-end q-gutter-sm">
              <q-btn label="OK" color="primary" flat v-close-popup />
            </div>
          </q-date>
        </q-dialog>
        
        <!-- Kamera-Popup mit Video -->
        <q-dialog v-model="showCameraPopup" @show="startCamera" @hide="closeCamera">
          <q-card>
            <q-card-section>
              <video ref="videoElement" autoplay playsinline style="width: 100%;"></video>
            </q-card-section>
            <q-card-actions align="around">
              <q-btn label="Fotografieren" color="primary" @click="takePhoto" />
              <q-btn label="Abbrechen" color="grey" flat v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
        
        <!-- Speichern-Button: deaktiviert solange das Formular ungültig ist -->
        <q-btn 
          type="submit" 
          label="Speichern" 
          color="primary" 
          class="full-width q-mt-md" 
          :disable="!isFormValid" 
        />
      </q-form>
    </q-card>
  </div>
</template>

<script setup>
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { Notify } from 'quasar'

// Pinia-Store
const taskStore = useTaskStore()

// Reaktive Felder
const title = ref('')
const description = ref('')
const dueDate = ref('')
const showDatePicker = ref(false)
const showCameraPopup = ref(false)
const photo = ref(null)
let stream = null // Wird für die Kamera-Streams benutzt

// Berechnete Eigenschaft, die prüft, ob alle erforderlichen Felder ausgefüllt sind
const isFormValid = computed(() => {
  return title.value.trim() !== '' &&
         description.value.trim() !== '' &&
         dueDate.value.trim() !== '';
})

/**
 * Bestimmt, welche Daten im Kalender auswählbar sind.
 * Beispiel: Nur Datum >= heute erlaubt
 */
function dateOptions(date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const selectedDate = new Date(date)
  return selectedDate >= today
}

/**
 * Kamera starten: UserMedia-Zugriff anfordern und Video füllen.
 */
 async function startCamera() {
  try {
    // Prüfe zuerst, ob das Gerät Zugriff auf Mediengeräte hat
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');

    let constraints = { video: { facingMode: "environment" } }; // Standardmäßig Außenkamera

    // Falls mehrere Kameras vorhanden sind, wähle explizit die Rückkamera
    if (videoDevices.length > 1) {
      const backCamera = videoDevices.find(device => device.label.toLowerCase().includes("back"));
      if (backCamera) {
        constraints = { video: { deviceId: { exact: backCamera.deviceId } } };
      }
    }

    // Starte den Kamera-Stream mit den gewählten Constraints
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.value.srcObject = stream;
  } catch (error) {
    console.error("Fehler beim Zugriff auf die Kamera:", error);
  }
}



/**
 * Kamera-Popup öffnen
 */
function openCamera() {
  showCameraPopup.value = true
}

/**
 * Foto aufnehmen: Bild aus dem Video-Stream in ein Canvas zeichnen und Base64 abspeichern
 */
function takePhoto() {
  const video = videoElement.value
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  context.drawImage(video, 0, 0, canvas.width, canvas.height)

  // base64-Daten-URL
  photo.value = canvas.toDataURL('image/png')

  // Popup schließen
  showCameraPopup.value = false
  closeCamera()
}

/**
 * Kamera stoppen
 */
function closeCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    stream = null
  }
}

/**
 * Formular absenden: Neue Task anlegen
 */
async function submitForm() {
  const newTask = {
    title: title.value,
    description: description.value,
    duedate: dueDate.value,
  }

  // Falls ein Foto vorhanden ist, hochladen und URL abrufen
  if (photo.value) {
    const blob = dataURLtoBlob(photo.value)
    const fileName = `${title.value}.png`
    
    // Foto in den Supabase Storage-Bucket "images" hochladen
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, blob)

    if (error) {
      console.error('Fehler beim Upload:', error)
    } else {
      // Öffentliche URL abrufen
      const { publicURL } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)
      // Bild-URL in der Datenbank-Spalte "img_url" speichern
      newTask.img_url = publicURL
    }
  }

  console.log('Formulardaten:', newTask)

  try {
    // Task im Pinia-Store speichern (z. B. via axios POST /tasks)
    await taskStore.addTask(newTask)

    // Erfolgsmeldung anzeigen
    Notify.create({
  message: 'Task erfolgreich gespeichert!',
  color: 'positive',
  position: 'top'
})


    // Felder zurücksetzen
    title.value = ''
    description.value = ''
    dueDate.value = ''
    photo.value = null
  } catch (error) {
    console.error('Fehler beim Erstellen des Tasks:', error)
  }
}

// Video-Ref
const videoElement = ref(null)
</script>
