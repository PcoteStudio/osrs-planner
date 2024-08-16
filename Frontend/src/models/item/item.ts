import type { EquipmentSlotTypes } from './equipmentSlot';
import schemas from '../../generatedSchemas.json';
import type { ScrapedItem } from '@/scrapedModels/scrapedItem';
import { JsonHelper } from '@/utils/jsonHelper';

const itemsDb: { [id: number]: Item } = {};

export class Item {
    bankable: boolean = true;
    cost: number = 0;
    lowAlch: number | undefined;
    highAlch: number | undefined;
    members: boolean = true;
    tradeable: boolean = false;
    geTradeable: boolean = false;
    stackable: boolean = false;
    stackSize: number | undefined;
    noted: boolean = false;
    noteable: boolean = false;
    linkedItemId: number | undefined;
    linkedItem: Item | undefined;
    linkedNotedId: number | undefined;
    linkedNoted: Item | undefined;
    linkedPlaceholderId: number | undefined;
    linkedPlaceholder: Item | undefined;
    imageUrl: string | undefined;
    wikiUrl: string | undefined;
    isPlaceholder: boolean = false;
    equipable: boolean = false;
    equipableWeapon: boolean = false;
    duplicated: boolean = false;
    icon: string | undefined;
    equipment: undefined;
    weapon: undefined;
    equipmentSlot: EquipmentSlotTypes | undefined;

    constructor(public id: number, public name: string) {
    }

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

    static fromJSON(jsonObject: { [key: string]: unknown }): Item {
        const jsonItem = JsonHelper.parseWithSchema<ScrapedItem>(schemas.definitions.ScrapedItem, jsonObject);

        const item = new Item(jsonItem.id, jsonItem.name);
        item.bankable = jsonItem.bankable ?? item.bankable;
        item.wikiUrl = jsonItem.wiki_url ?? item.wikiUrl;
        item.imageUrl = jsonItem.icon ? `data:image/png;base64, ${jsonItem.icon}` : item.imageUrl;
        item.cost = jsonItem.cost ?? item.cost;
        item.lowAlch = jsonItem.lowalch ?? item.lowAlch;
        item.highAlch = jsonItem.highalch ?? item.highAlch;
        item.members = jsonItem.members ?? item.members;
        item.tradeable = jsonItem.tradeable ?? item.tradeable;
        item.geTradeable = jsonItem.tradeable_on_ge ?? item.geTradeable;
        item.stackable = jsonItem.stackable ?? item.stackable;
        item.stackSize = jsonItem.stacked ?? item.stackSize;
        item.noted = jsonItem.noted ?? item.noted;
        item.noteable = jsonItem.noteable ?? item.noteable;
        item.linkedItemId = jsonItem.linked_id_item ?? item.linkedItemId;
        item.linkedNotedId = jsonItem.linked_id_noted ?? item.linkedNotedId;
        item.linkedPlaceholderId = jsonItem.linked_id_placeholder ?? item.linkedPlaceholderId;
        item.isPlaceholder = jsonItem.placeholder ?? item.isPlaceholder;
        item.equipable = jsonItem.equipable_by_player ?? item.equipable;
        item.duplicated = jsonItem.duplicate ?? item.duplicated;
        return item;
    }
}