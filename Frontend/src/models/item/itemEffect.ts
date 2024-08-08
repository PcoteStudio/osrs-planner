import { Effect, EffectTypeEnum } from '../effect';
import { PlayerState } from '../playerState';
import { Item } from './item';
import { ItemContainers } from './itemContainers';

export class ItemEffect extends Effect {
    constructor(public source: ItemContainers, public destination: ItemContainers, public item: Item, public quantity: number) {
        super(EffectTypeEnum.Item);
    }

    // TODO Clear container feature
    public apply(playerState: PlayerState) {
        switch (this.source) {
            case ItemContainers.Bank:
                playerState.addWarning(playerState.bank.moveItem(this.item, -this.quantity));
                break;
            case ItemContainers.Inventory:
                playerState.addWarning(playerState.inventory.moveItem(this.item, -this.quantity));
                break;
            case ItemContainers.Equipment:
                playerState.equipment.swapSlot(this.item.equipmentSlot, undefined);
                break;
            default:
                break;
        }
        switch (this.destination) {
            case ItemContainers.Bank:
                playerState.addWarning(playerState.bank.moveItem(this.item, this.quantity));
                break;
            case ItemContainers.Inventory:
                playerState.addWarning(playerState.inventory.moveItem(this.item, this.quantity));
                break;
            case ItemContainers.Equipment:
                playerState.equipment.swapSlot(this.item.equipmentSlot, this.item);
                break;
            default:
                break;
        }
    }

    public toString(): string[] {
        const effects: string[] = [];
        if (this.source !== ItemContainers.World)
            effects.push(`${ItemContainers[this.source]}: -${this.quantity} ${this.item}`);
        if (this.source !== ItemContainers.World)
            effects.push(`${ItemContainers[this.destination]}: +${this.quantity} ${this.item}`);
        return effects;
    }
}