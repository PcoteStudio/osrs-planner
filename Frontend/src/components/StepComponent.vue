<script setup lang="ts">
import StepListComponent from '@/components/StepListComponent.vue';
import EffectBadgeComponent from '@/components/EffectBadgeComponent.vue';
import type { StepTreeNode } from '@/models/stepTreeNode';
import { useGlobalStore } from '@/stores/globalStore';
import { computed, onMounted, ref, watch } from 'vue';
import { type Effect, EffectTypeEnum } from '@/models/effect';
import ContextMenu from 'primevue/contextmenu';
import { useDragStore } from '@/stores/dragStore';
import EditTextarea from '@/components/EditTextarea.vue';
import { ShowEffectTypes } from '@/types/showEffectTypes';
import type { EffectType } from '@/types/itemEffectTypes';

const props = withDefaults(defineProps<{
  node: StepTreeNode;
  editable: boolean;
}>(), {
  editable: false,
});

const store = useGlobalStore();
const dragStore = useDragStore();

const collapseSubStepList = ref(false);
const menu = ref();
const editDescription = ref(false);

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

const showEffects = computed(() => {
  if (store.getEffectState.showEffects === ShowEffectTypes.showAll)
    return true;

  return isCurrentStep.value && store.getEffectState.showEffects === ShowEffectTypes.showCurrent;
});

const step = computed(() => props.node.step);
const isCurrentStep = computed(() => store.currentRoute.getCurrentStep() === step.value);
const isFirstChild = computed(() =>  store.currentRoute.getFirstStep() === step.value);
const isLastChild = computed(() =>  store.currentRoute.getLastStep() === step.value);
const isCompleted = computed(() => step.value.completed);
const hasChildren = computed(() => props.node.children.length > 0);
const childStepLabel = computed(() => `${step.value.label ?? ''}.1`);
const nextStepLabel = computed(() => { 
  const label = step.value.label;
  return label ? label.substring(0, label.length - 1) + (Number(label[label.length - 1]) + 1).toString() : 'X';
});

watch(isCompleted, () => {
  if (isCompleted.value)
    collapseSubStepList.value = true;
});

const setCurrentNode = () => store.setCurrentNode(step.value.id);
const addEffect = () => store.openEffectModal();
const editEffect = (stepId: string, effect: Effect) => {
  store.openEffectModal({
    category: effect.type,
    data: {
      stepId: stepId,
      effect: effect
    }
  });
};
const removeEffect = (effect: Effect) => {
  store.removeEffect({
    category: effect.type,
    data: {
      stepId: step.value.id
    }
  }, effect);
};
const openContextMenu = (event : MouseEvent) => menu.value.show(event);
const remove = () => store.removeStep(step.value.id);

const content = ref();

onMounted(() => {
  const count = (step.value.label.split('.').length - 1);
  const color = `hsl(0, 0%, ${10 - count * 3}%)`;
  content.value.style.background = `linear-gradient(90deg, transparent 1.75rem, ${color} 1.75rem)`;
});

watch(dragStore, () => {
  if (dragStore.isDragging) {
    content.value.classList.add('no-drag');
  }
  else {
    content.value.classList.remove('no-drag');
  }
});

const canDragIn = computed(() => dragStore.isDragging && store.canMoveAfterNode(dragStore.dragFrom, step.value.id, dragStore.targetLocation === 'child'));
const dragOver = ref(false);

const dragStart = (event: DragEvent) => {
  event.dataTransfer?.setDragImage(content.value, 10, 10);

  setTimeout(() => {
    dragStore.dragFrom = step.value.id;
    dragStore.isDragging = true;

    console.log(content.value);
  }, 0);
};

const dragEnd = (event: DragEvent) => {
  const child = dragStore.targetLocation === 'child';

  if (dragStore.isDragging && dragStore.dragFrom && dragStore.dragTarget &&
      store.canMoveAfterNode(dragStore.dragFrom, dragStore.dragTarget, child)
  ) {
    store.moveNode(dragStore.dragFrom, dragStore.dragTarget, child);

    dragStore.targetLocation = undefined;
    dragStore.dragTarget = undefined;
    dragOver.value = false;
  }

  dragStore.isDragging = false;
};

