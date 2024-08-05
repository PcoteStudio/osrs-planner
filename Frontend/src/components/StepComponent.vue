<script setup lang="ts">
import { Step } from '@/models/step';
import StepListComponent from '@/components/StepListComponent.vue';
import EffectBadgeComponent from '@/components/EffectBadgeComponent.vue';
import type { StepTreeNode } from '@/models/route';
import { useGlobalStore } from '@/stores/globalStore';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  index: string;
  node: StepTreeNode;
}>();

const state = useGlobalStore();

const collapseSubStepList = ref(false);
const showEffects = ref(false);

const isCurrentStep = computed(() => state.currentRoute.getCurrentStep() === props.node.step);
const isFirstChild = computed(() =>  state.currentRoute.getFirstStep() === props.node.step);
const isLastChild = computed(() =>  state.currentRoute.getLastStep() === props.node.step);
const isCompleted = computed(() => props.node.step?.completed);

const setCurrentNode = (node: StepTreeNode) => state.setCurrentNode(node);
const toggleCompleted = (node: StepTreeNode) => state.toggleCompleted(node);

watch(isCurrentStep, () => {
  showEffects.value = isCurrentStep.value;
});
if (isCurrentStep.value) {
  showEffects.value = true;
}

watch(isCompleted, () => {
  if (isCompleted.value)
    collapseSubStepList.value = true;
});

if (!props.node.step) {
  throw new Error(`The node does not have a step: ${props.node}`);
}
</script>

<template>
  <div class="step" v-if="node.step">
    <div class="content" :class="{
      'first-child': isFirstChild,
      'last-child': isLastChild,
      'current': isCurrentStep,
      'completed': isCompleted
    }">
      <div class="tag" @click="setCurrentNode(node)">
        <div class="icon">
          <span class="label" v-if="node.depth <= 1">
            {{ index }}
          </span>
        </div>
      </div>
      <div class="label">
        <div class="header">
          <div class="actions">
            <n-button secondary round
                @click="showEffects = !showEffects"
                :type="showEffects ? 'primary' : 'default'"
            >
              Effects
            </n-button>
            <n-button secondary circle
                @click="toggleCompleted(node)"
                :type="isCompleted ? 'success' : 'default'"
            >
              <font-awesome-icon icon="check" />
            </n-button>
          </div>
        </div>
        <div class="body">
          {{ node.step.description }}
        </div>
        <div class="footer">
          <div class="effects"
               :style="{ display: showEffects ? 'flex' : 'none' }"
          >
            <EffectBadgeComponent
              v-for="(effect, index) in node.step.effects"
              :key="index"
              :effect="effect"
            />
          </div>
        </div>
        <hr/>
      </div>
    </div>
    <div class="sub-step-list" v-if="node.children.length">
      <div class="toggle" @click="collapseSubStepList = !collapseSubStepList">
        <font-awesome-icon :icon="collapseSubStepList ? 'chevron-down' : 'chevron-up'" />
      </div>
      <StepListComponent
          :nodes="node.children"
          :indexPrefix="index"
          :class="{
            'sub-step': node.depth < 1,
            'deep-step': node.depth >= 1
          }"
          :style="{
            opacity: collapseSubStepList ? '0' : '100',
            height: collapseSubStepList ? '0' : 'auto',
          }"
      />
    </div>
  </div>
</template>
<style scoped>
.content {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0.5rem;

  .body, .label {
    width: 100%;
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
        align-items: flex-end;
        gap: 0.3rem;
      }
    }

    hr {
      margin: 0.5rem -0.5rem -0.5rem -1.75rem;
      background-color: #303030;
      height: 2px;
      border: 0;
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
    z-index: 1;
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
    background-color: #1a1a1a;
    .tag > .icon {
      font-size: smaller;
      width: 75%;
    }
  }
}

.deep-step {
  .content{
    background-color: #111;
    .tag > .icon {
      width: 50%;
    }
  }
}

.sub-step-list {
  position: relative;

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