import { Item } from './item';

export class ItemStore {
  static items: { [id: number]: Item } = {};

  static fromJSON(jsonObject: { [key: string]: any }): { [id: number]: Item } {
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
    return items;
  }
}