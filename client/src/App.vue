<script setup>
import { ref } from 'vue';

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>

<template>
  <!-- 
    Wichtig: Damit der Header und der Drawer “fixed” sind, 
    verwenden wir im view-String Großbuchstaben für die 
    entsprechenden Bereiche (H für Header, L für Left Drawer).
  -->
  <q-layout view="hHh LpR fFf">
    
    <!-- 
      Header als fixed markieren:
      Entweder mit der Prop fixed 
      oder über das Layout view="hHh".
    -->
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
    </q-header>

    <!-- Drawer ebenfalls fixieren -->
    <q-drawer fixed v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <q-item clickable v-ripple to="/">
          <q-item-section>
            Home
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/about">
          <q-item-section>
            About
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/create">
          <q-item-section>
            Task erstellen
          </q-item-section>
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
