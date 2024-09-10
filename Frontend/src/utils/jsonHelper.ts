import Ajv from 'ajv';
import * as schemas from '../adaptedSchemas.json';

export class JsonHelper {
  private static readonly ajv = new Ajv({ strictSchema: true, schemas: schemas.definitions, addUsedSchema: true });

  static parseWithSchema<T>(schemaId: string, jsonObject: Record<string, any>): T {
    const valid = JsonHelper.ajv.validate(schemaId, jsonObject);
    if (!valid) throw new Error(`${JsonHelper.ajv.errorsText(JsonHelper.ajv.errors)}\n${JSON.stringify(jsonObject)}`);
    return jsonObject as T;
  }
}