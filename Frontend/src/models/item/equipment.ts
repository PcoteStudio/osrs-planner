import { Item } from "./item";
import {EquipmentSlotTypes, EquipmentSlot} from "@/models/item/equipmentSlot";

export class Equipment {
    slots: EquipmentSlot[] = [];

    constructor() {
        const slots : EquipmentSlot[] = [];
        for (const key in EquipmentSlotTypes) {
            slots[key] = new EquipmentSlot();
            slots[key].equipmentSlotType = EquipmentSlotTypes[key as keyof typeof EquipmentSlotTypes];
        }
        this.slots = slots;
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