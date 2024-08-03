import { ItemModel } from './itemModel';
import { EquipmentSlotTypes, EquipmentSlotModel } from '@/models/item/equipmentSlotModel';

export class EquipmentModel {
    slots: EquipmentSlotModel[] = [];

    constructor() {
        for (const key in EquipmentSlotTypes) {
            this.slots[key] = new EquipmentSlotModel();
            this.slots[key].equipmentSlotType = EquipmentSlotTypes[key as keyof typeof EquipmentSlotTypes];
        }
    }

    get(slot: EquipmentSlotTypes): ItemModel | undefined {
        return this.slots[slot].item;
    }

    swapSlot(slot: EquipmentSlotTypes, item: ItemModel | undefined): ItemModel | undefined {
        const previousItem = this.slots[slot].item;
        this.slots[slot].item = item;
        return previousItem;
    }
}