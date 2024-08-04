<script setup lang="ts">
import {StepModel} from "@/models/stepModel";
import StepListComponent from "@/components/StepListComponent.vue";
import EffectBadgeComponent from "@/components/EffectBadgeComponent.vue";
import type {StepTreeNode} from "@/models/routeModel";
import {useGlobalStore} from "@/stores/globalStore";
import {ref} from "vue";

const props = defineProps<{
  index: string;
  node: StepTreeNode;
}>();

const state = useGlobalStore();
const collapseSubStepList = ref(false);

const setCurrentStep = (step: StepModel) => {
  state.setCurrentStep(step);
}

const setCompleted = (step: StepModel) => {
  state.completeStep(step);
}

</script>

<template>
  <div class="step">
    <div class="content" :class="{
      'first-child': state.currentRoute.steps[0].id === node.step.id,
      'last-child': state.currentRoute.steps[state.currentRoute.steps.length - 1].id === node.step.id,
      'current': state.currentStep === node.step,
      'completed': node.step.completed
    }">
      <div class="tag" @click="setCurrentStep(props.node.step)">
        <div class="icon">
          <span class="label" v-if="props.node.step.depth <= 1">
            {{ props.index }}
          </span>
        </div>
      </div>
      <div class="label">
        <div class="body">
          {{ props.node.step.description }}
          <br>
          <n-button @click="setCompleted(node.step)">
            Mark as Completed
          </n-button>
        </div>
        <div class="footer">
          <EffectBadgeComponent
              v-for="effect in props.node.step.effects"
              :effect="effect"
          />
        </div>
      </div>
    </div>
    <div class="sub-step-list" v-if="props.node.children.length">
      <StepListComponent
          :nodes="props.node.children"
          :indexPrefix="index"
          :class="{
            'sub-step': props.node.step.depth < 1,
            'deep-step': props.node.step.depth >= 1
          }"
          :style="{
            opacity: collapseSubStepList ? '0' : '100',
            height: collapseSubStepList ? '0' : 'auto',
          }"
      />
      <div class="toggle" @click="collapseSubStepList = !collapseSubStepList">
        <font-awesome-icon :icon="collapseSubStepList ? 'chevron-down' : 'chevron-up'" />
      </div>
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

  .footer {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    justify-content: flex-end
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
      outline-color: #09551a !important;
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
        z-index: 1;
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