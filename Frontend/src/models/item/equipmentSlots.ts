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

export enum EquipmentSlots {
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

export const getPlaceholderSrc = (slotType: EquipmentSlots) => {
    switch (slotType) {
        case EquipmentSlots.Head:
            return headImg;
        case EquipmentSlots.Cape:
            return capeImg;
        case EquipmentSlots.Neck:
            return neckImg;
        case EquipmentSlots.Ammunition:
            return ammunitionImg;
        case EquipmentSlots.ExtraAmmo:
            return extraAmmoImg;
        case EquipmentSlots.Weapon:
            return weaponImg;
        case EquipmentSlots.Shield:
            return shieldImg;
        case EquipmentSlots.Body:
            return bodyImg;
        case EquipmentSlots.Legs:
            return legsImg;
        case EquipmentSlots.Hands:
            return handsImg;
        case EquipmentSlots.Feet:
            return feetImg;
        case EquipmentSlots.Ring:
            return ringImg;
    }
}