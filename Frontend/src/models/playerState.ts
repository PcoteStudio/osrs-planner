import { Skills } from "./skill/skills";

export class PlayerState {
    skills: { [skill in Skills]?: number } = {};

    constructor() {
        // TODO Load from JSON
        Object.keys(Skills).forEach((skill) => {
            this.skills[skill] = 1;
        });
        this.skills[Skills.Hitpoints] = 1154;
    }

    clone(): PlayerState {
        throw new Error("Method not implemented.");
    }
}