import { PlayerState } from './playerState';

export abstract class Effect {
    public abstract apply(playerState: PlayerState): void;
    public abstract toString(): string[];
}