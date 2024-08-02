import { PlayerState } from "./playerState";

export abstract class Requirement {
    public abstract isMet(playerState: PlayerState): boolean;
}