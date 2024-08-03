import { BankModel } from './item/bankModel';
import { EquipmentModel } from './item/equipmentModel';
import { InventoryModel } from './item/inventoryModel';
import { SkillsModel } from './skill/skillsModel';
import { StateWarningModel } from './stateWarningModel';

export class PlayerStateModel {
    skills: { [skill in SkillsModel as string]?: number } = {};
    inventory: InventoryModel = new InventoryModel(28);
    equipment: EquipmentModel = new EquipmentModel();
    bank: BankModel = new BankModel();
    warnings: StateWarningModel[] = [];

    constructor() {
        // TODO Load from JSON
        Object.keys(SkillsModel).forEach((skill) => {
            this.skills[skill] = 1;
        });
        this.skills[SkillsModel.Hitpoints] = 1154;
    }

    addWarning(warning: StateWarningModel | undefined) {
        if (warning instanceof StateWarningModel) this.warnings.push(warning);
    }

    clone(): PlayerStateModel {
        throw new Error('Method not implemented.');
    }
}