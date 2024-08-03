import { PlayerStateModel } from '../playerStateModel';
import { RequirementModel } from '../requirementModel';

export class ItemRequirementModel extends RequirementModel {
    public isMet(playerState: PlayerStateModel): boolean {
        throw new Error('Method not implemented.');
    }
}