import { Effect } from "../effect";
import { PlayerState } from "../playerState";

export class InventoryEffect extends Effect {
    public apply(playerState: PlayerState): PlayerState {
        throw new Error("Method not implemented.");
    }
}