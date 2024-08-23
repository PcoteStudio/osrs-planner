export class InvalidRouteJsonError extends Error {
  constructor(
        public readonly innerError: Error
  ) {
    super('Route json was invalid');
    // Workaround: https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, InvalidRouteJsonError.prototype);
  }
}