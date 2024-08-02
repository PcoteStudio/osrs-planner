import { Effect } from "../effect";
import { PlayerState } from "../playerState";
import { StateWarning } from "../stateWarning";

export class InventoryEffect extends Effect {
    constructor(public itemId: number, public quantity: number, public clearAll: boolean) {
        super();
    }

    public apply(playerState: PlayerState): StateWarning {
        if (this.clearAll) {
            playerState.inventory.clear();
            return undefined;
        }
        return playerState.inventory.moveItem(this.itemId, this.quantity);
    }
}