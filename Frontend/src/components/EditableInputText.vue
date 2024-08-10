<script setup lang="ts">
import { ref } from 'vue';

const isEditing = ref(true);
const model = defineModel();

</script>

<template>
  <Inplace v-model:active="isEditing" class="input">
    <template #display>
      {{model}}
    </template>
    <template #content>
      <InputText v-model="model"
                 @keyup.enter="isEditing = false"
                 @blur="isEditing = false"
                 @vue:mounted="el => el.el.focus()"
      />
    </template>
  </Inplace>
</template>

<style scoped>
.input {
  background-color: red;
  & > div {
    padding: 1rem;
    background-color: green !important;
  }
}
</style>