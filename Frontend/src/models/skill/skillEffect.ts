import { Effect } from "../effect";
import { PlayerState } from "../playerState";
import { StateWarning } from "../stateWarning";
import { Skills } from "./skills";

export class SkillEffect extends Effect {
    constructor(private skill: Skills, private experience: number) {
        super();
    }

    public apply(playerState: PlayerState): StateWarning {
        playerState.skills[this.skill] += this.experience;
        return undefined;
    }
}