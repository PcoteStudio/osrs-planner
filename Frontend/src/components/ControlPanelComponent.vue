<script setup lang="ts">

import { useGlobalStore } from '@/stores/globalStore';
import { computed } from 'vue';

const store = useGlobalStore();

const currentStep = computed(() => store.getCurrentRoute.getCurrentStep());

const buttons = [
  {
    label: 'Current Step',
    options: [
      {
        label: 'Complete step',
        type: 'primary',
        icon: 'pi pi-check',
        disabled: !currentStep.value,
        action: () => {
          if (currentStep.value)
            store.toggleCompleted(currentStep.value.id);
          },
      },
      {
        label: 'Edit step',
        type: 'secondary',
        icon: 'pi pi-pen-to-square',
        action: () => store.openStepModal(),
      },
      {
        label: 'Add step',
        type: 'danger',
        icon: 'pi pi-plus',
        disabled: true,
        outlined: true,
      },
      {
        label: 'Remove step',
        type: 'danger',
        icon: 'pi pi-trash',
        disabled: true,
        outlined: true,
      },
    ]
  },
  {
    label: 'Effects',
    options: [
      {
        label: 'Add effect',
        type: 'secondary',
        icon: 'pi pi-plus',
        action: () => store.openEffectModal()
      },
      {
        label: 'Remove effect',
        type: 'danger',
        icon: 'pi pi-trash',
        disabled: true,
        outlined: true,
      },
    ],
  },
  {
    label: 'Inventory',
    options: [
      {
        label: 'Add inventory',
        type: 'danger',
        icon: 'pi pi-plus',
        disabled: true,
        outlined: true,
      },
      {
        label: 'Reset inventory',
        type: 'danger',
        icon: 'pi pi-refresh',
        disabled: true,
        outlined: true,
      },
      {
        label: 'Clear inventory',
        type: 'danger',
        icon: 'pi pi-trash',
        disabled: true,
        outlined: true,
      },
    ],
  },
  {
    label: 'Equipment',
    options: [
      {
        label: 'Add equipment',
        type: 'danger',
        icon: 'pi pi-plus',
        disabled: true,
        outlined: true,
      },
      {
        label: 'Reset equipment',
        type: 'danger',
        icon: 'pi pi-refresh',
        disabled: true,
        outlined: true,
      },
      {
        label: 'Clear equipment',
        type: 'danger',
        icon: 'pi pi-trash',
        disabled: true,
        outlined: true,
      },
    ]
  },
  {
    label: 'Route',
    options: [
      {
        label: 'Import current route',
        type: 'secondary',
        icon: 'pi pi-file-import',
        action: () => store.openImportExportModal('Import'),
      },
      {
        label: 'Export current route',
        type: 'secondary',
        icon: 'pi pi-save',
        action: () => store.openImportExportModal('Export')
      }
    ]
  }
];

</script>

<template>
  <div class="control-panel">
    <div v-for="(buttonGroup, index) in buttons" :key="index" class="group">
      <label class="text-lg">{{ buttonGroup.label }}</label>
      <div class="options">
        <Button v-for="(option, index) in buttonGroup.options"
                :key="index"
                v-tooltip.top="option.label"
                :aria-label="option.label"
                :severity="option.type"
                :icon="option.icon"
                :outlined="option.outlined"
                :disabled="option.disabled"
                @click="option.action"
                rounded
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.control-panel {
  background-color: #222222;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  width: 100%;

  .group {
    background-color: #111111;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    border-radius: 0.5rem;
    padding: 0.5rem;

    .options {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
}
</style>