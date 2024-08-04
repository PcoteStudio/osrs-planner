
import { PlayerState } from '../playerState';
import { Requirement } from '../requirement';

export class ItemRequirement extends Requirement {
    public isMet(playerState: PlayerState): boolean {
        throw new Error('Method not implemented.');
    }
}