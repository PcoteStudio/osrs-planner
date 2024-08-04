import { EffectModel } from '../effectModel';
import { PlayerStateModel } from '../playerStateModel';
import { StateWarningModel } from '../stateWarningModel';
import { SkillsEnum } from './skillsEnum';

export class SkillEffectModel extends EffectModel {
    constructor(public skill: SkillsEnum, public experience: number) {
        super();
    }

    public apply(playerState: PlayerStateModel): StateWarningModel | undefined {
        const currentXp = playerState.skills[this.skill] ?? 0;
        playerState.skills[this.skill] = currentXp + this.experience;
        return undefined;
    }

    public toString(): string[] {
        return [`${SkillsEnum[this.skill]}: ${this.experience >= 0 ? '+' : '-'}${this.experience} XP`];
    }
}