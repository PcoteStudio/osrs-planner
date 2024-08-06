import { Effect, EffectTypeEnum } from '../effect';
import { PlayerState } from '../playerState';
import { StateWarning } from '../stateWarning';
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

    public static override fromJSON(jsonObject: any): SkillEffect {
        if (!jsonObject.skill)
            throw new Error(`Invalid skill value when parsing effect: ${jsonObject.skill}`);
        if (!jsonObject.experience)
            throw new Error(`Invalid experience value when parsing effect: ${jsonObject.experience}`);
        const skill = SkillsEnum[jsonObject.skill as SkillsEnum];
        return new SkillEffect(skill, jsonObject.experience);
    }
}