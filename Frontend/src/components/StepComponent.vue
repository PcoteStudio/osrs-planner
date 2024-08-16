<script setup lang="ts">
import StepListComponent from '@/components/StepListComponent.vue';
import EffectBadgeComponent from '@/components/EffectBadgeComponent.vue';
import type { StepTreeNode } from '@/models/stepTreeNode';
import { useGlobalStore } from '@/stores/globalStore';
import { computed, onMounted, ref, watch } from 'vue';
import type { Effect } from '@/models/effect';
import SkillComponent from '@/components/SkillComponent.vue';
import { Skill } from '@/models/skill/skill';
import ContextMenu from 'primevue/contextmenu';

const props = withDefaults(defineProps<{
  node: StepTreeNode;
  editable: boolean;
}>(), {
  editable: false,
});

const store = useGlobalStore();

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
</script>

<template>
  <div class="step" v-if="step">
    <ContextMenu ref="menu" :model="items">
      <template #item="{ item, props }">
        <a v-ripple class="flex items-center" v-bind="props.action">
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </template>
    </ContextMenu>

    <div :id="isCurrentStep ? 'current': undefined" class="content" :class="{
      'first-child': isFirstChild,
      'last-child': isLastChild,
      'current': isCurrentStep,
      'completed': isCompleted
    }">
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
        <div v-if="!editable" class="header">
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
          </div>
        </div>
        <div class="body">
          <EditTextarea v-if="editable" v-model="step.description" />
          <span v-else>
            {{ step.description }}
          </span>
        </div>
        <div class="footer" :style="{ alignItems: editable ? 'flex-start' : 'flex-end' }">
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
      </div>
      <div class="flex flex-col gap-2 items-center" v-if="editable">
        <Button @click="toggleCompleted"
                :severity="isCompleted ? 'primary' : 'secondary'"
                rounded
                size="small"
                icon="pi pi-check"
        />
        <Button @click="openContextMenu($event)"
                @contextmenu="openContextMenu($event)"
                :severity="'secondary'"
                rounded outlined
                size="small"
                icon="pi pi-plus"
                :style="{ width: '2rem', height: '2rem'}"
        />
        <Button @click="remove"
                :severity="'secondary'"
                rounded outlined
                size="small"
                icon="pi pi-trash"
                class="remove-button"
                :style="{ width: '2rem', height: '2rem'}"
        />
      </div>
    </div>
    <hr>
    <div class="sub-step-list" v-if="hasChildren">
      <div class="toggle" @click="collapseSubStepList = !collapseSubStepList">
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
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    aspect-ratio: 1/1;

    .icon {
      background-color: #242424;
      outline: #303030 solid 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      aspect-ratio: 1 / 1;
      border-radius: 50%;

      .label {
        color: white;
        text-decoration: none;
        font-weight: bolder;
        text-align: center;
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

.sub-step {
  .content {
    background: linear-gradient(90deg, transparent 1.75rem, #1a1a1a 1.75rem);
    .tag > .icon {
      font-size: smaller;
      width: 90%;
    }
  }
}

.deep-step {
  .content{
    background: linear-gradient(90deg, transparent 1.75rem, #111111 1.75rem);
    .tag > .icon {
      width: 80%;
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