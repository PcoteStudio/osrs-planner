import Ajv, { type SchemaObject } from 'ajv';

const uselessVariable = typeof (1 as any);
type validType = typeof uselessVariable;
type classType = { prototype: { constructor: { name: string } } };

export class JsonHelper {
    private static readonly ajv = new Ajv();

    static parseWithSchema<T>(schema: SchemaObject, jsonObject: { [key: string]: unknown }): T {
        const validate = JsonHelper.ajv.compile(schema);
        const valid = validate(jsonObject);
        if (!valid) throw new Error(JsonHelper.ajv.errorsText(validate.errors));
        return jsonObject as T;
    }
}

export function validateEnumProperty(classType: classType | string, jsonObject: any, key: string, expectedEnumType: any) {
    if (!Object.values(expectedEnumType).includes(jsonObject[key]))
        throw new Error(`EnumParsingError: Expected ${typeof classType === 'string' ? classType : classType.prototype.constructor.name}.${key} `
            + `to be member of [${Object.keys(expectedEnumType).join(', ')}], but found '${jsonObject[key]}' instead`);
}

export function validatePropertyType(classType: classType | string, jsonObject: any, key: string, ...expectedTypes: validType[]) {
    if (!expectedTypes.includes(typeof jsonObject[key]) && !(expectedTypes.includes('undefined') && jsonObject[key] === null))
        throw new Error(`TypeParsingError: Expected ${typeof classType === 'string' ? classType : classType.prototype.constructor.name}.${key} `
            + `to be of type '${expectedTypes.join('|')}', but found '${jsonObject[key]}' of type '${typeof jsonObject[key]}' instead`);
}

export function validatePropertyIterability(classType: classType | string, jsonObject: any, key: string) {
    if (!jsonObject[key] || typeof jsonObject[key] === 'string' || !jsonObject[key][Symbol.iterator])
        throw new Error(`IterableParsingError: Expected ${typeof classType === 'string' ? classType : classType.prototype.constructor.name}.${key} `
            + `to be iterable, but found '${jsonObject[key]}' of type '${typeof jsonObject[key]}' instead`);
}