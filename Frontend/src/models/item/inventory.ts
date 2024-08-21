import { StateWarning } from '../stateWarning';
import type { ContainerItem } from './containerItem';
import { Item } from './item';

export class Inventory {
    items: { [id: number]: ContainerItem } = {};

    constructor(public maxSlots: number = 28) { }

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

    getItemVariation(item: Item): ContainerItem | undefined {
        if(item.noted || item.isPlaceholder) return this.items[item.id];
        const baseItem = item.linkedItem ?? item;
        const variations = baseItem.linkedStackedItems;
        for (const v of variations) {
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
        const containerItem: ContainerItem = this.getItemVariation(item) ?? { item, quantity: 0 };
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
        if (containerItem.quantity < 0)
            warnings.push(new InventoryMissingItemWarning(item, quantity, containerItem.quantity));
        if (this.usedSlots() > this.maxSlots)
            warnings.push(new InventoryLimitExceededWarning(item, quantity, this.maxSlots, this.usedSlots()) );
        if (containerItem.item.stackable && containerItem.quantity > containerItem.item.maxStack)
            warnings.push(new InventoryMaxStackSizeExceededWarning(item, quantity, containerItem.quantity));
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
    usedSlots(): number {
        let usedSlot = 0;
        for (const container of Object.values(this.items)) {
            if (container.quantity === 0) continue;
            if (container.item.stackable || container.item.noted || container.quantity < 0) usedSlot++;
            else usedSlot += container.quantity;
        }
        return usedSlot;
    }

    availableSlots(): number {
        return this.maxSlots - this.usedSlots();
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