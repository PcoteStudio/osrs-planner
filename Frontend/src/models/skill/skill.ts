import type { SkillsEnum } from '@/models/skill/skillsEnum';
import { getSkillStyle } from '@/models/skill/skillsEnum';

export class Skill {
    type: SkillsEnum;
    icon: string;
    bgColor: string;
    textColor: string;
    order: number;
    experience: number;

    constructor(type: SkillsEnum, experience: number) {
        this.type = type;
        this.experience = experience;

        const properties = getSkillStyle(type);
        this.icon = properties.icon || '';
        this.bgColor = properties.bgColor;
        this.textColor = properties.textColor;
        this.order = properties.order;
    }
}