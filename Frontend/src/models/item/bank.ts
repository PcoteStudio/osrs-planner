import { StateWarning } from '../stateWarning';
import type { ContainerItem } from './containerItem';
import { Item } from './item';

export class Bank {
  items: { [id: number]: ContainerItem } = {};

  constructor() { }

  getSlots(): ContainerItem[] {
    return Object.values(this.items);
  }

  getItemVariation(item: Item): ContainerItem | undefined {
    const baseItem = item.linkedItem ?? item;
    const variations = baseItem.linkedStackedItems;
    for (const v of [baseItem, ...variations]) {
      const container = this.items[v.id];
      if (container) return container;
    }
    return this.items[baseItem.id];
  }

  /**
     * Move items into or out of the bank.
     * @param itemId ID of the item moved.
     * @param quantity Number of item inserted if positive or removed if negative.
     * @returns Detailed warning or `undefined` if the move is valid.
     */
  moveItem(item: Item, quantity: number): StateWarning[] {
    const warnings: StateWarning[] = [];
    if (quantity === 0) return warnings;
    const containerItem: ContainerItem =  this.getItemVariation(item) ?? { item, quantity: 0 };
    containerItem.quantity += quantity;
    this.items[containerItem.item.id] = containerItem;
    const updatedItem = Item.getItemByStackSize(item, containerItem.quantity);
    if(updatedItem.id != containerItem.item.id) {
      delete this.items[containerItem.item.id];
      containerItem.item = updatedItem;
      this.items[updatedItem.id] = containerItem;
    }
    if (containerItem.quantity == 0)
      delete this.items[containerItem.item.id];
    else if (containerItem.quantity < 0)
      warnings.push(new BankMissingItemWarning(containerItem.item, quantity, containerItem.quantity)) ;
    return warnings;
  }

  /**
     * Remove all items from the bank.
     */
  clear(): void {
    for (const itemId in this.items)
      delete this.items[itemId];
  }

  /**
     * Calculates the number of slots used by the items in the bank.
     * @returns The number of used slots.
     */
  usedSlots(): number {
    let usedSlot = 0;
    for (const [, containerItem] of Object.entries(this.items)) {
      if (containerItem.quantity <= 0) continue;
      usedSlot++;
    }
    return usedSlot;
  }
}

export class BankMissingItemWarning extends StateWarning {
  constructor(
    itemWithdrawn: Item,
    quantityWithdrawn: number,
    quantityMissing: number,
  ) {
    super(
      'BankMissingItemWarning',
      `${quantityWithdrawn} ${itemWithdrawn.name} were withdrawn from the bank, but only ${quantityWithdrawn - quantityMissing} were available.`,
    );
  }
}