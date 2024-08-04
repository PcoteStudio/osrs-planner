import { BankModel } from './item/bankModel';
import { EquipmentModel } from './item/equipmentModel';
import { InventoryModel } from './item/inventoryModel';
import { SkillsEnum } from './skill/skillsEnum';
import { StateWarningModel } from './stateWarningModel';

export class PlayerStateModel {
    skills: { [skill in SkillsEnum as string]?: number } = {};
    inventory: InventoryModel = new InventoryModel(28);
    equipment: EquipmentModel = new EquipmentModel();
    bank: BankModel = new BankModel();
    warnings: StateWarningModel[] = [];

    constructor() {
        // TODO Load from JSON
        Object.keys(SkillsEnum).forEach((skill) => {
            this.skills[skill] = 1;
        });
        this.skills[SkillsEnum.Hitpoints] = 1154;
    }

    addWarning(warning: StateWarningModel | undefined) {
        if (warning instanceof StateWarningModel) this.warnings.push(warning);
    }

    clone(): PlayerStateModel {
        throw new Error('Method not implemented.');
    }
}