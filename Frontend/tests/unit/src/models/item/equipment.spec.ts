import { describe, expect, it } from 'vitest';
import { Equipment } from '@/models/item/equipment';
import { Item } from '@/models/item/item';
import { EquipmentSlotTypes } from '@/models/item/equipmentSlot';

describe('equipment', () => {
  const helmItem = new Item(1, 'some-helmet-item');
  helmItem.equipmentSlot = EquipmentSlotTypes.Head;

  const bodyItem = new Item(2, 'some-body-item');
  bodyItem.equipmentSlot = EquipmentSlotTypes.Body;

  describe('get', () => {
    it('should return the right equipment for the slot specified', () => {
      const equipment = new Equipment();
      equipment.swapSlot(EquipmentSlotTypes.Head, { item: helmItem, quantity: 1 });
      equipment.swapSlot(EquipmentSlotTypes.Body, { item: bodyItem, quantity: 1 });

      expect(equipment.get(EquipmentSlotTypes.Head)).toBe({ item: helmItem, quantity: 1 });
      expect(equipment.get(EquipmentSlotTypes.Body)).toBe({ item: bodyItem, quantity: 1 });
    });
  });
});