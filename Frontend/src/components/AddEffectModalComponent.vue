<script setup lang="ts">
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';

import { useGlobalStore } from '@/stores/globalStore';
import { computed, ref } from 'vue';
import { getEffectTypes } from '@/models/effect';

const state = useGlobalStore();

const title = computed(() => {
  return 'Add effect';
});

const selectedEffectType = ref();
const effectTypes = ref(getEffectTypes());

</script>

<template>
  <Dialog modal
          v-model:visible="state.showEffectModal"
          :header="title"
          :style="{ width: '25rem' }"
  >
    <div class="card flex justify-center">
    <FloatLabel>
    <Select v-model="selectedEffectType"
            id="effectTypes"
            :options="effectTypes"
            optionLabel="name"
            placeholder="Select an effect type"
            class="w-full md:w-56"
    >
      <template #value="slotProps">
        <div v-if="slotProps.value" class="flex items-center">
          <img :alt="slotProps.value.name"
               :src="slotProps.value.icon"
               class="mr-2"
               style="width: 18px"
          />
          <div>{{ slotProps.value.name }}</div>
        </div>
        <span v-else>
            {{ slotProps.placeholder }}
        </span>
      </template>
      <template #option="slotProps">
        <div class="flex items-center">
          <img :alt="slotProps.option.name"
               :src="slotProps.option.icon"
               class="mr-2"
               style="width: 18px"
          />
          <div>{{ slotProps.option.name }}</div>
        </div>
      </template>
    </Select>
      <label for="effectTypes">effectTypes</label>
    </FloatLabel>

  </div>
    <div class="flex justify-center">
        <InputText id="username" v-model="value" />
    </div>


    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="visible = false" size="small"></Button>
      <Button type="button" label="Save" @click="visible = false" size="small"></Button>
    </div>
  </Dialog>
</template>

<style scoped>

</style>