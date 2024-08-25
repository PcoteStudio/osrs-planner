import { Bank } from './item/bank';
import { Equipment } from './item/equipment';
import { Inventory } from './item/inventory';
import { Skills } from './skill/skills';
import { StateWarning } from './stateWarning';

export class PlayerState {
  skills: Skills = new Skills();
  inventory: Inventory = new Inventory(28);
  equipment: Equipment = new Equipment();
  bank: Bank = new Bank();
  warnings: StateWarning[] = [];

  constructor() {

  }

  addWarnings(...warnings: StateWarning[]) {
    if (!warnings || !warnings.length) return;
    this.warnings.push(...warnings);
  }

  clone(): PlayerState {
    const clonedState = new PlayerState;
    clonedState.skills = this.skills.clone();
    clonedState.inventory = this.inventory.clone();
    clonedState.equipment = this.equipment.clone();
    clonedState.bank = this.bank.clone();
    return clonedState;
  }
}