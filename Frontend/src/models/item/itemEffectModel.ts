import { EffectModel } from '../effectModel';
import { PlayerStateModel } from '../playerStateModel';
import { ItemModel } from './itemModel';
import { ItemContainersModel } from './itemContainersModel';

export class ItemEffectModel extends EffectModel {
    constructor(public source: ItemContainersModel, public destination: ItemContainersModel, public item: ItemModel, public quantity: number) {
        super();
    }

    // TODO Clear container feature
    public apply(playerState: PlayerStateModel) {
        switch (this.source) {
            case ItemContainersModel.Bank:
                playerState.addWarning(playerState.bank.moveItem(this.item.id, -this.quantity));
                break;
            case ItemContainersModel.Inventory:
                playerState.addWarning(playerState.inventory.moveItem(this.item.id, -this.quantity));
                break;
            case ItemContainersModel.Equipment:
                playerState.equipment.swapSlot(this.item.equipmentSlot, undefined);
                break;
            default:
                break;
        }
        switch (this.destination) {
            case ItemContainersModel.Bank:
                playerState.addWarning(playerState.bank.moveItem(this.item.id, this.quantity));
                break;
            case ItemContainersModel.Inventory:
                playerState.addWarning(playerState.inventory.moveItem(this.item.id, this.quantity));
                break;
            case ItemContainersModel.Equipment:
                playerState.equipment.swapSlot(this.item.equipmentSlot, this.item);
                break;
            default:
                break;
        }
    }

    public toString(): string[] {
        const effects: string[] = [];
        if (this.source !== ItemContainersModel.World)
            effects.push(`${ItemContainersModel[this.source]}: -${this.quantity} ${this.item}`);
        if (this.source !== ItemContainersModel.World)
            effects.push(`${ItemContainersModel[this.destination]}: +${this.quantity} ${this.item}`);
        return effects;
    }
}