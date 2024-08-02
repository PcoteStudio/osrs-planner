import { Effect } from "./effect";

export abstract class CompletionEffect extends Effect {
    name: string;
    autocompleted: boolean;
}