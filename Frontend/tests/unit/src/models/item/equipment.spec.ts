import { describe, expect, it } from 'vitest';
import { Equipment } from '../../../../../src/models/item/equipment';
import { Item } from '../../../../../src/models/item/item';
import { EquipmentSlotTypes } from '../../../../../src/models/item/equipmentSlot';

describe('equipment', () => {
    const torvaHelm = new Item();
    torvaHelm.id = 26382;
    torvaHelm.equipmentSlot = EquipmentSlotTypes.Head;

    const masoriBody = new Item();
    masoriBody.id = 27238;
    masoriBody.equipmentSlot = EquipmentSlotTypes.Body;

    describe('get', () => {
        it('should return the right equipment for the slot specified', () => {
            const equipment = new Equipment();
            equipment.swapSlot(EquipmentSlotTypes.Head, torvaHelm);
            equipment.swapSlot(EquipmentSlotTypes.Body, masoriBody);

            expect(equipment.get(EquipmentSlotTypes.Head)).toBe(torvaHelm);
            expect(equipment.get(EquipmentSlotTypes.Body)).toBe(masoriBody);
        });
    });
});