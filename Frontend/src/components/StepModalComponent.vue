<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore';
import { computed, ref } from 'vue';
import type { StepTreeNode } from '@/models/stepTreeNode';
import type { Effect } from '@/models/effect';
import type { TreeTableFilterMeta } from 'primevue/treetable';
import fuzzySort from 'fuzzysort';
import _ from 'lodash';
import EffectBadgeComponent from '@/components/EffectBadgeComponent.vue';

const state = useGlobalStore();

const filter = ref();

const nodeList = computed(() => {
  const test = state.currentRoute.rootNode.toFlatList();
  console.log(test);
  return test;
});

const fuzzySearchKeys = [
  'step.description',
  'step.label'
];

const filteredNodeList = computed(() => {
  return fuzzySort.go(filter.value, nodeList.value, { keys: fuzzySearchKeys, all: true });
});

const addEffect = (node: StepTreeNode) => {
  state.openEffectModal(node.step.id);
};

const removeEffect = (node: StepTreeNode, effect: Effect) => {
  state.removeEffect(node.step.id, effect);
};

const toggleCompleted = (node: StepTreeNode) => {
  state.toggleCompleted(node.step.id);
};

const postFilter = (event: TreeTableFilterMeta) => {
  console.log(event);
};
</script>

<template>
  <Dialog modal
          v-model:visible="state.stepState.showModal"
          header="Steps"
          :style="{ width: '50rem' }"
  >
    <template #container="{ closeCallback }">
      <div class="content">
        <DataTable :value="nodeList"
                   size="small"
                   class="flex flex-col overflow-hidden"
        >
          <template #header>
            <div class="flex justify-between">
              <span class="p-dialog-title">Steps</span>
              <IconField>
                <InputIcon class="pi pi-search" />
                <InputText v-model="filter" placeholder="Search" />
              </IconField>
              <Button @click="closeCallback"
                      icon="pi pi-times"
                      rounded
                      aria-label="Close"
                      severity="secondary"
                      class="p-dialog-header-actions"
              />
            </div>
          </template>
          <Column field="step.label" header="Step" :style="{ paddingRight: 0 }"></Column>
          <Column field="step.description" header="Description" :style="{ width: '40%' }"></Column>

          <Column field="step.effects" key="effects" header="Effects" :style="{ width: '40%' }">
            <template #body="{ data, field }">
              <div class="flex flex-wrap gap-1 items-center">
                <EffectBadgeComponent
                    v-for="(effect, index) in _.get(data, field)"
                    :key="index"
                    :effect="effect"
                    :removable="true"
                    :command="() => removeEffect(data, effect)"
                />
                <Button type="button" icon="pi pi-plus" rounded severity="primary" outlined
                        :style="{ height: '2em', width: '2em', fontSize: '0.9em'}" size="small"
                        @click="addEffect(data)"
                />
              </div>
            </template>
          </Column>

          <Column field="step.completed" :style="{ width: '10%' }">
            <template #body="{ data, field }">
              <Button rounded
                      size="small"
                      :severity=" _.get(data, field) ? 'primary' : 'secondary'"
                      icon="pi pi-check"
                      @click="toggleCompleted(data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
  .content {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
</style>