export enum SkillsEnum {
    Agility = 'Agility',
    Attack = 'Attack',
    Construction = 'Construction',
    Cooking = 'Cooking',
    Crafting = 'Crafting',
    Defence = 'Defence',
    Farming = 'Farming',
    Firemaking = 'Firemaking',
    Fishing = 'Fishing',
    Fletching = 'Fletching',
    Herblore = 'Herblore',
    Hitpoints = 'Hitpoints',
    Hunter = 'Hunter',
    Magic = 'Magic',
    Mining = 'Mining',
    Prayer = 'Prayer',
    Ranged = 'Ranged',
    Runecraft = 'Runecraft',
    Slayer = 'Slayer',
    Smithing = 'Smithing',
    Strength = 'Strength',
    Thieving = 'Thieving',
    Woodcutting = 'Woodcutting',
}

export const getSkillStyle = (skill: SkillsEnum) => {
    switch (skill) {
        case SkillsEnum.Agility:
            return {
                icon: 'https://oldschool.runescape.wiki/images/Agility_icon.png?389e0',
                bgColor: '#3939a1',
                textColor: '#fff',
                order: 5,
            };
        case SkillsEnum.Attack:
            return {
                icon: 'https://oldschool.runescape.wiki/images/Attack_icon.png?b4bce',
                bgColor: '#b91800',
                textColor: '#fff',
                order: 1,
            };
        case SkillsEnum.Construction:
            return {
                icon: 'https://oldschool.runescape.wiki/images/Construction_icon.png?f9bf7',
                bgColor: '#624b38',
                textColor: '#fff',
                order: 22
            };
        case SkillsEnum.Cooking:
            return {
                icon: 'https://oldschool.runescape.wiki/images/Cooking_icon.png?a0156',
                bgColor: '#451d4e',
                textColor: '#fff',
                order: 12
            };
        case SkillsEnum.Crafting:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Crafting_icon.png/21px-Crafting_icon.png?a1f71',
                bgColor: '#604a37',
                textColor: '#fff',
                order: 14
            };
        case SkillsEnum.Defence:
            return {
                icon: 'https://oldschool.runescape.wiki/images/Defence_icon.png?ca0cd',
                bgColor: '#546596',
                textColor: '#fff',
                order: 7
            };
        case SkillsEnum.Farming:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Farming_icon.png/21px-Farming_icon.png?558fa',
                bgColor: '#2a6432',
                textColor: '#fff',
                order: 21
            };
        case SkillsEnum.Firemaking:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Firemaking_icon.png/21px-Firemaking_icon.png?45ea0a',
                bgColor: '#c47422',
                textColor: '#fff',
                order: 15
            };
        case SkillsEnum.Fishing:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Fishing_icon.png/21px-Fishing_icon.png?15a98',
                bgColor: '#88b0d1',
                textColor: '#000',
                order: 9
            };
        case SkillsEnum.Fletching:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Fletching_icon.png/21px-Fletching_icon.png?15cda',
                bgColor: '#005c61',
                textColor: '#fff',
                order: 17
            };
        case SkillsEnum.Herblore:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Herblore_icon.png/21px-Herblore_icon.png?ffa9e',
                bgColor: '#00821c',
                textColor: '#fff',
                order: 8
    };
        case SkillsEnum.Hitpoints:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Hitpoints_icon.png/21px-Hitpoints_icon.png?a4819',
                bgColor: '#fffbee',
                textColor: '#000',
                order: 2,
            };
        case SkillsEnum.Hunter:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Hunter_icon.png/20px-Hunter_icon.png?8762f',
                bgColor: '#807958',
                textColor: '#fff',
                order: 23,
            };
        case SkillsEnum.Magic:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Magic_icon.png/21px-Magic_icon.png?334cf',
                bgColor: '#c7b89f',
                textColor: '#000',
                order: 16,
            };
        case SkillsEnum.Mining:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Mining_icon.png/21px-Mining_icon.png?00870',
                bgColor: '#615f4b',
                textColor: '#fff',
                order: 3,
            };
        case SkillsEnum.Prayer:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Prayer_icon.png/21px-Prayer_icon.png?ca0dc',
                bgColor: '#fff',
                textColor: '#000',
                order: 13,
            };
        case SkillsEnum.Ranged:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Ranged_icon.png/21px-Ranged_icon.png?01b0e',
                bgColor: '#658226',
                textColor: '#fff',
                order: 10,
            };
        case SkillsEnum.Runecraft:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Runecraft_icon.png/21px-Runecraft_icon.png?c278c',
                bgColor: '#c4c4b5',
                textColor: '#000',
                order: 19,
            };
        case SkillsEnum.Slayer:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Slayer_icon.png/20px-Slayer_icon.png?cd34f',
                bgColor: '#1a1818',
                textColor: '#fff',
                order: 20,
            };
        case SkillsEnum.Smithing:
            return {
                icon: 'https://oldschool.runescape.wiki/images/Smithing_icon.png?d26c5',
                bgColor: '#47473b',
                textColor: '#fff',
                order: 6,
            };
        case SkillsEnum.Strength:
            return {
                icon: 'https://oldschool.runescape.wiki/images/Strength_icon.png?e6e0c',
                bgColor: '#006645',
                textColor: '#fff',
                order: 4,
            };
        case SkillsEnum.Thieving:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Thieving_icon.png/21px-Thieving_icon.png?973fe',
                bgColor: '#72425e',
                textColor: '#fff',
                order: 11
            };
        case SkillsEnum.Woodcutting:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Woodcutting_icon.png/17px-Woodcutting_icon.png?6ead4',
                bgColor: '#7c653c',
                textColor: '#fff',
                order: 18
            };
        default:
            return {
                bgColor: '#5e5e5e',
                textColor: '#fff',
                order: 24
            };
    }
};