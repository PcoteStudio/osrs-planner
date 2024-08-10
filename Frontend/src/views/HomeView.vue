<script setup lang="ts">
import EquipmentComponent from '@/components/EquipmentComponent.vue';
import StepList from '@/components/StepListComponent.vue';
import { useGlobalStore } from '@/stores/globalStore';
import DebugComponent from '@/components/DebugComponent.vue';
import InventoryComponent from '@/components/SkillTabComponent.vue';
import { ref, watch } from 'vue';
import AddEffectModalComponent from '@/components/AddEffectModalComponent.vue';
import TabComponent from '@/components/TabComponent.vue';
import ControlPanelComponent from '@/components/ControlPanelComponent.vue';
import ImportExportModalComponent from '@/components/ImportExportModalComponent.vue';
import StepModalComponent from '@/components/StepModalComponent.vue';
import { useToast } from 'primevue/usetoast';
import { Effect } from '@/models/effect';
import { InvalidRouteJsonError } from '@/errors/invalid-route-json-error';

const toast = useToast();
const state = useGlobalStore();

state.currentRoute.initializeSomeSteps();

const rootNode = ref(state.currentRoute.rootNode.children);

//TODO: Current step is set to the 1st step for testing
if (state.currentRoute.currentNode.step.id)
state.setCurrentNode(state.currentRoute.currentNode.step.id);

type Notifications = {
  name: 'addEffect',
  effect: Effect;
  stepLabel: string;
} | {
  name: 'removeEffect',
  args:  [nodeId: string, effect: Effect]
} | {
  name: 'toggleCompleted',
  args:  [nodeId: string]
}

watch(
    () => state.notifications,
    (notifications) => {
      let message = '';
      for (const notification of notifications) {
        switch (notification.action) {
          case 'toggleCompleted':
            message = `Step ${notification.data.stepLabel}: ${notification.data.completed ? 'Completed' : 'Incomplete'}`;
            break;
          case 'addEffect':
            message = `New effect added: "${notification.data.effect.toString()}" to step ${notification.data.stepLabel}`;
            break;
          case 'removeEffect':
            message = `Effect removed: "${notification.data.effect.toString()}" from step ${notification.data.stepLabel}`;
        }
        toast.add({
          severity: 'info',
          detail: message,
          life: 5000
        });
      }
      state.clearNotifications();
    },
    { deep: true }
);
state.$onAction(
    ({
       name, // name of the action
       args, // array of parameters passed to the action
       after, // hook after the action returns or resolves
       onError, // hook if the action throws or rejects
     }) => {

      onError((error) => {
        console.error(error);

        let logLevel: 'Error' | 'Warning' = 'Error';
        let message: string;
        if (error instanceof InvalidRouteJsonError) {
          message = `The json of the route was invalid: ${error.innerError.message}`;
          logLevel = 'Warning';
          console.error(error.innerError);
        } else {
          message = 'An error occured';
        }

        toast.add({
          severity: 'error',
          detail: message
        });
      });
    }
);

/*
state.$onAction(
    ({
       name, // name of the action
       args, // array of parameters passed to the action
       after, // hook after the action returns or resolves
       onError, // hook if the action throws or rejects
     }) => {

      onError((error) => {
        const details = getDetails({ name, args }, null, error);
        if (details.error) {
          toast.add({
            severity: 'error',
            detail: details.error
          });
        }
        console.log(error);
      });
    }
);
const getSuccessDetails = (
    action: AllActions,
    success: Effect  | undefined,
    error: any
): string => {
  switch (action.name) {
    case 'addEffect': {
      const [nodeId, effect] = action.args;
      return `New effect added: "${effect}" to step ${nodeId}`;
    }
    case 'removeEffect': {
      const [nodeId, effect] = action.args;
      return `Effect removed: "${effect.toString()}" from step ${nodeId}`;
    }
    case 'toggleCompleted': {
      const [nodeId] = action.args;
      return `Step ${args[0].step.toString()}: ${args[0].step.completed ? 'Completed' : 'Incomplete'}`;
    }
  }
};

const getErrorDetails = (
    action: AllActions,
    success: Effect  | undefined,
    error: any
): {error: string} => {
  switch (action.name) {
    case 'addEffect': {
      const [nodeId, effect] = action.args;
      return `Error while adding effect: "${effect.toString()}" to step ${nodeId}`;
    }
    case 'removeEffect': {
      const [nodeId, effect] = action.args;
      return `Error while removing effect: "${effect.toString()}" from step ${nodeId}`;
    }
    case 'toggleCompleted': {
      const [nodeId, effect] = action.args;
      return `Error while changing the state of step: ${args[0].step.toString()} to ${args[0].step.completed ? 'Completed' : 'Incomplete'}`;
    }
  }
};
*/

</script>

<template>
  <main>
    <!-- Special components -->
    <Toast />

    <!--  Modals  -->
    <AddEffectModalComponent />
    <ImportExportModalComponent />
    <StepModalComponent />

    <!--  Regular components  -->
    <TabComponent :min-width="'24rem'" max-width="30rem">
      <StepList :nodes="rootNode" id="stepsRoot" class="first-child" />
    </TabComponent>
    <TabComponent :max-width="'24rem'">
      <ControlPanelComponent />
    </TabComponent>
    <TabComponent :max-width="'20rem'">
      <EquipmentComponent />
    </TabComponent>
    <TabComponent :max-width="'20rem'">
      <InventoryComponent />
    </TabComponent>
    <TabComponent>
      <DebugComponent />
    </TabComponent>
  </main>
</template>

<style scoped>
main {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  height: 100vh;
  overflow-y: hidden;

  @media screen and (max-width: 450px) {
    flex-wrap: wrap;
    overflow-y: auto;
    justify-content: center;
  }
}
</style>
