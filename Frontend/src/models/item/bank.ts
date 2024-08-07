import { StateWarning } from '../stateWarning';
import { ContainerItem } from './containerItem';
import { Item } from './item';

export class Bank {
    items: { [id: number]: ContainerItem } = {};

    constructor() { }

    /**
     * Move items into or out of the bank.
     * @param itemId ID of the item moved.
     * @param quantity Number of item inserted if positive or removed if negative.
     * @returns Detailed warning or `undefined` if the move is valid.
     */
    moveItem(item: Item, quantity: number): BankMissingItemWarning | undefined {
        const containerItem: ContainerItem = this.items[item.id] || new ContainerItem(item, 0);
        containerItem.quantity += quantity;
        this.items[item.id] = containerItem;
        if (containerItem.quantity == 0)
            delete this.items[item.id];
        else if (containerItem.quantity < 0)
            return new BankMissingItemWarning(item, quantity, containerItem.quantity);
        return undefined;
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