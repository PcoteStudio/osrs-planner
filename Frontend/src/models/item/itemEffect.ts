import { Effect } from "../effect";
import { PlayerState } from "../playerState";
import { Item } from "./item";
import { ItemContainers } from "./itemContainers";

export class ItemEffect extends Effect {
    constructor(public source: ItemContainers, public destination: ItemContainers, public itemId: number, public quantity: number) {
        super();
    }

    // TODO Clear container feature
    public apply(playerState: PlayerState) {
        const item = Item.get(this.itemId);
        switch (this.source) {
            case ItemContainers.Bank:
                playerState.addWarning(playerState.bank.moveItem(this.itemId, -this.quantity));
                break;
            case ItemContainers.Inventory:
                playerState.addWarning(playerState.inventory.moveItem(this.itemId, -this.quantity));
                break;
            case ItemContainers.Equipment:
                playerState.equipment.swapSlot(item.equipmentSlot, undefined);
                break;
            default:
                break;
        }
        switch (this.destination) {
            case ItemContainers.Bank:
                playerState.addWarning(playerState.bank.moveItem(this.itemId, this.quantity));
                break;
            case ItemContainers.Inventory:
                playerState.addWarning(playerState.inventory.moveItem(this.itemId, this.quantity));
                break;
            case ItemContainers.Equipment:
                playerState.equipment.swapSlot(item.equipmentSlot, item.id);
                break;
            default:
                break;
        }
    }
}