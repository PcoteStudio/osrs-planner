import { StateWarning } from '../stateWarning';
import { Item } from './item';

export class Inventory {
    items: { [id: number]: number } = {};

    constructor(public availableSlots: number = 28) { }

    /**
     * Move items into or out of the inventory.
     * @param itemId ID of the item moved.
     * @param quantity Number of item inserted if positive or removed if negative.
     * @returns Detailed warning or `undefined` if the move is valid.
     */
    moveItem(itemId: number, quantity: number): InventoryMissingItemWarning | InventoryLimitExceededWarning | undefined {
        const currentQuantity = this.items[itemId];
        const newQuantity = currentQuantity ? currentQuantity + quantity : quantity;
        this.items[itemId] = newQuantity;
        if (newQuantity == 0)
            delete this.items[itemId];
        else if (newQuantity < 0)
            return new InventoryMissingItemWarning(Item.get(itemId), quantity, newQuantity);
        else if (this.usedSlots() > this.availableSlots)
            return new InventoryLimitExceededWarning(Item.get(itemId), quantity, this.availableSlots, this.usedSlots());
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
        for (const [itemId, quantity] of Object.entries(this.items)) {
            if (quantity <= 0) continue;
            if (Item.get(Number(itemId)).stackable) usedSlot++;
            else usedSlot += quantity;
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