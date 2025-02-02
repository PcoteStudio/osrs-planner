<script setup lang="ts">

import { StepNode } from '@/models/stepTreeNode';
import { computed, ref, watch } from 'vue';
import { useGlobalStore } from '@/stores/globalStore';
import { EffectTypeEnum } from '@/models/effect';
import { getItemEffectTypeOptions, ItemEffectTypeEnum } from '@/types/itemEffectTypeEnum';
import SelectFuzzyComponent from '@/components/SelectFuzzyComponent.vue';
import { ItemStore } from '@/models/item/itemStore';
import { ItemEffect } from '@/models/item/itemEffect';

const store = useGlobalStore();

const props = defineProps<{
  node: StepNode
}>();

const selectedAction = ref();
const selectedItem = ref();
const quantity = ref(1);

const availableActions = computed(() => {
  const actions = [];
  for (const [key, value] of Object.entries(ItemEffectTypeEnum)) {
    const options = getItemEffectTypeOptions(value);
    actions.push({
      name: options.label,
      icon: options.icon,
      category: options.category,
      type: key,
    });
  }
  return actions;
});

const filteredItems = computed(() => {
  switch (selectedAction.value?.type) {
    case ItemEffectTypeEnum.Bank:
    case ItemEffectTypeEnum.Drop:
    case ItemEffectTypeEnum.Note:
      return store.getInventory.getUniqueItems();
    case ItemEffectTypeEnum.Pickup:
      return Object.values(ItemStore.items);
    case ItemEffectTypeEnum.Withdraw:
    case ItemEffectTypeEnum.Incinerate:
      //TODO: Bank
      break;
    case ItemEffectTypeEnum.Equip:
    case ItemEffectTypeEnum.Unequip:
      return store.getEquipment.getUniqueItems();
  }
});

const qtyMin = computed(() => {
  return 0;
});

const qtyMax = computed(() => {
  return undefined;
});

watch(store.getEffectState, (state) => {
  if (state.effect?.category === EffectTypeEnum.Item) {
    const action = state.effect.data.action;

    if (action)
      selectedAction.value = availableActions.value.find(s => s.type === action);

    selectedItem.value = state.effect.data.item;
  }
}, { immediate: true });

const currentAppliedEffect = computed(() => store.findEffect(props.node.step.id, EffectTypeEnum.Item, selectedItem.value?.name));
const currentQuantity = computed(() => {
  if (!selectedItem.value)
    return 0;

  if (currentAppliedEffect.value instanceof ItemEffect)
    return currentAppliedEffect.value.quantity;

  return 0;
});

const newQuantity = computed(() => currentQuantity.value + quantity.value);

const invalidForm = computed(() => {
  return quantity.value < 0;
});

const addEffect = () => {
  if (!selectedItem.value && !quantity.value)
    throw new Error(`selectedItem: ${selectedItem.value} and quantity ${quantity.value} need to be defined`);

  let qty;
  if (currentAppliedEffect.value instanceof ItemEffect) {
    qty = Number(quantity.value) - Number(currentAppliedEffect.value.quantity);
  }
  else {
    qty = Number(quantity.value);
  }

  const newEffect = new ItemEffect(selectedAction.value, selectedItem.value, qty);
  store.addEffect({
    category: EffectTypeEnum.Item,
    data: {
      stepId: props.node.step.id,
    }
  }, newEffect);

  store.closeEffectModal();
};
</script>

<template>
  <div class="flex flex-col gap-8 w-full">
    <FloatLabel>
      <Select v-model="selectedAction"
              :options="availableActions"
              optionLabel="name"
              placeholder="Select an action"
              class="w-full"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex items-center">
            <font-awesome-icon
                :icon="slotProps.value.icon"
                class="mr-2"
                style="width: 18px"
            />
            <div>{{ slotProps.value.name }}</div>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
        <template #option="slotProps">
          <div class="flex items-center w-full">
            <font-awesome-icon
                :icon="slotProps.option.icon"
                class="mr-2"
                style="width: 18px"
            />
            <div>{{ slotProps.option.name }}</div>
            <span class="ml-auto">
              <font-awesome-icon v-if="slotProps.option.category === 'inventory'" icon="suitcase" class="text-gray-400"/>
              <font-awesome-icon v-if="slotProps.option.category === 'bank'" icon="building-columns" class="text-gray-400" />
              <font-awesome-icon v-if="slotProps.option.category === 'gear'" icon="shirt" class="text-gray-400" />
            </span>
          </div>
        </template>
      </Select>
      <label for="effectTypes">Action</label>
    </FloatLabel>
    <SelectFuzzyComponent v-if="selectedAction" v-model="selectedItem" :items="filteredItems" />
    <FloatLabel v-if="selectedItem">
      <InputNumber
        v-model="quantity"
        showButtons
        inputId="quantity"
        :min="qtyMin"
        :max="qtyMax"
        fluid
      />
      <label for="quantity">Quantity</label>
    </FloatLabel>
    <span v-if="selectedItem && quantity"  class="w-full text-center" :class="{ invalid: invalidForm }">
      {{ currentQuantity }} + <span class="highlight">{{ quantity }}</span> → <span class="highlight">{{ newQuantity }}</span>
    </span>

    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="store.closeEffectModal" size="small" />
      <Button type="button" :label="currentAppliedEffect ? 'Edit effect' : 'Add effect'" @click="addEffect()" :disabled="invalidForm" size="small" />
    </div>
  </div>
</template>

<style scoped>

</style>