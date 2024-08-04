<script setup lang="ts">
import {StepModel} from "@/models/stepModel";
import StepListComponent from "@/components/StepListComponent.vue";
import EffectBadgeComponent from "@/components/EffectBadgeComponent.vue";
import type {StepTreeNode} from "@/models/routeModel";
import {useGlobalStore} from "@/stores/globalStore";

const props = defineProps<{
  index: string;
  node: StepTreeNode;
}>();

const state = useGlobalStore();
</script>

<template>
  <div class="step">
    <div class="content" :class="{
      'first-child': state.currentRoute.steps[0].id == node.step.id,
      'last-child': state.currentRoute.steps[state.currentRoute.steps.length - 1].id == node.step.id
    }">
      <div class="tag current">
        <a href="#" class="link" v-if="props.node.step.depth <= 1">
          {{ props.index }}
        </a>
      </div>
      <div class="label">
        <div class="body">
          {{ props.node.step.description }}
        </div>
        <div class="footer">
          <EffectBadgeComponent
              v-for="effect in props.node.step.effects"
              :effect="effect"
          />
        </div>
      </div>
    </div>
    <StepListComponent
        v-if="props.node.children.length"
        :nodes="props.node.children"
        :indexPrefix="index"
        :class="{
          'sub-step': props.node.step.depth < 1,
          'deep-step': props.node.step.depth >= 1
        }"
    />
  </div>
</template>
<style scoped>
.sub-step {
  padding-left: 0.25rem;

  .content {
    .tag {
      width: 2.5rem;
    }

    &:before, &:after {
      left: calc((0.5rem + 2.5rem) / 2);
    }
  }
}

.deep-step {
  .content {
    .tag {
      margin-left: 0.35rem;
      width: 1.5rem;
    }
  }
}

.content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  //outline: solid deepskyblue 1px;

  .tag {
    z-index: 2;
    background-color: #242424;
    font-weight: bolder;
    color: white;
    width: 3rem;
    aspect-ratio: 1/1;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: #303030 solid 3px;

    .link {
      color: white;
      text-decoration: none;
    }

    &.current {
      outline-color: #09551a;
    }

    &.done {
      outline-color: #09551a;
      background-color: #0f932c;
    }
  }

  &:before, &:after {
    content: "";
    z-index: 1;
    position: absolute;
    left: calc((0.5rem + 3rem) / 2);
    border: #303030 solid 1px;
    height: 50%;
  }

  &:before {
    top: 0;
  }

  &:after {
    top: 50%;
  }

  &.first-child:before {
    display: none;
  }

  &.last-child:after {
    display: none;
  }

  .body, .label {
    width: 100%;
  }

  .footer {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    justify-content: flex-end
  }
}

</style>