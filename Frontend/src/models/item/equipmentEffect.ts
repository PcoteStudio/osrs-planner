import { Effect } from "../effect";
import { PlayerState } from "../playerState";
import { StateWarning } from "../stateWarning";

export class EquipmentEffect extends Effect {
    public apply(playerState: PlayerState): StateWarning {
        throw new Error("Method not implemented.");
    }
}