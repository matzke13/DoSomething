<template>
    <div class="q-pa-md row items-center justify-center q-gutter-md" style="height: 100vh;">
      <q-card class="q-pa-md" style="width: 400px;">
        <q-form @submit="submitForm" title="Task erstellen">
          <q-input v-model="title" label="Titel" outlined class="q-mb-md" />
          <q-input v-model="description" label="Beschreibung" outlined class="q-mb-md" type="textarea" />
          
          <q-btn @click="openCamera" icon="photo_camera" color="primary" class="q-mb-md" />
          <div v-if="photo" class="q-mb-md">
            <img :src="photo" alt="Captured" style="max-width: 100%; border-radius: 8px;" />
          </div>
          
          <q-input filled v-model="dueDate" label="Fälligkeitsdatum" readonly class="q-mb-md">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer" @click="showDatePicker = true" />
            </template>
          </q-input>
          
          <q-dialog v-model="showDatePicker">
            <q-date v-model="dueDate" mask="YYYY-MM-DD" :options="dateOptions">
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn label="Abbrechen" color="grey" flat v-close-popup />
                <q-btn label="OK" color="primary" flat v-close-popup />
              </div>
            </q-date>
          </q-dialog>
          
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
          
          <q-btn type="submit" label="Speichern" color="primary" class="full-width q-mt-md" />
        </q-form>
      </q-card>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        title: '',
        description: '',
        dueDate: '',
        showDatePicker: false,
        showCameraPopup: false,
        photo: null,
        stream: null
      };
    },
    methods: {
      dateOptions(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Aktuelles Datum ohne Zeitanteil
        const selectedDate = new Date(date);
        return selectedDate >= today;
      },
      async startCamera() {
        try {
          this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
          this.$refs.videoElement.srcObject = this.stream;
        } catch (error) {
          console.error('Fehler beim Zugriff auf die Kamera:', error);
        }
      },
      openCamera() {
        this.showCameraPopup = true;
      },
      takePhoto() {
        const video = this.$refs.videoElement;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        this.photo = canvas.toDataURL('image/png');
        this.showCameraPopup = false;
        this.closeCamera();
      },
      closeCamera() {
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
          this.stream = null;
        }
      },
      submitForm() {
        console.log('Formulardaten:', {
          title: this.title,
          description: this.description,
          dueDate: this.dueDate,
          photo: this.photo
        });
      }
    }
  };
  </script>