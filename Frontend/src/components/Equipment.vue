<script setup lang="ts">
import InventorySlot from "@/components/EquipmentSlot.vue";
import {EquipmentSlots} from "@/models/item/equipmentSlots";
import {ref} from "vue";

let showExtraAmmo = ref(true);
</script>

<template>
<div class="inventory">
  <div class="row center">
    <InventorySlot :type="EquipmentSlots.Extra" :isVisible="false"  />
    <InventorySlot :type="EquipmentSlots.Head" />
    <InventorySlot :type="EquipmentSlots.ExtraAmmo" :isVisible="showExtraAmmo"/>
  </div>
  <div class="row center">
    <InventorySlot :type="EquipmentSlots.Cape" />
    <InventorySlot :type="EquipmentSlots.Neck" />
    <InventorySlot :type="EquipmentSlots.Ammunition" />
  </div>
  <div class="row">
    <InventorySlot :type="EquipmentSlots.Weapon" />
    <InventorySlot :type="EquipmentSlots.Body" />
    <InventorySlot :type="EquipmentSlots.Shield" />
  </div>
  <div class="row center">
    <InventorySlot :type="EquipmentSlots.Legs" />
  </div>
  <div class="row">
    <InventorySlot :type="EquipmentSlots.Hands" />
    <InventorySlot :type="EquipmentSlots.Feet" />
    <InventorySlot :type="EquipmentSlots.Ring" />
  </div>
</div>
<n-space>
  <n-switch v-model:value="showExtraAmmo" />
</n-space>
</template>

<style scoped>
.inventory {
  background-color: #181818;
  display: flex;
  flex-direction: column;
  gap: 3%;
  flex-grow: 1;
  height: 40%;
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