<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const leftDrawerOpen = ref(false);
const isOffline = ref(!navigator.onLine);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const updateOnlineStatus = () => {
  isOffline.value = !navigator.onLine;
};

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
});

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus);
  window.removeEventListener('offline', updateOnlineStatus);
});
</script>

<template>
  <q-layout view="hHh LpR fFf">
    <q-header fixed elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="/icons/favicon.svg" />
          </q-avatar>
          DoSomething
        </q-toolbar-title>
      </q-toolbar>

      <!-- Offline-Banner anzeigen -->
      <q-banner v-if="isOffline" class="bg-red text-white">
        ⚠️ Sie sind offline! Einige Funktionen sind möglicherweise nicht verfügbar.
      </q-banner>
    </q-header>

    <q-drawer fixed v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <q-item clickable v-ripple to="/">
          <q-item-section>Home</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/about">
          <q-item-section>About</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/create">
          <q-item-section>Task erstellen</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style>
.custom-header {
  background-color: #04163E;
  color: white;
}
* {
  font-family: 'Arial';
}
</style>
