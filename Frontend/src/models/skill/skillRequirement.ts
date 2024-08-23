import { PlayerState } from '../playerState';
import { Requirement } from '../requirement';
import { SkillsEnum } from './skillsEnum';

export class SkillRequirement extends Requirement {
  constructor(private skill: SkillsEnum, private experience: number) {
    super();
  }

  public isMet(playerState: PlayerState): boolean {
    return (playerState.skills[this.skill] ?? 0) >= this.experience;
  }
}