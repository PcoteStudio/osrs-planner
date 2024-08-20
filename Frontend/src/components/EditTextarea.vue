<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const model = defineModel();
const emit = defineEmits(['close']);

const content = ref();

const save = () => {
  model.value = content.value;
  emit('close');
};

const close = () => {
  emit('close');
};

const undo = () => {
  content.value = model.value;
};

watch(model, () => {
  content.value = model.value;
}, { immediate: true });
</script>

<template>
  <div class="editor">
    <Textarea v-model="content"
              rows="1"
              auto-resize
              :style="{ width: '100%' }"
    />
    <div class="actions">
      <Button @click="save"
              :disabled="content === model"
              :class="{ active: content !== model }"
              icon="pi pi-save" size="small"
              plain text
      />
      <Button @click="undo"
              :disabled="content === model"
              icon="pi pi-refresh" size="small"
              plain text
      />
      <Button @click="close"
              icon="pi pi-times" size="small"
              plain text
      />
    </div>
  </div>
</template>

<style scoped>
.editor {
  position: relative;
  display: flex;

  .actions {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    margin-top: 0.5em;
    margin-right: 0.5em;
    height: 1.75em;
    background: rgba(51, 51, 51, 0.9);
    outline: solid #444 1px;
    border-radius: 5px;

    & > button {
      padding: 0;
      width: 2em;

      &:hover {
        color: #12a881;
      }

      &.active {
        color: #16ce9e;
      }
    }
  }
}
</style>