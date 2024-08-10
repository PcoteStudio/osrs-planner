import { Effect, EffectTypeEnum } from './effect';

export abstract class CompletionEffect extends Effect {
    constructor(type: EffectTypeEnum, public name: string, public autocompleted: boolean) {
        super(type);
    }
}