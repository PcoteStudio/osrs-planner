import { Item } from "./item";
import { EquipmentSlotTypes, EquipmentSlot } from "@/models/item/equipmentSlot";

export class Equipment {
    slots: EquipmentSlot[] = [];

    constructor() {
        for (const key in EquipmentSlotTypes) {
            this.slots[key] = new EquipmentSlot();
            this.slots[key].equipmentSlotType = EquipmentSlotTypes[key as keyof typeof EquipmentSlotTypes];
        }
    }

    get(slot: EquipmentSlotTypes): Item | undefined {
        return this.slots[slot].item;
    }

    swapSlot(slot: EquipmentSlotTypes, item: Item | undefined): Item | undefined {
        const previousItem = this.slots[slot].item;
        this.slots[slot].item = item;
        return previousItem;
    }
}