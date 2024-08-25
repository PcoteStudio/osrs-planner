import { SkillsEnum } from './skillsEnum';
import { XpHelper } from './xpHelper';

export class Skills {
  skills: { [skill in SkillsEnum as string]?: number } = {};

  private maxExperience = 200_000_000;
  private maxVirtualLevel = 126;
  private maxLevel = 99;

  constructor() {
    for (const skill of Object.values(SkillsEnum))
      this.setSkillExperience(skill, 0);
    this.setSkillExperience(SkillsEnum.Hitpoints, 1154);
  }

  getTotalLevel(virtual: boolean = false): number {
    return Object.entries(this.skills).reduce(
      (total, [, experience]) => total + XpHelper.getLevel(experience || 0, virtual ? this.maxVirtualLevel : this.maxLevel),
      0
    );
  }

  getSkillLevel(skill: SkillsEnum, virtual: boolean = false) : number {
    return XpHelper.getLevel(this.getSkillExperience(skill), virtual ? this.maxVirtualLevel : this.maxLevel);
  }

  getSkillExperience(skill: SkillsEnum) : number {
    return this.skills[skill] ?? 0;
  }

  setSkillExperience(skill: SkillsEnum, experience: number) : number {
    return this.skills[skill] = Math.min(experience, this.maxExperience);
  }

  addSkillExperience(skill: SkillsEnum, experience: number) : number {
    return this.setSkillExperience(skill, Math.min(this.getSkillExperience(skill) + experience, this.maxExperience));
  }

  getTotalExperience(): number {
    return Object.entries(this.skills).reduce((total, [, experience]) => {
      return total + (experience || 0);
    }, 0);
  }

  clone(): Skills {
    const clonedSkills = new Skills();
    clonedSkills.skills = { ...this.skills };
    return clonedSkills;
  }
}