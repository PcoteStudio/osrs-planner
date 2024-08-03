import { PlayerStateModel } from './playerStateModel';

export abstract class EffectModel {
    public abstract apply(playerState: PlayerStateModel): void;
    public abstract toString(): string[];
}