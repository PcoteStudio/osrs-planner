import { toEquipmentSlot, type EquipmentSlotTypes } from './equipmentSlot';
import type { ScrapedItem } from '@/scrapedModels/scrapedItem';
import { JsonHelper } from '@/utils/jsonHelper';

export class Item {
  bankable: boolean = true;
  cost: number = 0;
  lowAlch: number | undefined;
  highAlch: number | undefined;
  members: boolean = true;
  tradeable: boolean = false;
  geTradeable: boolean = false;
  stackable: boolean = false;
  stackSize: number = 1;
  maxStack: number = 2_147_483_647;
  noted: boolean = false;
  notable: boolean = false;
  linkedItemId: number | undefined;
  linkedItem: Item | undefined;
  linkedNotedId: number | undefined;
  linkedNoted: Item | undefined;
  linkedPlaceholderId: number | undefined;
  linkedPlaceholder: Item | undefined;
  linkedStackedItems: Item[] = [];
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

  toString(includeId = false): string {
    return `${this.name}${this.noted ? ' (noted)': ''}${includeId ? ` [${this.id}]`: ''}`;
  }

  static getItemByStackSize(item: Item, quantity: number) {
    if(item.noted || !item.stackable) return item;
    const baseItem = item.linkedItem ?? item;
    const variations = baseItem.linkedStackedItems;
    if(!variations.length) return baseItem;
    let currentItem = baseItem;
    for (const v of variations)
      if (v.stackSize > currentItem.stackSize && v.stackSize <= quantity)
        currentItem = v;
    return currentItem;
  }

  static fromJSON(jsonObject: { [key: string]: unknown }): Item {
    const parsedItem = JsonHelper.parseWithSchema<ScrapedItem>('ScrapedItem', jsonObject);

    const item = new Item(parsedItem.id, parsedItem.name);
    item.bankable = parsedItem.bankable ?? item.bankable;
    item.wikiUrl = parsedItem.wiki_url ?? item.wikiUrl;
    item.imageUrl = parsedItem.icon ? `data:image/png;base64, ${parsedItem.icon}` : item.imageUrl;
    item.cost = parsedItem.cost ?? item.cost;
    item.lowAlch = parsedItem.lowalch ?? item.lowAlch;
    item.highAlch = parsedItem.highalch ?? item.highAlch;
    item.members = parsedItem.members ?? item.members;
    item.tradeable = parsedItem.tradeable ?? item.tradeable;
    item.geTradeable = parsedItem.tradeable_on_ge ?? item.geTradeable;
    item.stackable = parsedItem.stackable ?? item.stackable;
    item.stackSize = parsedItem.stacked ?? item.stackSize;
    if(!item.stackable) item.maxStack = 1;
    item.noted = parsedItem.noted ?? item.noted;
    item.notable = parsedItem.noteable ?? item.notable;
    item.linkedItemId = parsedItem.linked_id_item ?? item.linkedItemId;
    item.linkedNotedId = parsedItem.linked_id_noted ?? item.linkedNotedId;
    item.linkedPlaceholderId = parsedItem.linked_id_placeholder ?? item.linkedPlaceholderId;
    item.isPlaceholder = parsedItem.placeholder ?? item.isPlaceholder;
    item.equipable = parsedItem.equipable_by_player ?? item.equipable;
    item.duplicated = parsedItem.duplicate ?? item.duplicated;
    item.equipmentSlot = toEquipmentSlot(parsedItem.slot);
    return item;
  }
}