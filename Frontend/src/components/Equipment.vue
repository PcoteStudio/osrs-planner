<script setup lang="ts">
import EquipmentSlot from "@/components/EquipmentSlot.vue";
import {EquipmentSlots} from "@/models/item/equipmentSlots";
import {ref, reactive} from "vue";
import {Item} from "@/models/item/item";

const showExtraAmmo = ref(true);
const headItem = reactive(new Item());
const capeItem = reactive(new Item());
capeItem.imageUrl = "https://oldschool.runescape.wiki/images/Dizana%27s_quiver_%28uncharged%29.png?a28c8";

</script>

<template>
<div class="inventory">
  <div class="row center">
    <EquipmentSlot :type="EquipmentSlots.Extra" :isVisible="false" />
    <EquipmentSlot :type="EquipmentSlots.Head" :item="headItem" />
    <EquipmentSlot :type="EquipmentSlots.ExtraAmmo" :isVisible="showExtraAmmo"/>
  </div>
  <div class="row center">
    <EquipmentSlot :type="EquipmentSlots.Cape" :item="capeItem" />
    <EquipmentSlot :type="EquipmentSlots.Neck" />
    <EquipmentSlot :type="EquipmentSlots.Ammunition" />
  </div>
  <div class="row">
    <EquipmentSlot :type="EquipmentSlots.Weapon" />
    <EquipmentSlot :type="EquipmentSlots.Body" />
    <EquipmentSlot :type="EquipmentSlots.Shield" />
  </div>
  <div class="row center">
    <EquipmentSlot :type="EquipmentSlots.Legs" />
  </div>
  <div class="row">
    <EquipmentSlot :type="EquipmentSlots.Hands" />
    <EquipmentSlot :type="EquipmentSlots.Feet" />
    <EquipmentSlot :type="EquipmentSlots.Ring" />
  </div>
</div>
<n-space>
  <n-switch v-model:value="showExtraAmmo" />
  <n-input v-model:value="headItem.imageUrl" type="text" placeholder="Basic Input" />
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