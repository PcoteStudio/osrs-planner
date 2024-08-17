<script setup lang="ts">
import StepListComponent from '@/components/StepListComponent.vue';
import EffectBadgeComponent from '@/components/EffectBadgeComponent.vue';
import type { StepTreeNode } from '@/models/stepTreeNode';
import { useGlobalStore } from '@/stores/globalStore';
import { computed, onMounted, ref, watch } from 'vue';
import type { Effect } from '@/models/effect';
import ContextMenu from 'primevue/contextmenu';
import { useDragStore } from '@/stores/dragStore';
import EditTextarea from '@/components/EditTextarea.vue';

const props = withDefaults(defineProps<{
  node: StepTreeNode;
  editable: boolean;
}>(), {
  editable: false,
});

const store = useGlobalStore();
const dragStore = useDragStore();

const collapseSubStepList = ref(false);
const showEffects = ref(false);
const menu = ref();

const items = ref([
  {
    label: 'Step',
    icon: 'pi pi-plus',
    command: () => store.addStep(step.value.id)
  },
  {
    label: 'Sub-Step',
    icon: 'pi pi-plus-circle',
    command: () => store.addSubStep(step.value.id)
  }
]);

const step = computed(() => props.node.step);
const isCurrentStep = computed(() => store.currentRoute.getCurrentStep() === step.value);
const isFirstChild = computed(() =>  store.currentRoute.getFirstStep() === step.value);
const isLastChild = computed(() =>  store.currentRoute.getLastStep() === step.value);
const isCompleted = computed(() => step.value.completed);
const hasChildren = computed(() => props.node.children.length > 0);

watch(isCurrentStep, () => {
  showEffects.value = isCurrentStep.value;
});

watch(isCompleted, () => {
  if (isCompleted.value)
    collapseSubStepList.value = true;
});

onMounted(() => {
  if (isCurrentStep.value) {
    showEffects.value = true;
  }
});

const setCurrentNode = () => store.setCurrentNode(step.value.id);
const toggleCompleted = () => store.toggleCompleted(step.value.id);
const addEffect = () => store.openEffectModal(step.value.id);
const removeEffect = (effect: Effect) => store.removeEffect(step.value.id, effect);
const openContextMenu = (event : MouseEvent) => menu.value.show(event);
const remove = () => store.removeStep(step.value.id);

const content = ref();

watch(dragStore, () => {
  if (!canDragIn.value)
    return;

  if (dragStore.isDragging) {
    content.value.classList.add('no-drag');
  }
  else {
    content.value.classList.remove('no-drag');
  }
});

const canDragIn = computed(() => dragStore.isDragging && store.canMoveAfterNode(dragStore.dragFrom, step.value.id));

const dragStart = (event: DragEvent) => {
  console.log('Start');
  dragStore.dragFrom = step.value.id;
  dragStore.isDragging = true;

  event.dataTransfer?.setDragImage(content.value, 10, 10);
};

const dragend = (event: DragEvent) => {
  console.log('Stop');

  if (dragStore.isDragging && dragStore.dragFrom && dragStore.dragTarget &&
      store.canMoveAfterNode(dragStore.dragFrom, dragStore.dragTarget)
  ) {
    store.moveNode(dragStore.dragFrom, dragStore.dragTarget);
  }

  dragStore.isDragging = false;
};

const dragenter = (event: DragEvent) => {
  if (!(event.target instanceof HTMLElement) || !canDragIn.value)
    return;

  dragStore.dragTarget = step.value.id;
  event.target.classList.add('dragover');
};

const dragleave = (event: DragEvent) => {
  if (!(event.target instanceof HTMLElement) || !canDragIn.value)
    return;

  event.target.classList.remove('dragover');
};
</script>

