<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore';
import { computed } from 'vue';
import { ItemStore } from '@/models/item/itemStore';

const store = useGlobalStore();

const data = computed(() => {
  return ItemStore.items;
});
</script>

<template>

</template>

<style scoped>

</style>