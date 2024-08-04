<script setup lang="ts">
import EquipmentSlot from '@/components/EquipmentSlotComponent.vue';
import { Item } from '@/models/item/item';
import { useGlobalStore } from '@/stores/globalStore';
import { EquipmentSlotTypes } from '@/models/item/equipmentSlot';

const state = useGlobalStore();

const test = state.currentPlayerState.equipment.slots[EquipmentSlotTypes.Head].item = new Item();//.find((s) => s.equipmentSlotType === EquipmentSlotTypes.Head);
test.imageUrl = 'https://oldschool.runescape.wiki/images/Torva_full_helm.png?96920';

</script>

<template>
<div class="inventory">
  <div class="row center">
    <EquipmentSlot :type="EquipmentSlotTypes.Extra" :isVisible="false" />
    <EquipmentSlot :type="EquipmentSlotTypes.Head" />
    <EquipmentSlot :type="EquipmentSlotTypes.ExtraAmmo" />
  </div>
  <div class="row center">
    <EquipmentSlot :type="EquipmentSlotTypes.Cape" />
    <EquipmentSlot :type="EquipmentSlotTypes.Neck" />
    <EquipmentSlot :type="EquipmentSlotTypes.Ammunition" />
  </div>
  <div class="row">
    <EquipmentSlot :type="EquipmentSlotTypes.Weapon" />
    <EquipmentSlot :type="EquipmentSlotTypes.Body" />
    <EquipmentSlot :type="EquipmentSlotTypes.Shield" />
  </div>
  <div class="row center">
    <EquipmentSlot :type="EquipmentSlotTypes.Legs" />
  </div>
  <div class="row">
    <EquipmentSlot :type="EquipmentSlotTypes.Hands" />
    <EquipmentSlot :type="EquipmentSlotTypes.Feet" />
    <EquipmentSlot :type="EquipmentSlotTypes.Ring" />
  </div>
</div>
</template>

<style scoped>
.inventory {
  background-color: var(--color-background-soft);
  display: flex;
  flex-direction: column;
  gap: 3%;
  flex-grow: 0;
  height: 40%;
  min-height: 250px;
  aspect-ratio: 3 / 4;
  padding: 1rem;
}
.row {
  flex-basis: 100%;
  justify-content: space-between;
  display: flex;
  gap: 3%;
  &.center {
    justify-content: center;
  }
}
</style>