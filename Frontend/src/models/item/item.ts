import { validatePropertyType } from '@/utils/parsingValidators';
import type { EquipmentSlotTypes } from './equipmentSlot';
import { Ajv } from 'ajv';
import * as schemas from '../../scrapedModels/generatedSchemas.json';
import type { ScrapedItem } from '@/scrapedModels/scrapedItem';

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

    static fromJSON(jsonObject: { [key: string]: any }): Item {
        const ajv = new Ajv();
        const validate = ajv.compile(schemas.definitions.ScrapedItem);
        const valid = validate(jsonObject);
        if (!valid) throw new Error(validate.errors?.reduce((output, error) => `${output + JSON.stringify(error.schemaPath)} ${error.message}\n`, ''));
        jsonObject = jsonObject as ScrapedItem;

        validatePropertyType(Item, jsonObject, 'id', 'number');
        validatePropertyType(Item, jsonObject, 'name', 'string');
        const item = new Item(jsonObject.id, jsonObject.name);
        item.bankable = jsonObject.bankable ?? item.bankable;
        validatePropertyType(Item, jsonObject, 'wiki_url', 'string', 'undefined');
        item.wikiUrl = jsonObject.wiki_url ?? item.wikiUrl;
        validatePropertyType(Item, jsonObject, 'icon', 'string', 'undefined');
        item.imageUrl = jsonObject.icon ? `data:image/png;base64, ${jsonObject.icon}` : item.imageUrl;
        validatePropertyType(Item, jsonObject, 'cost', 'number', 'undefined');
        item.cost = jsonObject.cost ?? item.cost;
        validatePropertyType(Item, jsonObject, 'lowalch', 'number', 'undefined');
        item.lowAlch = jsonObject.lowalch ?? item.lowAlch;
        validatePropertyType(Item, jsonObject, 'highalch', 'number', 'undefined');
        item.highAlch = jsonObject.highalch ?? item.highAlch;
        validatePropertyType(Item, jsonObject, 'members', 'boolean', 'undefined');
        item.members = jsonObject.members ?? item.members;
        validatePropertyType(Item, jsonObject, 'tradeable', 'boolean', 'undefined');
        item.tradeable = jsonObject.tradeable ?? item.tradeable;
        validatePropertyType(Item, jsonObject, 'geTradeable', 'boolean', 'undefined');
        item.geTradeable = jsonObject.tradeable_on_ge ?? item.geTradeable;
        validatePropertyType(Item, jsonObject, 'stackable', 'boolean', 'undefined');
        item.stackable = jsonObject.stackable ?? item.stackable;
        validatePropertyType(Item, jsonObject, 'stacked', 'number', 'undefined');
        item.stackSize = jsonObject.stacked ?? item.stackSize;
        validatePropertyType(Item, jsonObject, 'noted', 'boolean', 'undefined');
        item.noted = jsonObject.noted ?? item.noted;
        validatePropertyType(Item, jsonObject, 'notable', 'boolean', 'undefined');
        item.noteable = jsonObject.noteable ?? item.noteable;
        validatePropertyType(Item, jsonObject, 'linked_id_item', 'number', 'undefined');
        item.linkedItemId = jsonObject.linked_id_item ?? item.linkedItemId;
        validatePropertyType(Item, jsonObject, 'linked_id_noted', 'number', 'undefined');
        item.linkedNotedId = jsonObject.linked_id_noted ?? item.linkedNotedId;
        validatePropertyType(Item, jsonObject, 'linked_id_placeholder', 'number', 'undefined');
        item.linkedPlaceholderId = jsonObject.linked_id_placeholder ?? item.linkedPlaceholderId;
        validatePropertyType(Item, jsonObject, 'placeholder', 'boolean', 'undefined');
        item.isPlaceholder = jsonObject.placeholder ?? item.isPlaceholder;
        validatePropertyType(Item, jsonObject, 'equipable_by_player', 'boolean', 'undefined');
        item.equipable = jsonObject.equipable_by_player ?? item.equipable;
        validatePropertyType(Item, jsonObject, 'duplicate', 'boolean', 'undefined');
        item.duplicated = jsonObject.duplicate ?? item.duplicated;
        return item;
    }
}