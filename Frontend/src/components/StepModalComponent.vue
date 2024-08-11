<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore';
import { computed, ref } from 'vue';
import type { StepTreeNode } from '@/models/stepTreeNode';
import type { Effect } from '@/models/effect';
import fuzzySort from 'fuzzysort';
import _ from 'lodash';
import EffectBadgeComponent from '@/components/EffectBadgeComponent.vue';
import { FilterMatchMode } from '@primevue/core/api';

const store = useGlobalStore();

const nodeList = computed(() => store.getNodeList);

const addEffect = (node: StepTreeNode) => {
  store.openEffectModal(node.step.id);
};

const removeEffect = (node: StepTreeNode, effect: Effect) => {
  store.removeEffect(node.step.id, effect);
};

const toggleCompleted = (node: StepTreeNode) => {
  store.toggleCompleted(node.step.id);
};

const fuzzySearchKeys = [
  'step.description',
  'step.label',
  'step.effects',
];
const filter = ref();

const targets = computed(() => {
  return nodeList.value.map(n => {
    return {
      step: {
        id: n.step.id,
        completed: n.step.completed,
        description: n.step.description,
        label: n.step.label,
        effects: n.step.effects.map(e => e.toString()).join('')
      }
    };
  });
});

const filteredNodeList = computed(() =>
    fuzzySort.go(
        filter.value,
        targets.value,
        { keys: fuzzySearchKeys, all: true }
    ));

const datatableFilters = computed(() => {
  return {
    global: {
      value: filteredNodeList.value.map(r => r.obj.step.id),
      matchMode: FilterMatchMode.IN
    }
  };
});

const highlight = (key: string, id: string) => {
  const results = filteredNodeList.value.find(r => r.obj.step.id === id);
  if (!results)
    return;

  const elements = results[fuzzySearchKeys.indexOf(key)]
      .highlight((m: string, i: number) =>
        `<span class="highlight-match" key=${i}>${m}</span>`);

  if (elements && elements.length > 0) {
    return elements.join('');
  }

  return _.get(results.obj, key);
};
</script>

<template>
  <Dialog modal
          v-model:visible="store.getStepModalState.showModal"
          header="Steps"
          :style="{ width: '50rem' }"
  >
    <template #container="{ closeCallback }">

      <div class="content">
        <DataTable :value="nodeList"
                   size="small"
                   class="flex flex-col overflow-hidden"
                   editMode="cell"
                   :filters="datatableFilters"
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
          <Column field="step.id" hidden></Column>
          <Column field="step.label" header="Step" :style="{ paddingRight: 0 }">
            <template #body="{ data, field }">
              <span v-html="highlight(field, data.step.id)" />
            </template>
          </Column>
          <Column field="step.description" header="Description" :style="{ width: '40%' }">
            <template #editor="{ data }">
              <Textarea class="editor" rows="1"  autoResize v-model:="data.step.description" />
            </template>
            <template #body="{ data, field }">
              <span v-html="highlight(field, data.step.id)" />
            </template>
          </Column>

          <Column field="step.effects" header="Effects" :style="{ width: '40%' }">
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

          <Column field="obj.step.completed" :style="{ width: '10%' }">
            <template #body="{ data, field }">
              <Button rounded
                      size="small"
                      :severity=" _.get(data, field) ? 'primary' : 'secondary'"
                      icon="pi pi-check"
                      @click="toggleCompleted(data.obj)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.editor {
  width: 100%;
  height: 10em;
}
  .content {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
</style>