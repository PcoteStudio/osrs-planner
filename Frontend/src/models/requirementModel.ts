import { PlayerStateModel } from './playerStateModel';

export abstract class RequirementModel {
    public abstract isMet(playerState: PlayerStateModel): boolean;
}