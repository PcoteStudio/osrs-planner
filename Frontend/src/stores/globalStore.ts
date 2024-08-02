import {defineStore} from 'pinia';
import {EquipmentSlot, EquipmentSlotTypes} from "@/models/item/equipmentSlot";

export const useGlobalStore = defineStore('globalStore', {
    state: () => {
        const equipmentSlots : EquipmentSlot[] = [];
        for (const key in EquipmentSlotTypes) {
            equipmentSlots[key] = new EquipmentSlot();
            equipmentSlots[key].equipmentSlotType = EquipmentSlotTypes[key as keyof typeof EquipmentSlotTypes];
        }

        return {
            equipmentSlots: equipmentSlots,
            count: 0
        };
    },
    actions: {
        increment() {
            this.count++;
        },
    },
});