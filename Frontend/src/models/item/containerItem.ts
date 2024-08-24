import type { Item } from './item';

export type ContainerItem = {
    readonly item: Item,
    readonly quantity: number
}