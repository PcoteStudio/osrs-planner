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
      <div class="tag">
        <div class="icon">
          <a href="#" class="link" v-if="props.node.step.depth <= 1">
            {{ props.index }}
          </a>
        </div>
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
  .content {
    .tag > .icon {
      font-size: smaller;
       width: 75%;
     }
  }
}

.deep-step {
  .content{
    .tag > .icon {
      width: 50%;
    }
  }
}

.content {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0.5rem;
  //outline: solid deepskyblue 1px;

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

      .link {
        color: white;
        text-decoration: none;
        font-weight: bolder;
      }

      &.current {
        outline-color: #09551a;
      }

      &.done {
        outline-color: #09551a;
        background-color: #0f932c;
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

  &.first-child:before {
    display: none;
  }

  &.last-child:after {
    display: none;
  }

  .body, .label {
    outline: solid deepskyblue 1px;
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