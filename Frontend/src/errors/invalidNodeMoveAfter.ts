export class InvalidNodeMove extends Error {
  constructor(
        public readonly initialPath: number[],
        public readonly finalPath: number[]
  ) {
    super(`A node can\'t be moved from ${initialPath.join('.')} to ${finalPath.join('.')}.`);
  }
}