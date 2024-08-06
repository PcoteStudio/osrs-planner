import headImg from '@/assets/images/icons/head.webp';
import capeImg from '@/assets/images/icons/cape.webp';
import neckImg from '@/assets/images/icons/neck.webp';
import ammunitionImg from '@/assets/images/icons/ammo.webp';
import extraAmmoImg from '@/assets/images/icons/ammo.webp';
import weaponImg from '@/assets/images/icons/weapon.webp';
import shieldImg from '@/assets/images/icons/shield.webp';
import bodyImg from '@/assets/images/icons/body.webp';
import legsImg from '@/assets/images/icons/legs.webp';
import handsImg from '@/assets/images/icons/hands.webp';
import feetImg from '@/assets/images/icons/feet.webp';
import ringImg from '@/assets/images/icons/ring.webp';

export enum EquipmentSlotTypes {
    Head = 'Head',
    Cape = 'Cape',
    Neck = 'Neck',
    Ammunition = 'Ammunition',
    ExtraAmmo = 'ExtraAmmo',
    Weapon = 'Weapon',
    Shield = 'Shield',
    TwoHandedItems = 'TwoHandedItems',
    Body = 'Body',
    Legs = 'Legs',
    Hands = 'Hands',
    Feet = 'Feet',
    Ring = 'Ring',
    Extra = 'Extra',
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