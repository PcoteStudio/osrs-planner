export enum SkillsEnum {
    Agility,
    Attack,
    Construction,
    Cooking,
    Crafting,
    Defence,
    Farming,
    Firemaking,
    Fishing,
    Fletching,
    Herblore,
    Hitpoints,
    Hunter,
    Magic,
    Mining,
    Prayer,
    Ranged,
    Runecraft,
    Slayer,
    Smithing,
    Strength,
    Thieving,
    Woodcutting,
}

export const getSkillStyle = (skill: SkillsEnum) => {
    switch (skill) {
        case SkillsEnum.Agility:
            return {
                icon: 'https://oldschool.runescape.wiki/images/Agility_icon.png?389e0',
                bgColor: '#3939a1',
                textColor: '#fff'
            };
        case SkillsEnum.Attack:
            return {
                icon: 'https://oldschool.runescape.wiki/images/Attack_icon.png?b4bce',
                bgColor: '#b91800',
                textColor: '#fff'
            };
        case SkillsEnum.Construction:
            return {
                icon: 'https://oldschool.runescape.wiki/images/Construction_icon.png?f9bf7',
                bgColor: '#624b38',
                textColor: '#fff'
            };
        case SkillsEnum.Cooking:
            return {
                icon: 'https://oldschool.runescape.wiki/images/Cooking_icon.png?a0156',
                bgColor: '#451d4e',
                textColor: '#fff'
            };
        case SkillsEnum.Crafting:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Crafting_icon.png/21px-Crafting_icon.png?a1f71',
                bgColor: '#604a37',
                textColor: '#fff'
            };
        case SkillsEnum.Defence:
            return {
                icon: 'https://oldschool.runescape.wiki/images/Defence_icon.png?ca0cd',
                bgColor: '#546596',
                textColor: '#fff'
            };
        case SkillsEnum.Farming:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Farming_icon.png/21px-Farming_icon.png?558fa',
                bgColor: '#2a6432',
                textColor: '#fff'
            };
        case SkillsEnum.Firemaking:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Firemaking_icon.png/21px-Firemaking_icon.png?45ea0a',
                bgColor: '#c47422',
                textColor: '#fff'
            };
        case SkillsEnum.Fishing:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Fishing_icon.png/21px-Fishing_icon.png?15a98',
                bgColor: '#88b0d1',
                textColor: '#000'
            };
        case SkillsEnum.Fletching:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Fletching_icon.png/21px-Fletching_icon.png?15cda',
                bgColor: '#005c61',
                textColor: '#fff'
            };
        case SkillsEnum.Herblore:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Herblore_icon.png/21px-Herblore_icon.png?ffa9e',
                bgColor: '#00821c',
                textColor: '#fff'
            };
        case SkillsEnum.Hitpoints:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Hitpoints_icon.png/21px-Hitpoints_icon.png?a4819',
                bgColor: '#fffbee',
                textColor: '#000'
            };
        case SkillsEnum.Hunter:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Hunter_icon.png/20px-Hunter_icon.png?8762f',
                bgColor: '#807958',
                textColor: '#fff'
            };
        case SkillsEnum.Magic:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Magic_icon.png/21px-Magic_icon.png?334cf',
                bgColor: '#c7b89f',
                textColor: '#000'
            };
        case SkillsEnum.Mining:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Mining_icon.png/21px-Mining_icon.png?00870',
                bgColor: '#615f4b',
                textColor: '#fff'
            };
        case SkillsEnum.Prayer:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Prayer_icon.png/21px-Prayer_icon.png?ca0dc',
                bgColor: '#fff',
                textColor: '#000'
            };
        case SkillsEnum.Ranged:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Ranged_icon.png/21px-Ranged_icon.png?01b0e',
                bgColor: '#658226',
                textColor: '#fff'
            };
        case SkillsEnum.Runecraft:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Runecraft_icon.png/21px-Runecraft_icon.png?c278c',
                bgColor: '#c4c4b5',
                textColor: '#000'
            };
        case SkillsEnum.Slayer:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Slayer_icon.png/20px-Slayer_icon.png?cd34f',
                bgColor: '#1a1818',
                textColor: '#fff'
            };
        case SkillsEnum.Smithing:
            return {
                icon: 'https://oldschool.runescape.wiki/images/Smithing_icon.png?d26c5',
                bgColor: '#47473b',
                textColor: '#fff'
            };
        case SkillsEnum.Strength:
            return {
                icon: 'https://oldschool.runescape.wiki/images/Strength_icon.png?e6e0c',
                bgColor: '#006645',
                textColor: '#fff'
            };
        case SkillsEnum.Thieving:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Thieving_icon.png/21px-Thieving_icon.png?973fe',
                bgColor: '#72425e',
                textColor: '#fff'
            };
        case SkillsEnum.Woodcutting:
            return {
                icon: 'https://oldschool.runescape.wiki/images/thumb/Woodcutting_icon.png/17px-Woodcutting_icon.png?6ead4',
                bgColor: '#7c653c',
                textColor: '#fff'
            };
        default:
            return {
                bgColor: '#5e5e5e',
                textColor: '#fff'
            };
    }
}