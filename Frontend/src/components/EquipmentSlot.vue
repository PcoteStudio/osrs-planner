<script setup lang="ts">

import {EquipmentSlots} from "@/models/item/equipmentSlots";
import headImg from "@/assets/images/icons/head.webp";
import capeImg from "@/assets/images/icons/cape.webp";
import neckImg from "@/assets/images/icons/neck.webp";
import ammunitionImg from "@/assets/images/icons/ammo.webp";
import extraAmmoImg from "@/assets/images/icons/ammo.webp";
import weaponImg from "@/assets/images/icons/weapon.webp";
import shieldImg from "@/assets/images/icons/shield.webp";
import bodyImg from "@/assets/images/icons/body.webp";
import legsImg from "@/assets/images/icons/legs.webp";
import handsImg from "@/assets/images/icons/hands.webp";
import feetImg from "@/assets/images/icons/feet.webp";
import ringImg from "@/assets/images/icons/ring.webp";

const props = withDefaults(defineProps<{
  isVisible?: boolean;
  disabled?: boolean;
  type: EquipmentSlots;
}>(), {
  disabled: false,
  isVisible: true,
})

let isEmpty = true;

let itemImage = "";
switch (props.type) {
  case EquipmentSlots.Head:
    itemImage = headImg;
    break;
  case EquipmentSlots.Cape:
    itemImage = "https://oldschool.runescape.wiki/images/Dizana%27s_quiver_%28uncharged%29.png?a28c8";
    isEmpty = false;
    //itemImage = capeImg;
    break;
  case EquipmentSlots.Neck:
    itemImage = neckImg;
    break;
  case EquipmentSlots.Ammunition:
    itemImage = ammunitionImg;
    break;
  case EquipmentSlots.ExtraAmmo:
    itemImage = extraAmmoImg;
    break;
  case EquipmentSlots.Weapon:
    itemImage = weaponImg;
    break;
  case EquipmentSlots.Shield:
    itemImage = shieldImg;
    break;
  case EquipmentSlots.Body:
    itemImage = bodyImg;
    break;
  case EquipmentSlots.Legs:
    itemImage = legsImg;
    break;
  case EquipmentSlots.Hands:
    itemImage = handsImg;
    break;
  case EquipmentSlots.Feet:
    itemImage = feetImg;
    break;
  case EquipmentSlots.Ring:
    itemImage = ringImg;
    break;
}
</script>

<template>
  <div class="slot" :class="{ hidden: ! isVisible }">
    <n-tooltip trigger="hover" placement="bottom" :delay="500" :keep-alive-on-hover="false">
      <template #trigger>
        <div class="content">
          <img v-if="itemImage" :src="itemImage" :class="{placeholder: isEmpty}" :alt="EquipmentSlots[props.type]" />
        </div>
      </template>
      {{ EquipmentSlots[props.type] }}
    </n-tooltip>
  </div>
</template>

<style scoped>
.slot {
  background: #2c3e50;
  position: relative;
  overflow: hidden;
  height: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 10%;
  cursor: pointer;

  .content {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 70%;
      &.placeholder {
        width: fit-content;
        filter: invert(52%) sepia(9%) saturate(8%) hue-rotate(324deg) brightness(95%) contrast(90%);
      }
    }
  }
}

.hidden {
  visibility: hidden;
}
</style>