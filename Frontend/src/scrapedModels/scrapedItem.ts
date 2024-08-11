export type ScrapedItem = {
    id: number;
    name: string;
    bankable: boolean;
    wiki_url: string;
    icon: string;
    cost: number;
    lowalch?: number;
    highalch?: number;
    members: boolean;
    tradeable: boolean;
    tradeable_on_ge: boolean
    stackable: boolean;
    stacked?: number;
    noted: boolean;
    noteable: boolean;
    linked_id_item?: number;
    linked_id_noted?: number;
    linked_id_placeholder?: number;
    placeholder: boolean;
    equipable_by_player: boolean;
    duplicate: boolean;
}