import { Item } from './item';

export class ItemStore {
  static items: { [id: number]: Item } = {};

  static addItem(item: Item) {
    if (ItemStore.getItem(item.id))
      throw new Error(`Cannot add this item. An item with the same ID already exists. ${JSON.stringify(item)}`);
    ItemStore.items[item.id] = item;
  }

  static removeItem(id: number) {
    if (ItemStore.getItem(id))
      delete ItemStore.items[id];
  }

  static getItem(id: number): Item | undefined {
    return ItemStore.items[id];
  }

  static clear() {
    this.items = {};
  }

  static fromJSON(jsonObject: { [key: string]: any }, bannedItemIds: number[] = []): { [id: number]: Item } {
    const items: { [id: number]: Item } = {};
    for (const [, value] of Object.entries(jsonObject)) {
      const item = Item.fromJSON(value);
      items[item.id] = item;
    }
    Object.values(items).forEach((item) => {
      if (item.linkedItemId !== undefined) {
        item.linkedItem = items[item.linkedItemId];
        item.linkedItem.linkedStackedItems.push(item);
      }
      if (item.linkedNotedId !== undefined)
        item.linkedNoted = items[item.linkedNotedId];
      if (item.linkedPlaceholderId !== undefined)
        item.linkedPlaceholder = items[item.linkedPlaceholderId];
    });
    for (const id of bannedItemIds)
      delete items[id];
    return items;
  }
}