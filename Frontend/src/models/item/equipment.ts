import type { EquipmentSlotTypes } from "./equipmentSlot";
import { Item } from "./item";

export class Equipment {
    slots: { [slot in EquipmentSlotTypes as string]?: Item } = {};

    get(slot: EquipmentSlotTypes): Item | undefined {
        return this.slots[slot];
    }

    swapSlot(slot: EquipmentSlotTypes, item: Item | undefined): Item | undefined {
        const previousItem = this.slots[slot];
        this.slots[slot] = item;
        return previousItem;
    }
}