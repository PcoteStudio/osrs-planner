import { Bank } from './item/bank';
import { Equipment } from './item/equipment';
import { Inventory } from './item/inventory';
import { SkillsEnum } from './skill/skillsEnum';
import { XpHelper } from './skill/xpHelper';
import { StateWarning } from './stateWarning';

export class PlayerState {
    skills: { [skill in SkillsEnum as string]?: number } = {};
    inventory: Inventory = new Inventory(28);
    equipment: Equipment = new Equipment();
    bank: Bank = new Bank();
    warnings: StateWarning[] = [];

    constructor() {
        for (const skill of Object.values(SkillsEnum))
            this.skills[skill] = 0;
        this.skills[SkillsEnum.Hitpoints] = 1154;
    }

    addWarning(warning: StateWarning | undefined) {
        if (warning instanceof StateWarning) this.warnings.push(warning);
    }

    getTotalLevel(): number {
        return Object.entries(this.skills).reduce(
            (total, [, experience]) => total + XpHelper.getLevel(experience || 0),
            0
        );
    }

    getTotalExperience(): number {
        return Object.entries(this.skills).reduce((total, [, experience]) => {
            return total + (experience || 0);
        }, 0);
    }

    clone(): PlayerState {
        const newState = new PlayerState;
        newState.skills = { ...this.skills };
        // TODO clone inventory/equipment/skills
        return newState;
    }
}