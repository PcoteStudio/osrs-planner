import type { EffectEntity } from './effectEntity';
import type { SkillsEnum } from '@/models/skill/skillsEnum';

export type SkillEffectEntity = EffectEntity & {
  skill: SkillsEnum,
  experience: number
}