<template>
  <div :id="step.id"
       class="step"
       v-if="step"
       @dragend="dragend"
  >
    <ContextMenu ref="menu" :model="items">
      <template #item="{ item, props }">
        <a v-ripple class="flex items-center" v-bind="props.action">
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </template>
    </ContextMenu>

    <div :id="isCurrentStep ? 'current': undefined"
         class="content"
         :class="{
           'first-child': isFirstChild,
           'last-child': isLastChild,
           'current': isCurrentStep,
           'completed': isCompleted
         }"
         @dragleave="dragleave"
         @dragenter="dragenter"
         ref="content"
    >
      <div class="tag"
           @click="setCurrentNode"
           v-tooltip="step.label"
      >
        <div class="icon">
          <span class="label">
            {{ step.label }}
          </span>
        </div>
      </div>
      <div class="label">
        <div v-if="!canDragIn" class="header">
          <div class="actions">
            <Button @click="showEffects = !showEffects"
                    size="small"
                    :severity="showEffects ? 'primary' : 'secondary'"
                    :label="'Effects'"
            />
            <Button @click="toggleCompleted"
                    :severity="isCompleted ? 'primary' : 'secondary'"
                    rounded
                    size="small"
                    icon="pi pi-check"
            />
            <Button @click="openContextMenu($event)"
                    @contextmenu="openContextMenu($event)"
                    v-if="editable"
                    :severity="'secondary'"
                    rounded outlined
                    size="small"
                    icon="pi pi-plus"
            />
            <Button @click="remove"
                    v-if="editable"
                    :severity="'secondary'"
                    rounded outlined
                    size="small"
                    icon="pi pi-trash"
                    class="remove-button"
            />
            <Button @dragstart="dragStart"
                    draggable="true"
                    v-if="editable"
                    :severity="'secondary'"
                    rounded outlined
                    size="small"
                    icon="pi pi-arrows-alt"
            />
          </div>
        </div>
        <div class="body">
          <EditTextarea v-if="editable" v-model="step.description" />
          <span v-else>
            {{ step.description }}
          </span>
        </div>
        <div v-if="!dragStore.isDragging" class="footer" :style="{ alignItems: editable ? 'flex-start' : 'flex-end' }">
          <div class="effects" :style="{ display: (showEffects || editable) ? 'flex' : 'none' }">
            <EffectBadgeComponent
              v-for="effect in step.effects"
              :key="effect"
              :effect="effect"
              :removable="editable"
              :command="() => removeEffect(effect)"
            />
            <Button v-if="editable" type="button" icon="pi pi-plus" rounded severity="primary" outlined
                    :style="{ height: '2em', width: '2em', fontSize: '0.9em' }" size="small"
                    @click="addEffect"
            />
          </div>
        </div>
        <div v-if="canDragIn" class="dropzone"></div>
      </div>
    </div>
    <hr>
    <div class="sub-step-list" v-if="hasChildren">
      <div v-if="!canDragIn" class="toggle" @click="collapseSubStepList = !collapseSubStepList">
        <font-awesome-icon :icon="collapseSubStepList ? 'chevron-down' : 'chevron-up'" />
      </div>
      <StepListComponent
          :nodes="node.children"
          :editable="editable"
          :class="{
            'sub-step': node.depth < 1,
            'deep-step': node.depth >= 1,
            'hidden': collapseSubStepList
          }"
      />
    </div>
  </div>
</template>
<style scoped>
.no-drag {
  * {
    pointer-events: none;
  }
}

hr {
  margin-left: 1.75rem;
  background-color: #303030;
  height: 2px;
  border: 0;
}

.content {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem;

  .dropzone {
    width: 90%;
    height: 2rem;
    border: rgba(0, 191, 255, 0.3) 3px dashed;
  }

  &.dragover {
    .dropzone {
      border-color: deepskyblue;
    }
  }

  .body, .label {
    width: 100%;
  }

  .remove-button:hover {
    color: #ff0000;
    border-color: #a10000;
    background-color: rgba(161, 0, 0, 0.2);
  }

  .label {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-left: 2rem;

    .header {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      justify-content: flex-end;

      .actions {
        display: flex;
        gap: 0.3rem;
        justify-content: flex-end;
      }
    }

    .footer {
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      .effects {
        flex-wrap: wrap;
        align-items: center;
        gap: 0.3rem;
      }
    }

  }

  .tag {
    position: absolute;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.5rem;

    .icon {
      background-color: #242424;
      outline: #303030 solid 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 2rem;
      min-width: 2.5rem;

      .label {
        color: white;
        text-decoration: none;
        font-weight: bolder;
        text-align: center;
        padding: 0.5em;
        margin-left: 0;
      }

      &:hover {
        cursor: pointer;
        background-color: var(--vt-c-indigo);
        outline-color: var(--vt-c-text-dark-2);
      }
    }
  }

  &:before, &:after {
    content: "";
    position: absolute;
    left: calc((0.5rem + 3rem) / 2);
    border: #303030 solid 1px;
  }

  &:before {
    top: 0;
    height: 10%;
  }

  &:after {
    top: 10%;
    height: 90%;
  }

  &.first-child:before, &.last-child:after{
    display: none;
  }

  &.current {
    & > .tag > .icon {
      outline-color: deepskyblue !important;
    }
  }

  &.completed {
    & > .tag > .icon {
      outline-color: #09551a;
      background-color: #0f932c;
    }
  }
}

.sub-step .content {
  background: linear-gradient(90deg, transparent 1.75rem, #1a1a1a 1.75rem);
}

.deep-step .content {
  background: linear-gradient(90deg, transparent 1.75rem, #111111 1.75rem);
}

.sub-step-list {
  position: relative;

  .hidden {
    grid-template-rows: 0fr;
    opacity: 0;
  }

  .toggle {
    background-color: #303030;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
    height: 2rem;
    margin-left: calc(2rem - 4px);

    &:hover {
      background-color: #565656;
      cursor: pointer;
      font-size: larger;

      &:before {
        content: "";
        z-index: 2;
        position: absolute;
        top: 0;
        left: 1.5rem;
        width: calc(100% - 1.5rem);
        height: calc(100%);
        outline: #565656 10px solid;
        outline-offset: -10px;
        pointer-events: none;
      }
    }
  }
}
</style>