import type { Item } from './item';

export class ContainerItem {
    constructor(public item: Item, public quantity: number, public noted: boolean = false) {
    }
}