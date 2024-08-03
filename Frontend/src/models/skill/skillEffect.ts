import { Effect } from '../effect';
import { PlayerState } from '../playerState';
import { StateWarning } from '../stateWarning';
import { Skills } from './skills';

export class SkillEffect extends Effect {
    constructor(public skill: Skills, public experience: number) {
        super();
    }

    public apply(playerState: PlayerState): StateWarning | undefined {
        const currentXp = playerState.skills[this.skill] ?? 0;
        playerState.skills[this.skill] = currentXp + this.experience;
        return undefined;
    }

    public toString(): string[] {
        return [`${Skills[this.skill]}: ${this.experience >= 0 ? '+' : '-'}${this.experience} XP`];
    }
}