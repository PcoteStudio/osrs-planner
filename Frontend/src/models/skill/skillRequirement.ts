import { PlayerState } from '../playerState';
import { Requirement } from '../requirement';
import { SkillsEnum } from './skillsEnum';

export class SkillRequirement extends Requirement {
  constructor(public skill: SkillsEnum, public experience: number) {
    super();
  }

  public isMet(playerState: PlayerState): boolean {
    return playerState.skills.getSkillExperience(this.skill) >= this.experience;
  }
}