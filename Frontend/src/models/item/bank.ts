import { StateWarning } from "../stateWarning";
import { Item } from "./item";

export class Bank {
    items: { [id: number]: number } = {};

    constructor() { }

    /**
     * Move items into or out of the bank.
     * @param itemId ID of the item moved.
     * @param quantity Number of item inserted if positive or removed if negative.
     * @returns Detailed warning or `undefined` if the move is valid.
     */
    moveItem(itemId: number, quantity: number): BankMissingItemWarning {
        const currentQuantity = this.items[itemId];
        const newQuantity = currentQuantity ? currentQuantity + quantity : quantity;
        this.items[itemId] = newQuantity;
        if (newQuantity == 0)
            delete this.items[itemId];
        else if (newQuantity < 0)
            return new BankMissingItemWarning(Item.get(itemId), quantity, newQuantity);
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
        for (const [, quantity] of Object.entries(this.items)) {
            if (quantity <= 0) continue;
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
            "BankMissingItemWarning",
            `${quantityWithdrawn} ${itemWithdrawn.name} were withdrawn from the bank, but only ${quantityWithdrawn - quantityMissing} were available.`,
        );
    }
}