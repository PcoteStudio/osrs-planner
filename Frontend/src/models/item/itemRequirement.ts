
import { PlayerState } from '../playerState';
import { Requirement } from '../requirement';
import type { Item } from './item';

export class ItemRequirement extends Requirement {
    constructor(private item: Item, private quantity: number) {
        super();
    }

    public isMet(playerState: PlayerState): boolean {
        const inventoryItem = playerState.inventory.getItemVariation(this.item);
        return !((this.quantity < 0 && inventoryItem && inventoryItem.quantity > 0)
            || (inventoryItem && inventoryItem.quantity < this.quantity));
    }
}