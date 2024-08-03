import { PlayerStateModel } from '../playerStateModel';
import { RequirementModel } from '../requirementModel';
import { SkillsModel } from './skillsModel';

export class SkillRequirementModel extends RequirementModel {
    constructor(private skill: SkillsModel, private experience: number) {
        super();
    }

    public isMet(playerState: PlayerStateModel): boolean {
        return (playerState.skills[this.skill] ?? 0) >= this.experience;
    }
}