<script setup>
import { ref } from 'vue';

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
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

    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
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
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style>
.custom-header {
  background-color: #04163E; /* Deine gewünschte Farbe */
  color: white; /* Textfarbe */
}
* {
  font-family: 'Arial';
}
</style>
