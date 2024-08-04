import { PlayerStateModel } from '../playerStateModel';
import { RequirementModel } from '../requirementModel';
import { SkillsEnum } from './skillsEnum';

export class SkillRequirementModel extends RequirementModel {
    constructor(private skill: SkillsEnum, private experience: number) {
        super();
    }

    public isMet(playerState: PlayerStateModel): boolean {
        return (playerState.skills[this.skill] ?? 0) >= this.experience;
    }
}