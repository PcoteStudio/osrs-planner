import { Bank } from "./item/bank";
import { Equipment } from "./item/equipment";
import { Inventory } from "./item/inventory";
import { Skills } from "./skill/skills";
import { StateWarning } from "./stateWarning";

export class PlayerState {
    skills: { [skill in Skills as string]?: number } = {};
    inventory: Inventory = new Inventory(28);
    equipment: Equipment = new Equipment();
    bank: Bank = new Bank();
    warnings: StateWarning[] = [];

    constructor() {
        // TODO Load from JSON
        Object.keys(Skills).forEach((skill) => {
            this.skills[skill] = 1;
        });
        this.skills[Skills.Hitpoints] = 1154;
    }

    addWarning(warning: StateWarning | undefined) {
        if (warning instanceof StateWarning) this.warnings.push(warning);
    }

    clone(): PlayerState {
        throw new Error("Method not implemented.");
    }
}