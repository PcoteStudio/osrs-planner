import { StateWarning } from '../stateWarning';
import { ContainerItem } from './containerItem';
import { Item } from './item';

export class Inventory {
    items: { [id: number]: ContainerItem } = {};

    constructor(public availableSlots: number = 28) { }

    /**
     * Move items into or out of the inventory.
     * @param itemId ID of the item moved.
     * @param quantity Number of item inserted if positive or removed if negative.
     * @returns Detailed warning or `undefined` if the move is valid.
     */
    moveItem(item: Item, quantity: number): InventoryMissingItemWarning | InventoryLimitExceededWarning | undefined {
        const containerItem: ContainerItem = this.items[item.id] || new ContainerItem(item, 0);
        containerItem.quantity += quantity;
        this.items[item.id] = containerItem;
        if (containerItem.quantity == 0)
            delete this.items[item.id];
        else if (containerItem.quantity < 0)
            return new InventoryMissingItemWarning(item, quantity, containerItem.quantity);
        else if (this.usedSlots() > this.availableSlots)
            return new InventoryLimitExceededWarning(item, quantity, this.availableSlots, this.usedSlots());
        return undefined;
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
        for (const [itemId, containerItem] of Object.entries(this.items)) {
            if (containerItem.quantity <= 0) continue;
            if (containerItem.item.stackable || containerItem.noted) usedSlot++;
            else usedSlot += containerItem.quantity;
        }
        return usedSlot;
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
            `Inventory limit has been exceeded (${usedSlots}/${availableSlots}) by inserting ${quantityInserted} ${lastItemInserted.name}.`,
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
            `${quantityWithdrawn} ${itemWithdrawn.name} were withdrawn from the inventory, but only ${quantityWithdrawn - quantityMissing} were available.`,
        );
    }
}