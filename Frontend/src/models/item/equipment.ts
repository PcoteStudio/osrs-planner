import { Item } from './item';
import { EquipmentSlotTypes } from '@/models/item/equipmentSlot';

export class Equipment {
    slots: { [slot in EquipmentSlotTypes as string]?: Item } = {};

    constructor() {
        for (const key in EquipmentSlotTypes) {
            this.slots[key] = new Item();
        }
    }

    get(slot: EquipmentSlotTypes): Item | undefined {
        return this.slots[slot];
    }

    swapSlot(slot: EquipmentSlotTypes, item: Item | undefined): Item | undefined {
        const previousItem = this.slots[slot];
        this.slots[slot] = item;
        return previousItem;
    }
}