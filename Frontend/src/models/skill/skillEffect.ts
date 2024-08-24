import { JsonHelper } from '@/utils/jsonHelper';
import { Effect, EffectTypeEnum } from '@/models/effect';
import { PlayerState } from '@/models/playerState';
import { StateWarning } from '@/models/stateWarning';
import { SkillsEnum } from './skillsEnum';

export class SkillEffect extends Effect {
  constructor(public skill: SkillsEnum, public experience: number) {
    super(EffectTypeEnum.Skill);
  }

  public apply(playerState: PlayerState): StateWarning | undefined {
    const currentXp = playerState.skills[this.skill] ?? 0;
    playerState.skills[this.skill] = currentXp + this.experience;
    return undefined;
  }
  
  public canMergeWith(effect: Effect): boolean {
    if(effect.type !== EffectTypeEnum.Skill || !(effect instanceof SkillEffect)) 
      return false;
    return (effect as SkillEffect).skill === this.skill;
  }

  public mergeWith(effect: Effect): void {
    if(!this.canMergeWith(effect))
      throw new Error('Incompatible effects cannot be merged together');
    this.experience += (effect as SkillEffect).experience;
  }

  public toString(): string[] {
    return [`${SkillsEnum[this.skill]}: ${this.experience >= 0 ? '+' : '-'}${this.experience} XP`];
  }

  public toJSON(): object {
    return { ...super.toJSON(), skill: this.skill.toString(), experience: this.experience };
  }

  public static fromJSON(jsonObject: { [key: string]: any }): SkillEffect {
    const parsedSkillEffect = JsonHelper.parseWithSchema<SkillEffect>('SkillEffect', jsonObject);
    return new SkillEffect(parsedSkillEffect.skill, parsedSkillEffect.experience);
  }
}