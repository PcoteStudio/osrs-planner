const uselessVariable = typeof (1 as any);
type validType = typeof uselessVariable;
type classType = { prototype: { constructor: { name: string } } };

export function validateEnumProperty(classType: classType | string, jsonObject: any, key: string, expectedEnumType: any) {
    if (!Object.values(expectedEnumType).includes(jsonObject[key]))
        throw new Error(`EnumParsingError: Expected ${typeof classType === 'string' ? classType : classType.prototype.constructor.name}.${key} `
            + `to be member of [${Object.keys(expectedEnumType).join(', ')}], but found '${jsonObject[key]}' instead`);
}

export function validatePropertyType(classType: classType | string, jsonObject: any, key: string, expectedType: validType) {
    if (typeof jsonObject[key] !== expectedType)
        throw new Error(`TypeParsingError: Expected ${typeof classType === 'string' ? classType : classType.prototype.constructor.name}.${key} `
            + `to be of type '${expectedType}', but found '${jsonObject[key]}' of type '${typeof jsonObject[key]}' instead`);
}

export function validatePropertyIterability(classType: classType | string, jsonObject: any, key: string) {
    if (!jsonObject[key] || typeof jsonObject[key] === 'string' || !jsonObject[key][Symbol.iterator])
        throw new Error(`IterableParsingError: Expected ${typeof classType === 'string' ? classType : classType.prototype.constructor.name}.${key} `
            + `to be iterable, but found '${jsonObject[key]}' of type '${typeof jsonObject[key]}' instead`);
}