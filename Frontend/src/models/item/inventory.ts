import { StateWarning } from '../stateWarning';
import type { ContainerItem } from './containerItem';
import { Item } from './item';
import { ItemStore } from './itemStore';

export class Inventory {
  items: { [id: number]: ContainerItem } = {};

  constructor(public maxSlots: number = 28) { }
  
  clone(): Inventory {
    const inventory = new Inventory(this.maxSlots);
    inventory.items = { ...this.items };
    return inventory;
  }

  initializeSomeSlots(): void {
    this.moveItem(ItemStore.items[11804], 2);
    this.moveItem(ItemStore.items[11805], 15);
    this.moveItem(ItemStore.items[11806], 1);
    this.moveItem(ItemStore.items[11807], 10000000);
    this.moveItem(ItemStore.items[11808], 3);
    this.moveItem(ItemStore.items[11809], 100000);
  }

  getSlots(): ContainerItem[] {
    const stacks : ContainerItem[] = [];
    for (const container of Object.values(this.items)) {
      if(container.item.stackable || container.item.noted || container.quantity < 0)
        stacks.push(container);
      else for (let i = 0; i < container.quantity; i++)
        stacks.push({ ...container, quantity: 1 });
    }
    return stacks;
  }

  getUniqueItems(): Item[] {
    return Object.values(this.items).map((ci : ContainerItem) => ci.item);
  }

  getItem(item: Item): ContainerItem | undefined {
    return this.items[item.id];
  }

  getItemVariation(item: Item): ContainerItem | undefined {
    if(item.noted || item.isPlaceholder) return this.items[item.id];
    const baseItem = item.linkedItem ?? item;
    const variations = baseItem.linkedStackedItems;
    for (const v of [baseItem, ...variations]) {
      const container = this.items[v.id];
      if (container) return container;
    }
    return this.items[item.id];
  }

  noteItems(item: Item, quantity: number): StateWarning[] {
    const warnings: StateWarning[] = [];
    if(!item.notable) throw new Error(`This item is not notable: ${item.toString(true)}`);
    if(item.noted) throw new Error(`This item is already noted: ${item.toString(true)}`);
    if(!item.linkedNoted) throw new Error(`This item doesn't have a linked noted varation: ${item.toString(true)}`);
    warnings.push(...this.moveItem(item, -quantity));
    warnings.push(...this.moveItem(item.linkedNoted, quantity));
    return warnings;
  }

  unnoteItems(item: Item, quantity: number): StateWarning[] {
    const warnings: StateWarning[] = [];
    if(!item.noted) throw new Error(`This item is already unnoted: ${item.toString(true)}`);
    if(!item.linkedItem) throw new Error(`This item doesn't have a linked unnoted varation: ${item.toString(true)}`);
    warnings.push(...this.moveItem(item, -quantity));
    warnings.push(...this.moveItem(item.linkedItem, quantity));
    return warnings;
  }

  /**
     * Move items into or out of the inventory.
     * @param itemId ID of the item moved.
     * @param quantity Number of item inserted if positive or removed if negative.
     * @returns Detailed warning or `undefined` if the move is valid.
     */
  moveItem(item: Item, quantity: number): StateWarning[] {
    const warnings: StateWarning[] = [];
    if (quantity === 0) return warnings;
    let { item : cItem, quantity : cQuantity } = this.getItemVariation(item) ?? { item, quantity: 0 };
    cQuantity += quantity;
    this.items[cItem.id] = { item: cItem, quantity: cQuantity };
    const updatedItem = Item.getItemByStackSize(item, cQuantity);
    if (cQuantity === 0)
      delete this.items[cItem.id];
    else if(updatedItem.id !== cItem.id) {
      delete this.items[cItem.id];
      cItem = updatedItem;
      if (cQuantity !== 0)
        this.items[updatedItem.id] = { item: cItem, quantity: cQuantity };
    }
    if (cQuantity < 0)
      warnings.push(new InventoryMissingItemWarning(item, quantity, cQuantity));
    if (this.getUsedSlotsCount() > this.maxSlots)
      warnings.push(new InventoryLimitExceededWarning(item, quantity, this.maxSlots, this.getUsedSlotsCount()) );
    if (cItem.stackable && cQuantity > cItem.maxStack)
      warnings.push(new InventoryMaxStackSizeExceededWarning(item, quantity, cQuantity));
    return warnings;
  }

  /**
     * Remove all items from the inventory.
     */
  clear(): void {
    for (const itemId in this.items)
      delete this.items[itemId];
  }

  /**
     * Calculates the number of slots used by the items in the inventory.
     * @returns The number of used slots.
     */
  getUsedSlotsCount(): number {
    let usedSlot = 0;
    for (const container of Object.values(this.items)) {
      if (container.quantity === 0) continue;
      if (container.item.stackable || container.item.noted || container.quantity < 0) usedSlot++;
      else usedSlot += container.quantity;
    }
    return usedSlot;
  }

  getAvailableSlotsCount(): number {
    return this.maxSlots - this.getUsedSlotsCount();
  }
}

export class InventoryLimitExceededWarning extends StateWarning {
  constructor(
    lastItemInserted: Item,
    quantityInserted: number,
    availableSlots: number,
    usedSlots: number,
  ) {
    super(
      'InventoryLimitExceededWarning',
      `Inventory limit has been exceeded (${usedSlots}/${availableSlots}) by inserting ${quantityInserted} ${lastItemInserted.toString()}.`,
    );
  }
}

export class InventoryMissingItemWarning extends StateWarning {
  constructor(
    itemWithdrawn: Item,
    quantityWithdrawn: number,
    quantityMissing: number,
  ) {
    super(
      'InventoryMissingItemWarning',
      `${quantityWithdrawn} ${itemWithdrawn.toString()} were withdrawn from the inventory, but only ${quantityWithdrawn - quantityMissing} were available.`,
    );
  }
}

export class InventoryMaxStackSizeExceededWarning extends StateWarning {
  constructor(
    lastItemInserted: Item,
    quantityInserted: number,
    totalQuantity: number,
  ) {
    super(
      'InventoryStackSizeExceededWarning',
      `Inventory item max stack size limit has been exceeded (${totalQuantity}/${lastItemInserted.stackSize}) by inserting ${quantityInserted} ${lastItemInserted.toString()}.`,
    );
  }
}