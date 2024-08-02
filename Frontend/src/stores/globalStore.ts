import {defineStore} from 'pinia'
import {EquipmentSlot, EquipmentSlotTypes} from "@/models/item/equipmentSlot";

export const useGlobalStore = defineStore('globalStore', {
    state: () => {
        let equipmentSlots : EquipmentSlot[] = [];
        for (let key in EquipmentSlotTypes) {
            equipmentSlots[key] = new EquipmentSlot();
            equipmentSlots[key].equipmentSlotType = EquipmentSlotTypes[key as keyof typeof EquipmentSlotTypes];
        }

        return {
            equipmentSlots: equipmentSlots,
            count: 0
        }
    },
    actions: {
        increment() {
            this.count++
        },
    },
})