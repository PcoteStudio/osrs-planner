<script setup lang="ts">
import EquipmentSlot from '@/components/EquipmentSlotComponent.vue';
import { Item } from '@/models/item/item';
import { useGlobalStore } from '@/stores/globalStore';
import { EquipmentSlotTypes } from '@/models/item/equipmentSlot';

const store = useGlobalStore();

const torvaHelm = new Item(26382, 'Torva full helm');
torvaHelm.imageUrl = 'https://oldschool.runescape.wiki/images/Torva_full_helm.png?96920';
store.getCurrentRoute.getPlayerState().equipment.swapSlot(EquipmentSlotTypes.Head, { item: torvaHelm, quantity: 1 });

</script>

<template>
<div class="equipment">
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
.equipment {
  display: flex;
  flex-direction: column;
  gap: 3%;
  padding: 1rem;
  aspect-ratio: 3 / 4;
  width: inherit;
  flex: 1;
}
.row {
  flex: 1;
  justify-content: space-between;
  display: flex;
  gap: 3%;
  &.center {
    justify-content: center;
  }
}
</style>