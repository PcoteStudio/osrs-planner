import type { ContainerItem } from './containerItem';
import { EquipmentSlotTypes } from '@/models/item/equipmentSlot';

export class Equipment {
  slots: { [slot in EquipmentSlotTypes as string]?: ContainerItem } = {};

  constructor() {
    for (const key in EquipmentSlotTypes) {
      this.slots[key] = undefined;
    }
  }

  get(slot: EquipmentSlotTypes): ContainerItem | undefined {
    return this.slots[slot];
  }

  swapSlot(slot: EquipmentSlotTypes | undefined, containerItem: ContainerItem | undefined): ContainerItem | undefined {
    if (!slot)
      throw new Error('The destination slot is missing');
    if (containerItem?.item !== undefined && (!containerItem.item.equipable || !containerItem.item.equipmentSlot))
      throw new Error('This item cannot be equiped');
    if (containerItem?.item !== undefined && containerItem.item.equipmentSlot !== slot)
      throw new Error('This item cannot be in this slot');
    const previousItem = this.slots[slot];
    this.slots[slot] = containerItem;
    return previousItem;
  }
}