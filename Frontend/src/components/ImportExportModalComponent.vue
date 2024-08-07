<script setup lang="ts">

import { useGlobalStore } from '@/stores/globalStore';
import { ref, watch } from 'vue';
import { Route } from '@/models/route';
import { parseRouteJson } from '@/models/apiHelper/jsonApiHelper';
import { download, downloadAsFile } from '@/utils/webHelpers';

const state = useGlobalStore();

const importData = ref();
const exportData = ref();
const toggleImportSwitch = ref(false);
const exportMessage = ref({ type: 'info', content: '', visible: false });
const importMessage = ref({ type: 'info', content: '', visible: false });
const showExportMessage = (content: string, type?: tring) => {
  exportMessage.value.type = type ? type : 'info';
  exportMessage.value.content = content;
  exportMessage.value.visible = true;

  setTimeout(() => {
    exportMessage.value.visible = false;
  }, 3500);
};

watch(state.importExportState, () => {
  toggleImportSwitch.value = state.importExportState.type === 'import';
});

const showImportMessage = (content: string, type?: tring) => {
  importMessage.value.type = type ? type : 'info';
  importMessage.value.content = content;
  importMessage.value.visible = true;

  setTimeout(() => {
    importMessage.value.visible = false;
    state.importExportState.showModal = false;
  }, 5500);
};

const saveToFile = () => {
  if (exportData.value) {
    downloadAsFile(`osrs-planner-route-${new Date().toISOString()}`, 'json', exportData.value);
    showExportMessage(`Export has been saved to osrs-planner-route-${new Date().toISOString()}.json`);
  }
};

const copyToClipboard = () => {
  if (exportData.value) {
    navigator.clipboard.writeText(exportData.value);
    showExportMessage('Export has been saved to the clipboard');
  }
};

const generateExport = () => {
  exportData.value = JSON.stringify(state.currentRoute);
};

const importSave = () => {
  if (!importData.value) {
    showImportMessage('Please provide import data', 'error');
  }

  const result = parseRouteJson(importData.value);
  if(result.success) {
    state.currentRoute = Route.fromJSON(JSON.parse(importData.value));
    const firstNode = state.currentRoute.getFirstNode();
    state.currentRoute.setCurrentNode(firstNode);
    showImportMessage('New route imported', 'success');
  } else {
    showImportMessage(result.error.message, 'error');
  }
};
</script>

<template>
  <Dialog modal
          v-model:visible="state.importExportState.showModal"
          header="Import / Export a route"
          :style="{ width: '50rem' }"
  >
    <div class="content">
      <div class="toggle">
        <span :class="{active: !toggleImportSwitch}">Export</span>
        <ToggleSwitch v-model="toggleImportSwitch" size="large" />
        <span :class="{active: toggleImportSwitch}">Import</span>
      </div>
      <div v-if="toggleImportSwitch" class="import">
        <FloatLabel class="w-full">
          <Textarea v-model="importData" rows="5" class="w-full" />
          <label>JSON of an export</label>
        </FloatLabel>
        <Message v-if="importMessage.visible" :severity="importMessage.type" :life="5000">
          {{ importMessage.content }}
        </Message>
        <Button label="Import" icon="pi pi-file-import" :disabled="!importData" @click="importSave()" />
      </div>

      <div v-if="!toggleImportSwitch"  class="export">
        <Button label="Generate route export" @click="generateExport()"/>
        <FloatLabel v-if="exportData" class="w-full">
          <Textarea v-model="exportData" rows="5" class="w-full" />
          <label>Export result</label>
        </FloatLabel>
        <div class="flex gap-5">
          <Button v-if="exportData" outlined label="Save to file" icon="pi pi-save" class="w-60" @click="saveToFile()" />
          <Button v-if="exportData" outlined label="Copy to clipboard" icon="pi pi-copy" class="w-60" @click="copyToClipboard()" />
        </div>
        <Message v-if="exportMessage.visible" :severity="exportMessage.type" :life="3000">
          {{ exportMessage.content }}
        </Message>
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

      .active {
        color: #34d399;
      }

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