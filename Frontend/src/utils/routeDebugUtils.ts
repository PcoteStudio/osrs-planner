import type { Route } from '@/models/route';
import { SkillEffect } from '@/models/skill/skillEffect';
import { SkillsEnum } from '@/models/skill/skillsEnum';
import { Step } from '@/models/step';

export function initializeSomeSteps(route: Route) {
  let step = new Step('Vu la restriction que nous constatons, je n\'exclus pas de caractériser systématiquement les décisions évidentes, parce que la nature a horreur du vide. Si vous voulez mon avis concernant cette rigueur contextuelle, nous sommes contraints de prendre en considération la plus grande partie des synergies déclinables, pour longtemps.');
  step.addEffect(new SkillEffect(SkillsEnum.Agility, 100));
  step.addEffect(new SkillEffect(SkillsEnum.Attack, 100));
  step.addEffect(new SkillEffect(SkillsEnum.Construction, 100));
  step.addEffect(new SkillEffect(SkillsEnum.Cooking, 100));
  step.addEffect(new SkillEffect(SkillsEnum.Crafting, 100));
  step.addEffect(new SkillEffect(SkillsEnum.Defence, 100));
  step.addEffect(new SkillEffect(SkillsEnum.Farming, 100));
  step.addEffect(new SkillEffect(SkillsEnum.Firemaking, 100));
  step.addEffect(new SkillEffect(SkillsEnum.Fishing, 100));
  step.addEffect(new SkillEffect(SkillsEnum.Fletching, 100));
  step.addEffect(new SkillEffect(SkillsEnum.Herblore, 100));
  step.addEffect(new SkillEffect(SkillsEnum.Hitpoints, 100));
  step.addEffect(new SkillEffect(SkillsEnum.Hunter, 100));
  step.addEffect(new SkillEffect(SkillsEnum.Magic, 100));
  step.addEffect(new SkillEffect(SkillsEnum.Mining, 100));
  step.addEffect(new SkillEffect(SkillsEnum.Prayer, 100));
  step.addEffect(new SkillEffect(SkillsEnum.Ranged, 100));
  step.addEffect(new SkillEffect(SkillsEnum.Runecraft, 100));
  step.addEffect(new SkillEffect(SkillsEnum.Slayer, 100));
  step.addEffect(new SkillEffect(SkillsEnum.Smithing, 100));
  step.addEffect(new SkillEffect(SkillsEnum.Strength, 100));
  step.addEffect(new SkillEffect(SkillsEnum.Thieving, 100));
  step.addEffect(new SkillEffect(SkillsEnum.Woodcutting, 100));
  step.completed = true;
  route.addStep(step, [2]);

  step = new Step('I am another top step');
  step.addEffect(new SkillEffect(SkillsEnum.Herblore, 300));
  route.addStep(step, [3]);

  step = new Step('En ce qui concerne la restriction actuelle, on ne peut se passer d\'imaginer chacune des modalités opportunes, à court terme.');
  step.addEffect(new SkillEffect(SkillsEnum.Attack, 2000));
  route.addStep(step, [3.1]);

  step = new Step('I am another child step');
  step.addEffect(new SkillEffect(SkillsEnum.Defence, 1500));
  route.addStep(step, [3.2]);

  step = new Step('I am a grand-child step');
  step.addEffect(new SkillEffect(SkillsEnum.Fishing, 30000));
  route.addStep(step, [3,2,1]);

  step = new Step('I am a grand-child step');
  step.addEffect(new SkillEffect(SkillsEnum.Fishing, 30000));
  route.addStep(step, [3,2,1]);

  step = new Step('I am a grand-child step');
  step.addEffect(new SkillEffect(SkillsEnum.Fishing, 30000));
  route.addStep(step, [3,2,2]);

  step = new Step('I am a just a child step');
  step.addEffect(new SkillEffect(SkillsEnum.Mining, 2000));
  route.addStep(step, [3,2]);

  step = new Step('I am a but a meager top step');
  step.addEffect(new SkillEffect(SkillsEnum.Farming, 50000));
  route.addStep(step, [4]);

  step = new Step('I am the last top step');
  step.addEffect(new SkillEffect(SkillsEnum.Smithing, 500));
  route.addStep(step, [5]);

  step = new Step('I am the last top step');
  step.addEffect(new SkillEffect(SkillsEnum.Smithing, 500));
  route.addStep(step, [6]);

  step = new Step('I am the last top step');
  step.addEffect(new SkillEffect(SkillsEnum.Smithing, 500));
  route.addStep(step, [7]);

  step = new Step('I am the last top step');
  step.addEffect(new SkillEffect(SkillsEnum.Smithing, 500));
  route.addStep(step, [8]);
}