import { PlayerState } from "./playerState";
import { StateWarning } from "./stateWarning";

export abstract class Effect {
    public abstract apply(playerState: PlayerState): StateWarning;
}