const count = ref(0);
const dragEnter = (event: DragEvent, child?: boolean) => {
  if (!(event.target instanceof HTMLElement) || !canDragIn.value)
    return;

  count.value++;

  if (child !== undefined) {
    dragStore.dragTarget = step.value.id;
    if (child) {
      dragStore.targetLocation = 'child';
    }
    else {
      dragStore.targetLocation = 'after';
    }
  }
  else {
    dragOver.value = true;
  }
};

const dragLeave = (event: DragEvent, child?: boolean) => {
  if (!(event.target instanceof HTMLElement) || !canDragIn.value)
    return;

  count.value--;

  if (count.value === 0){
    dragStore.targetLocation = undefined;
    dragStore.dragTarget = undefined;
    dragOver.value = false;
  }
};
</script>

<template>
  <div :id="step.id"
       class="step"
       v-if="step"
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
         @dragleave="dragLeave"
         @dragenter="dragEnter"
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
        <div class="body">
          <EditTextarea
              v-if="editDescription"
              v-model="step.description"
              @close="editDescription = false"
          />
          <div v-else>
            <div class="label-padding">
              {{ step.label }}
            </div>
            <div class="actions">
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
                      @dragend="dragEnd"
                      draggable="true"
                      v-if="editable"
                      :severity="'secondary'"
                      rounded outlined
                      size="small"
                      icon="pi pi-arrows-alt"
              />
            </div>
            {{ step.description }}
            <font-awesome-icon
                v-if="editable"
                @click="editDescription = true"
                icon="pen-to-square"
                class="cursor-pointer hover:text-white ml-1"
            />
          </div>
        </div>
        <div v-if="!dragStore.isDragging" class="footer" :style="{ alignItems: editable ? 'flex-start' : 'flex-end' }">
          <div class="effects" :style="{ display: showEffects ? 'flex' : 'none' }">
            <EffectBadgeComponent
              v-for="(effect, index) in step.effects"
              :key="index"
              :effect="effect"
              :remove="() => removeEffect(effect)"
              :edit="() => editEffect(step.id, effect)"
            />
            <Button v-if="editable" type="button" icon="pi pi-plus" rounded severity="primary" outlined
                    :style="{ height: '2em', width: '2em', fontSize: '0.9em' }" size="small"
                    @click="addEffect"
            />
          </div>
        </div>
        <div v-if="dragOver" class="dropzone">
          <div class="zone"
               :class="{ active: dragStore.targetLocation === 'after' }"
               @dragover="(event) => event.preventDefault()"
               @drop="dragEnd"
               @dragenter="(e) => dragEnter(e, false)"
               @dragleave="(e) => dragLeave(e, false)"
          >
            <span>{{ nextStepLabel }}</span>
          </div>
          <div class="zone"
               :class="{ active: dragStore.targetLocation === 'child' }"
               @dragover="(event) => event.preventDefault()"
               @drop="dragEnd"
               @dragenter="(e) => dragEnter(e, true)"
               @dragleave="(e) => dragLeave(e, false)"
          >
            <span>{{ childStepLabel }}</span>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div class="sub-step-list" v-if="hasChildren">
      <div v-if="!canDragIn" class="toggle" @click="collapseSubStepList = !collapseSubStepList">
        <span class="sub-step-count">{{ store.getChildrenCount(step.id) }} sub steps</span>
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
    display: flex;
    gap: 1rem;
    align-items: center;

    .zone {
      pointer-events: initial;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      border: rgba(0, 191, 255, 0.3) 3px dashed;

      &.active {
        border-color: deepskyblue;
        color: white;
        font-weight: bold;
      }
    }
  }

  .body, .label {
    width: 100%;
  }

  .body {
    padding-top: 0.5em;
    min-height: 2.2em;
    .label-padding {
      min-width: 1.2em;
      height: 1.8em;
      float: left;
      color: transparent;
      user-select: none
    }

    .actions {
      float: right;
      display: flex;
      gap: 0.3rem;
      justify-content: flex-end;
    }
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

    .sub-step-count {
      position: absolute;
      right: 1em;
      top: 0.1em;
    }

    &:hover {
      background-color: #565656;
      cursor: pointer;
      font-size: larger;

      .sub-step-count {
        font-size: initial;
      }

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