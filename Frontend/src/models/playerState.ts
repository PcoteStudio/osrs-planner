import { Bank } from './item/bank';
import { Equipment } from './item/equipment';
import { Inventory } from './item/inventory';
import { SkillsEnum } from './skill/skillsEnum';
import { XpTable } from './skill/xpTable';
import { StateWarning } from './stateWarning';

export class PlayerState {
    skills: { [skill in SkillsEnum as string]?: number } = {};
    inventory: Inventory = new Inventory(28);
    equipment: Equipment = new Equipment();
    bank: Bank = new Bank();
    warnings: StateWarning[] = [];

    constructor() {
        // TODO Load from JSON
        for (const skill in Object.keys(SkillsEnum)) {
            if (typeof skill == 'number')
                this.skills[skill] = 1;
        }
    }

    addWarning(warning: StateWarning | undefined) {
        if (warning instanceof StateWarning) this.warnings.push(warning);
    }

    getTotalLevel(): number {
        const xpTable = new XpTable(99); // TODO move table to static util
        return Object.entries(this.skills).reduce((total, [, experience]) => {
            return total + xpTable.getLevel(experience || 0);
        }, 0);
    }

    getTotalExperience(): number {
        return Object.entries(this.skills).reduce((total, [, experience]) => {
            return total + (experience || 0);
        }, 0);
    }

    clone(): PlayerState {
        throw new Error('Method not implemented.');
    }
}