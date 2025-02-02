import { customAlphabet } from 'nanoid';
import { PlayerState } from './playerState';
import { Effect } from '@/models/effect';
import { JsonHelper } from '@/utils/jsonHelper';
import { EffectFactory } from './effectFactory';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

export class Step {
  id: string = nanoid();
  upToDate: boolean = false;
  resultingState: PlayerState | undefined;
  description: string = '';
  effects: Effect[] = [];
  completed: boolean = false;

  constructor(description: string = '') {
    this.description = description;
  }

  invalidate(): void {
    this.upToDate = false;
    this.resultingState = undefined;
  }

  addEffect(effect: Effect) {
    // Merge similar effects together
    for (const existingEffect of this.effects) {
      if(existingEffect.canMergeWith(effect)) {
        existingEffect.mergeWith(effect);
        return;
      }
    }
    // Add the effect otherwise
    this.effects.push(effect);
  }

  removeEffect(effect: Effect) {
    const effectIndex = this.effects.indexOf(effect);
    if (effectIndex >= 0)
      this.effects.splice(effectIndex, 1);
  }

  applyEffects(playerState: PlayerState) {
    for (const effect of this.effects) {
      effect.apply(playerState);
    }
  }

  toJSON() {
    return { description: this.description, effects: this.effects.map(e => e.toJSON()), completed: this.completed };
  }

  static fromJSON(jsonObject: Record<string, any>): Step {
    const parsedStep = JsonHelper.parseWithSchema<Step>('Step', jsonObject);
    const step = new Step(parsedStep.description);
    Object.assign(step, parsedStep);
    for (let i = 0; i < step.effects.length; i++)
      step.effects[i] = EffectFactory.fromJSON(step.effects[i]);   
    return step;
  }
}

export class LabeledStep extends Step {
  label: string;
  depth: number;
  path: number[];

  constructor(step: Step, path: number[]) {
    super(step.description);
    Object.assign(step, this);
    this.path = path;
    this.label = path.join('.');
    this.depth = path.length - 1;
  }
};