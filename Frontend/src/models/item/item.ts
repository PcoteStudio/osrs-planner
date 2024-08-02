import { EquipmentSlots } from "./equipmentSlots";

const itemsDb: { [id: number]: Item } = {};

export class Item {
    id: number;
    name: string;
    bankable: boolean;
    stackable: boolean;
    notable: boolean;
    equipmentSlot: EquipmentSlots;
    value: number;
    imageUrl: string;
    wikiUrl: string;

    static get(itemId: number): Item {
        return itemsDb[itemId];
    }

    static set(item: Item): void {
        itemsDb[item.id] = item;
    }

    static clear(): void {
        for (const itemId in itemsDb)
            delete itemsDb[itemId];
    }
}