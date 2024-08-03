<script setup lang="ts">
import Inventory from '@/components/EquipmentComponent.vue';
</script>

<template>
  <main>
    <Inventory />
  </main>
</template>

<style scoped>
main {
  display: flex;
  gap: 0.5rem;
  background: black;
  width: 100%;
  height: 100%;
  * {
    border: darkred solid 1px;
  }
}
</style>
