import { describe, it } from 'vitest';
import { Route } from '@/models/route';
import { Step } from '@/models/step';
import { SkillEffect } from '@/models/skill/skillEffect';
import { SkillsEnum } from '@/models/skill/skillsEnum';
import type { StepNode } from '@/models/stepTreeNode';

describe('Route performance test', () => {
  it('generate and execute massive route with 200 000 steps', () => {
    const route = new Route();
    let lastNode: StepNode | undefined;
    const timestampStart = performance.now();
    for (let i = 0; i < 200_000; i++) {
      const step = new Step(i.toString());
      const skillKeys = Object.keys(SkillsEnum) as Array<keyof typeof SkillsEnum>;
      const skill = SkillsEnum[skillKeys[i % skillKeys.length]];
      step.addEffect(new SkillEffect(skill, i % 1000));
      lastNode = route.addStep(step, lastNode);
    }
    const timestampBuilt = performance.now();
    route.setCurrentNode(lastNode!);
    const timestampExecuted1 = performance.now();
    route.setCurrentNode(route.getFirstNode());
    const timestampExecuted2 = performance.now();
    route.setCurrentNode(lastNode!);
    const timestampExecuted3 = performance.now();
    route.getLastNode();
    const timestampLastNode = performance.now();

    const duration = (start: number, end: number) => ((end - start) / 1000).toPrecision(4);
    console.log(`Build tree:\t${duration(timestampStart, timestampBuilt)} s`);
    console.log(`Exec last:\t${duration(timestampBuilt, timestampExecuted1)} s`);
    console.log(`Exec first:\t${duration(timestampExecuted1, timestampExecuted2)} s`);
    console.log(`Exec last:\t${duration(timestampExecuted2, timestampExecuted3)} s`);
    console.log(`Get last:\t${duration(timestampExecuted3, timestampLastNode)} s`);
  });
});