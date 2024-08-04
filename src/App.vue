<script setup>
import Toast from './components/Toast.vue'
import DisconnectedLayer from './components/DisconnectedLayer.vue'
</script>

<template>
  <div>
    <DisconnectedLayer />
    <Toast />
    <RouterView></RouterView>
  </div>
</template>
