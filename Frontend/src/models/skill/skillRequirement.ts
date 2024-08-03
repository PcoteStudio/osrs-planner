import { PlayerState } from '../playerState';
import { Requirement } from '../requirement';
import { Skills } from './skills';

export class SkillRequirement extends Requirement {
    constructor(private skill: Skills, private experience: number) {
        super();
    }

    public isMet(playerState: PlayerState): boolean {
        return (playerState.skills[this.skill] ?? 0) >= this.experience;
    }
}