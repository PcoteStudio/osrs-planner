import { EffectModel } from './effectModel';

export abstract class CompletionEffectModel extends EffectModel {
    constructor(public name: string, public autocompleted: boolean) {
        super();
    }
}