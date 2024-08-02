import type { EquipmentSlots } from "./equipmentSlots";
import { Item } from "./item";

export class Equipment {
    slots: { [slot in EquipmentSlots as string]?: number } = {};

    getId(slot: EquipmentSlots): number | undefined {
        return this.slots[slot];
    }

    getItem(slot: EquipmentSlots): Item | undefined {
        const itemId = this.slots[slot];
        return itemId !== undefined ? Item.get(itemId) : undefined;
    }

    swapSlot(slot: EquipmentSlots, itemId: number | undefined) {
        const previousItemId = this.slots[slot];
        this.slots[slot] = itemId;
        return previousItemId;
    }
}