import { validateEnumProperty, validatePropertyType } from '@/utils/parsingValidators';
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

    public toString(): string[] {
        return [`${SkillsEnum[this.skill]}: ${this.experience >= 0 ? '+' : '-'}${this.experience} XP`];
    }

    public toJSON(): object {
        return { ...super.toJSON(), skill: this.skill.toString(), experience: this.experience };
    }

    public static fromJSON(jsonObject: { [key: string]: any }): SkillEffect {
        validateEnumProperty(SkillEffect, jsonObject, 'skill', SkillsEnum);
        validatePropertyType(SkillEffect, jsonObject, 'experience', 'number');
        const skill = SkillsEnum[jsonObject.skill as SkillsEnum];
        return new SkillEffect(skill, jsonObject.experience);
    }
}