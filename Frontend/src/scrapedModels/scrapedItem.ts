import type { scrapedItemSlots } from './scrapedItemSlots';

export type ScrapedItem = {
    id: number;
    name: string;
    bankable: boolean;
    wiki_url?: string | null;
    icon: string;
    cost: number;
    lowalch?: number | null;
    highalch?: number | null;
    members: boolean;
    tradeable: boolean;
    tradeable_on_ge: boolean
    stackable: boolean;
    stacked?: number | null;
    noted: boolean;
    noteable: boolean;
    linked_id_item?: number | null;
    linked_id_noted?: number | null;
    linked_id_placeholder?: number | null;
    placeholder: boolean;
    equipable_by_player: boolean;
    duplicate: boolean;
    slot: scrapedItemSlots;
}