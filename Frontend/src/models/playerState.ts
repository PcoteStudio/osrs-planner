import { Bank } from './item/bank';
import { Equipment } from './item/equipment';
import { Inventory } from './item/inventory';
import { SkillsEnum } from './skill/skillsEnum';
import { StateWarning } from './stateWarning';

export class PlayerState {
    skills: { [skill in SkillsEnum as string]?: number } = {};
    inventory: Inventory = new Inventory(28);
    equipment: Equipment = new Equipment();
    bank: Bank = new Bank();
    warnings: StateWarning[] = [];

    constructor() {
        // TODO Load from JSON
        Object.keys(SkillsEnum).forEach((skill) => {
            this.skills[skill] = 0;
        });
        this.skills[SkillsEnum.Hitpoints] = 1154;
    }

    addWarning(warning: StateWarning | undefined) {
        if (warning instanceof StateWarning) this.warnings.push(warning);
    }

    clone(): PlayerState {
        throw new Error('Method not implemented.');
    }
}