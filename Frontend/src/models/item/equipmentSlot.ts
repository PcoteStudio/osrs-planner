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
import type {Item} from "@/models/item/item";

export class EquipmentSlot {
    equipmentSlotType: EquipmentSlotTypes;
    item: Item | undefined;
}

export enum EquipmentSlotTypes {
    Head,
    Cape,
    Neck,
    Ammunition,
    ExtraAmmo,
    Weapon,
    Shield,
    TwoHandedItems,
    Body,
    Legs,
    Hands,
    Feet,
    Ring,
    Extra,
}

export const getPlaceholderSrc = (slotType: EquipmentSlotTypes) => {
    switch (slotType) {
        case EquipmentSlotTypes.Head:
            return headImg;
        case EquipmentSlotTypes.Cape:
            return capeImg;
        case EquipmentSlotTypes.Neck:
            return neckImg;
        case EquipmentSlotTypes.Ammunition:
            return ammunitionImg;
        case EquipmentSlotTypes.ExtraAmmo:
            return extraAmmoImg;
        case EquipmentSlotTypes.Weapon:
            return weaponImg;
        case EquipmentSlotTypes.Shield:
            return shieldImg;
        case EquipmentSlotTypes.Body:
            return bodyImg;
        case EquipmentSlotTypes.Legs:
            return legsImg;
        case EquipmentSlotTypes.Hands:
            return handsImg;
        case EquipmentSlotTypes.Feet:
            return feetImg;
        case EquipmentSlotTypes.Ring:
            return ringImg;
    }
};