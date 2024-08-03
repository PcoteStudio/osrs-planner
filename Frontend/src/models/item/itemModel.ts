import type { EquipmentSlotTypes } from './equipmentSlotModel';

const itemsDb: { [id: number]: ItemModel } = {};

export class ItemModel {
    id: number;
    name: string;
    bankable: boolean;
    stackable: boolean;
    notable: boolean;
    equipmentSlot: EquipmentSlotTypes;
    value: number;
    imageUrl: string;
    wikiUrl: string;

    static get(itemId: number): ItemModel {
        return itemsDb[itemId];
    }

    static set(item: ItemModel): void {
        itemsDb[item.id] = item;
    }

    static clear(): void {
        for (const itemId in itemsDb)
            delete itemsDb[itemId];
    }
}