import { Effect } from './effect';

export abstract class CompletionEffect extends Effect {
    constructor(public name: string, public autocompleted: boolean) {
        super();
    }
}