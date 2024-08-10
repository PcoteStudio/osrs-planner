<script setup lang="ts">

import { watch } from 'vue';
import { InvalidRouteJsonError } from '@/errors/invalid-route-json-error';
import { useToast } from 'primevue/usetoast';
import { useGlobalStore } from '@/stores/globalStore';

const toast = useToast();
const state = useGlobalStore();

watch(() => state.notifications,
    (notifications) => {
      for (const notification of notifications) {
        const details = getMessageDetails(notification);

        toast.add({
          severity: details.logLevel,
          detail: details.message,
          life: 5000
        });
      }
      state.clearNotifications();
    }, { deep: true }
);

state.$onAction(
    ({ onError }) => {
      onError((error) => {
        console.error(error);
        const details = getErrorMessageDetails(error);

        toast.add({
          severity: details.logLevel,
          detail: details.message,
        });
      });
    }
);

function getMessageDetails(notification: Notification) {
  let details = { message: '', logLevel: 'info' };

  switch (notification.action) {
    case 'toggleCompleted':
      details.message = `Step ${notification.data.stepLabel}: ${notification.data.completed ? 'Completed' : 'Incomplete'}`;
      break;
    case 'addEffect':
      details.message = `New effect added: "${notification.data.effect.toString()}" to step ${notification.data.stepLabel}`;
      break;
    case 'removeEffect':
      details.message = `Effect removed: "${notification.data.effect.toString()}" from step ${notification.data.stepLabel}`;
      break;
    case 'setCurrentRoute':
      details.message = `Route imported succesfully with ${notification.data.nbSteps} steps`;
      break;
    default:
      throw new Error(`Message not defined for type: ${notification.action}`);
  }

  return details;
}

function getErrorMessageDetails(error: Error) {
  let details = { message: '', logLevel: 'error' };

  switch (typeof error) {
    case InvalidRouteJsonError:
      details.message = `The json of the route was invalid: ${error.innerError.message}`;
      details.logLevel = 'warn';
      break;
    default:
      details.message = 'An error occured';
  }

  return details;
}

</script>

<template>
  <Toast />
</template>

<style scoped>

</style>