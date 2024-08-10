<script setup lang="ts">

import { useGlobalStore } from '@/stores/globalStore';
import { ref, watch } from 'vue';
import { downloadAsFile } from '@/utils/webHelpers';
import { useToast } from 'primevue/usetoast';
import { parseRouteJson } from '@/models/apiHelper/jsonApiHelper';

const toast = useToast();
const store = useGlobalStore();

const importData = ref();
const importDataErrors = ref();
const exportData = ref();

const importMode = ref();
const importOptions = ref([
  { label: 'Export', value: 'export' },
  { label: 'Import', value: 'import' }
]);

watch(store.importExportState, (state) => {
  importMode.value = importOptions.value.find(o => o.value === state.type) || { label: 'Export', value: 'export' };
  importData.value = undefined;
  exportData.value = undefined;
}, { immediate: true });

const generateExport = () => {
  exportData.value = JSON.stringify(store.getCurrentRoute);
};

const saveToFile = () => {
  if (exportData.value) {
    downloadAsFile(`osrs-planner-route-${new Date().toISOString()}`, 'json', exportData.value);
    toast.add({
      severity: 'info',
      detail: `Export has been saved to osrs-planner-route-${new Date().toISOString()}.json`,
      life: 5000,
    });
  }
};

const copyToClipboard = () => {
  if (exportData.value) {
    navigator.clipboard.writeText(exportData.value);
    toast.add({
      severity: 'info',
      detail: 'Export has been saved to the clipboard',
      life: 5000,
    });
  }
};

const importSave = () => {
  if (!importData.value) {
    toast.add({
      severity: 'warn',
      detail: 'Please provide import data',
      life: 5000,
    });
  }

  store.importRoute(importData.value);
  store.closeImportExportModal();
};

watch(importData, (data) => validateImportData(data));

const validateImportData = (data: string) => {
  importDataErrors.value = undefined;

  if (!data)
    return;

  try {
    parseRouteJson(data);
  } catch (e) {
    importDataErrors.value = e;
  }
};

</script>

<template>
  <Dialog modal
          v-model:visible="store.getImportExportState.showModal"
          header="Import / Export a route"
          :style="{ width: '50rem' }"
  >
    <div class="content">
      <div class="toggle">
        <SelectButton v-model="importMode" optionLabel="label" dataKey="label" :options="importOptions" />
      </div>
      <div v-if="importMode.value === 'import'" class="import">
        <FloatLabel class="w-full">
          <Textarea v-model="importData" rows="5" class="w-full" />
          <label>JSON of an export</label>
        </FloatLabel>
        <Message v-if="importDataErrors" severity="warn">{{ importDataErrors }}</Message>
        <Button label="Import" icon="pi pi-file-import" :disabled="!importData || importDataErrors" @click="importSave()" />
      </div>

      <div v-if="importMode.value === 'export'"  class="export">
        <Button label="Generate route export" @click="generateExport()"/>
        <FloatLabel v-if="exportData" class="w-full">
          <Textarea v-model="exportData" rows="5" class="w-full" />
          <label>Export result</label>
        </FloatLabel>
        <div class="flex gap-5">
          <Button v-if="exportData" outlined label="Save to file" icon="pi pi-save" class="w-60" @click="saveToFile()" />
          <Button v-if="exportData" outlined label="Copy to clipboard" icon="pi pi-copy" class="w-60" @click="copyToClipboard()" />
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
  .content {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .toggle {
      display: flex;
      gap: 1rem;
      justify-content: center;
      align-items: center;

      span {
        font-size: 1.5em;
      }
    }

    .import, .export {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
    }
  }
</style>