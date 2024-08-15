export class InvalidJsonObjectError extends Error {
    constructor(
        public readonly innerError: Error
    ) {
        super('JSON object does not respect the schema provided');
        // Workaround: https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, InvalidJsonObjectError.prototype);
    }
}