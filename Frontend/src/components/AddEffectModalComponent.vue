<script setup lang="ts">
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Select from 'primevue/select';

import { useGlobalStore } from '@/stores/globalStore';
import { computed, ref, watch } from 'vue';
import { EffectTypeEnum, getEffectTypes } from '@/models/effect';
import SkillEffectModal from '@/components/SkillEffectModal.vue';

const state = useGlobalStore();

const selectedEffectType = ref();

const title = computed(() => {
  return `Add ${selectedEffectType.value.name} Effect`;
});

const effectTypes = computed(() => getEffectTypes());

watch(state.effectState, (effectState) => {
  selectedEffectType.value = effectTypes.value.find(e => e.type === effectState.type);
}, { immediate: true });

</script>

<template>
  <Dialog modal
          v-model:visible="state.effectState.showModal"
          :header="title"
          :style="{ width: '25rem' }"
  >
    <div class="content">
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
        <label for="effectTypes">Effect type</label>
      </FloatLabel>
      <SkillEffectModal v-if="selectedEffectType?.type === EffectTypeEnum.Skill" />
    </div>
  </Dialog>
</template>

<style scoped>
  .content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 1.5em;

    * {
      width: 100%;
    }
  }
</style>