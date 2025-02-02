import { JsonHelper } from '@/utils/jsonHelper';
import { Effect, EffectTypeEnum } from '@/models/effect';
import { PlayerState } from '@/models/playerState';
import { SkillsEnum } from './skillsEnum';
import type { SkillEffectEntity } from '@/entities/skillEffectEntity';

export class SkillEffect extends Effect {
  constructor(public skill: SkillsEnum, public experience: number) {
    super(EffectTypeEnum.Skill);
  }

  public apply(playerState: PlayerState): void {
    playerState.skills.addSkillExperience(this.skill, this.experience);
  }
  
  public canMergeWith(effect: Effect): effect is SkillEffect {
    if(effect.type !== EffectTypeEnum.Skill || !(effect instanceof SkillEffect)) 
      return false;
    return effect.skill === this.skill;
  }

  public mergeWith(effect: Effect): asserts effect is SkillEffect {
    if(!this.canMergeWith(effect))
      throw new Error('Incompatible effects cannot be merged together');
    this.experience += effect.experience;
  }

  public toString(): string {
    return `${SkillsEnum[this.skill]}: ${this.experience >= 0 ? '+' : ''}${this.experience} XP`;
  }

  public toJSON(): SkillEffectEntity {
    return { ...super.toJSON(), skill: this.skill, experience: this.experience };
  }

  public static fromJSON(jsonObject: Record<string, any>): SkillEffect {
    const parsedSkillEffect = JsonHelper.parseWithSchema<SkillEffect>('SkillEffect', jsonObject);
    return new SkillEffect(parsedSkillEffect.skill, parsedSkillEffect.experience);
  }
}